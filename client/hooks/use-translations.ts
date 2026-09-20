"use client";

import { useI18nContext } from "@/providers/i18n-provider";

/**
 * Mirrors next-intl/react-i18next's common useTranslations(namespace) shape
 * on purpose - if/when this gets swapped for a real i18n library (see
 * I18nProvider's comment on why that's a separate, bigger chunk), call
 * sites using this hook shouldn't need to change.
 */
export function useTranslations(namespace: string) {
  const { messages } = useI18nContext();
  const scoped = messages[namespace] ?? {};

  return function t(key: string, fallback?: string): string {
    return scoped[key] ?? fallback ?? key;
  };
}
