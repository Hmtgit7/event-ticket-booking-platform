"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { useLocationStore } from "@/store/location-store";
import { DEFAULT_LOCALE, resolveSupportedLocale, type Locale } from "@/lib/i18n/locales";

type NamespaceMessages = Record<string, string>;
type Messages = Record<string, NamespaceMessages>;

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
}

const I18nContext = createContext<I18nContextValue>({ locale: DEFAULT_LOCALE, messages: {} });

/**
 * Deliberately NOT next-intl / App-Router path-based locale routing (that
 * needs every route moved under app/[locale]/ plus middleware - too large
 * and too risky to do without the ability to build/test locally). This is
 * a lightweight, additive layer instead: one JSON bundle per locale,
 * dynamically imported client-side, namespace-split the same way
 * speechcake's i18next setup is (see .tmp/speechcake/client/src/utils/langs).
 * A real next-intl migration (URL-prefixed locales, SSR-rendered
 * translations, proper <html lang>) is a bigger follow-up chunk of its own.
 */
async function loadMessages(locale: Locale): Promise<Messages> {
  const [common, auth, browse] = await Promise.all([
    import(`@/lib/i18n/messages/${locale}/common.json`).then((mod) => mod.default as NamespaceMessages),
    import(`@/lib/i18n/messages/${locale}/auth.json`).then((mod) => mod.default as NamespaceMessages),
    import(`@/lib/i18n/messages/${locale}/browse.json`).then((mod) => mod.default as NamespaceMessages),
  ]);
  return { common, auth, browse };
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const rawLanguage = useLocationStore((state) => state.language);
  const locale = resolveSupportedLocale(rawLanguage);
  const [messages, setMessages] = useState<Messages>({});

  useEffect(() => {
    let cancelled = false;

    loadMessages(locale)
      .then((loaded) => {
        if (!cancelled) setMessages(loaded);
      })
      .catch(() => {
        // Missing/broken locale bundle - fall back to English rather than leaving the page with no strings.
        if (cancelled || locale === DEFAULT_LOCALE) return;
        loadMessages(DEFAULT_LOCALE).then((loaded) => {
          if (!cancelled) setMessages(loaded);
        });
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return <I18nContext.Provider value={{ locale, messages }}>{children}</I18nContext.Provider>;
}

export function useI18nContext() {
  return useContext(I18nContext);
}
