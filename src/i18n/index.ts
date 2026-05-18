import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import es from './locales/es';

const SUPPORTED = ['en', 'es'] as const;
type SupportedLocale = (typeof SUPPORTED)[number];

function resolveLocale(): SupportedLocale {
  const code = getLocales()[0]?.languageCode ?? 'es';
  return SUPPORTED.includes(code as SupportedLocale) ? (code as SupportedLocale) : 'es';
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: resolveLocale(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  });
}

export default i18n;
