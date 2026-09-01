"use client";

import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import {
  LOG_LEVEL,
  Purchases,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from "@revenuecat/purchases-capacitor";
import { createContext, useContext, useEffect, useState } from "react";
import {
  getBillingErrorMessage,
  PRO_BILLING_ENABLED,
  PRO_ENTITLEMENT_ID,
  type ProPackageKey,
} from "../lib/billing";
import { getApiUrl } from "../lib/api";
import { supabase } from "../lib/supabase/client";
import { useAuth } from "./AuthProvider";
import { useLanguage } from "./LanguageProvider";
import { usePlan } from "./PlanProvider";

type BillingAvailability =
  | "disabled"
  | "web"
  | "loading"
  | "ready"
  | "unavailable";

type BillingContextType = {
  availability: BillingAvailability;
  offering: PurchasesOffering | null;
  packages: Record<ProPackageKey, PurchasesPackage | null>;
  customerInfo: CustomerInfo | null;
  hasStoreProEntitlement: boolean;
  billingError: string | null;
  isProcessingPurchase: boolean;
  purchase: (packageKey: ProPackageKey) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  manageSubscription: () => void;
  clearBillingError: () => void;
};

const BillingContext = createContext<BillingContextType | null>(null);

function getNativeApiKey() {
  const platform = Capacitor.getPlatform();
  if (platform === "ios") {
    return process.env.NEXT_PUBLIC_REVENUECAT_IOS_API_KEY || null;
  }
  if (platform === "android") {
    return process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_API_KEY || null;
  }
  return null;
}

export function BillingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { reloadPlan } = usePlan();
  const [availability, setAvailability] =
    useState<BillingAvailability>("disabled");
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);
  const billingEnabled = PRO_BILLING_ENABLED;

  async function syncServerPlan() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.access_token) return false;

    const response = await fetch(getApiUrl("/api/billing/sync"), {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!response.ok) return false;

    await reloadPlan();
    return true;
  }

  useEffect(() => {
    if (!billingEnabled) {
      setOffering(null);
      setCustomerInfo(null);
      setAvailability("disabled");
      return;
    }

    if (!Capacitor.isNativePlatform()) {
      setOffering(null);
      setCustomerInfo(null);
      setAvailability("web");
      return;
    }

    const apiKey = getNativeApiKey();
    if (!apiKey || !user) {
      setOffering(null);
      setCustomerInfo(null);
      setAvailability("unavailable");
      return;
    }

    let isActive = true;
    let listenerId: string | null = null;
    setAvailability("loading");
    setBillingError(null);

    async function configureBilling() {
      try {
        await Purchases.setLogLevel({ level: LOG_LEVEL.ERROR });

        const configuration = await Purchases.isConfigured();
        if (!configuration.isConfigured) {
          await Purchases.configure({ apiKey: apiKey!, appUserID: user!.id });
        } else {
          const currentIdentity = await Purchases.getAppUserID();
          if (
            currentIdentity.appUserID !== user!.id &&
            !currentIdentity.appUserID.startsWith("$RCAnonymousID:")
          ) {
            await Purchases.logOut();
          }

          if (currentIdentity.appUserID !== user!.id) {
            const login = await Purchases.logIn({ appUserID: user!.id });
            if (isActive) setCustomerInfo(login.customerInfo);
          }
        }

        listenerId = await Purchases.addCustomerInfoUpdateListener((info) => {
          if (isActive) setCustomerInfo(info);
        });

        const [offerings, customer] = await Promise.all([
          Purchases.getOfferings(),
          Purchases.getCustomerInfo(),
        ]);
        if (!isActive) return;

        setOffering(offerings.current);
        setCustomerInfo(customer.customerInfo);
        setAvailability(offerings.current ? "ready" : "unavailable");
      } catch (error) {
        if (!isActive) return;
        console.error("Failed to configure RevenueCat", error);
        setBillingError(getBillingErrorMessage(error, language));
        setAvailability("unavailable");
      }
    }

    void configureBilling();

    return () => {
      isActive = false;
      if (listenerId) {
        void Purchases.removeCustomerInfoUpdateListener({
          listenerToRemove: listenerId,
        });
      }
    };
  }, [billingEnabled, language, user]);

  const packages: Record<ProPackageKey, PurchasesPackage | null> = {
    monthly: offering?.monthly ?? null,
    annual: offering?.annual ?? null,
    lifetime: offering?.lifetime ?? null,
  };
  const hasStoreProEntitlement = Boolean(
    customerInfo?.entitlements.active[PRO_ENTITLEMENT_ID]
  );

  async function purchase(packageKey: ProPackageKey) {
    const selectedPackage = packages[packageKey];
    if (!selectedPackage || availability !== "ready") return false;

    setBillingError(null);
    setIsProcessingPurchase(true);
    try {
      const result = await Purchases.purchasePackage({
        aPackage: selectedPackage,
      });
      setCustomerInfo(result.customerInfo);
      const purchasedPro = Boolean(
        result.customerInfo.entitlements.active[PRO_ENTITLEMENT_ID]
      );
      const didSync = purchasedPro ? await syncServerPlan() : true;
      if (purchasedPro && !didSync) {
        setBillingError(
          language === "es"
            ? "Tu compra se completo, pero el acceso todavia se esta sincronizando. No compres otra vez. Usa Restaurar compras en unos minutos o contacta soporte."
            : "Your purchase completed, but access is still syncing. Do not purchase again. Use Restore Purchases in a few minutes or contact support."
        );
      }
      return purchasedPro;
    } catch (error) {
      const message = getBillingErrorMessage(error, language);
      if (message) setBillingError(message);
      return false;
    } finally {
      setIsProcessingPurchase(false);
    }
  }

  async function restorePurchases() {
    if (availability !== "ready") return false;

    setBillingError(null);
    setIsProcessingPurchase(true);
    try {
      const result = await Purchases.restorePurchases();
      setCustomerInfo(result.customerInfo);
      const restoredPro = Boolean(
        result.customerInfo.entitlements.active[PRO_ENTITLEMENT_ID]
      );
      const didSync = restoredPro ? await syncServerPlan() : true;
      if (restoredPro && !didSync) {
        setBillingError(
          language === "es"
            ? "Encontramos tu compra, pero el acceso todavia se esta sincronizando. Intentalo de nuevo en unos minutos o contacta soporte."
            : "We found your purchase, but access is still syncing. Try again in a few minutes or contact support."
        );
      }
      return restoredPro;
    } catch (error) {
      const message = getBillingErrorMessage(error, language);
      if (message) setBillingError(message);
      return false;
    } finally {
      setIsProcessingPurchase(false);
    }
  }

  function manageSubscription() {
    if (customerInfo?.managementURL) {
      if (Capacitor.isNativePlatform()) {
        void Browser.open({ url: customerInfo.managementURL });
      } else {
        window.location.assign(customerInfo.managementURL);
      }
    }
  }

  return (
    <BillingContext.Provider
      value={{
        availability,
        offering,
        packages,
        customerInfo,
        hasStoreProEntitlement,
        billingError,
        isProcessingPurchase,
        purchase,
        restorePurchases,
        manageSubscription,
        clearBillingError: () => setBillingError(null),
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (!context) {
    throw new Error("useBilling must be used inside BillingProvider");
  }
  return context;
}
