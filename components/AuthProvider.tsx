"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase/client";

type AuthContextType = {
  user: User | null;
  isLoadingUser: boolean;
  authError: string | null;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  async function refreshUser() {
    setIsLoadingUser(true);
    const { data, error } = await supabase.auth.getUser();

    setUser(data.user ?? null);
    setAuthError(error ? "We could not verify your session." : null);
    setIsLoadingUser(false);
  }

  useEffect(() => {
    let isActive = true;

    void supabase.auth.getUser().then(({ data, error }) => {
      if (!isActive) return;

      setUser(data.user ?? null);
      setAuthError(error ? "We could not verify your session." : null);
      setIsLoadingUser(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isActive) return;

      setUser(session?.user ?? null);
      setAuthError(null);
      setIsLoadingUser(false);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoadingUser, authError, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
