// @babelize-generated i18n config
"use client";
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(ICU)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    defaultNS: 'translation',
    // No process.env here: Vite and other browser builds don't define it (or its types).
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },
    backend: {
      loadPath: '/locales/{{lng}}.json',
    },
  });

export const t = i18n.t.bind(i18n);
export default i18n;
