"use client";

import { App } from "@capacitor/app";
import { Capacitor, type PluginListenerHandle } from "@capacitor/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { parseNativeAuthUrl } from "../lib/nativeLinks";
import { supabase } from "../lib/supabase/client";

const nativeAuthErrorKey = "wiwi:native-auth-error";

export function NativeLinkProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let isActive = true;
    let listener: PluginListenerHandle | null = null;
    const handledUrls = new Set<string>();

    async function handleUrl(url: string) {
      if (!isActive || handledUrls.has(url)) return;
      handledUrls.add(url);

      const callback = parseNativeAuthUrl(url);
      if (!callback) return;

      let authFailed = Boolean(callback.error);

      if (!authFailed && callback.code) {
        const { error } = await supabase.auth.exchangeCodeForSession(
          callback.code
        );
        authFailed = Boolean(error);
      } else if (
        !authFailed &&
        callback.accessToken &&
        callback.refreshToken
      ) {
        const { error } = await supabase.auth.setSession({
          access_token: callback.accessToken,
          refresh_token: callback.refreshToken,
        });
        authFailed = Boolean(error);
      } else if (!authFailed) {
        const { data } = await supabase.auth.getSession();
        authFailed = !data.session;
      }

      if (!isActive) return;

      if (authFailed) {
        if (callback.path === "/reset-password") {
          router.replace("/reset-password?native_error=1");
        } else {
          sessionStorage.setItem(nativeAuthErrorKey, "confirmation");
          router.replace("/login");
        }
        return;
      }

      router.replace(callback.path);
    }

    async function listenForLinks() {
      listener = await App.addListener("appUrlOpen", ({ url }) => {
        void handleUrl(url);
      });

      const launchUrl = await App.getLaunchUrl();
      if (launchUrl?.url) {
        await handleUrl(launchUrl.url);
      }
    }

    void listenForLinks();

    return () => {
      isActive = false;
      void listener?.remove();
    };
  }, [router]);

  return children;
}

export function consumeNativeAuthError() {
  if (typeof window === "undefined") return null;

  const error = sessionStorage.getItem(nativeAuthErrorKey);
  sessionStorage.removeItem(nativeAuthErrorKey);
  return error;
}
