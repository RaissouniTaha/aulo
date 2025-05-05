import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { useEffect, useState } from 'react';

// Type definition for language
export type Language = {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
};

// Available languages
export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
];

export const defaultLanguage = 'en';

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: defaultLanguage,
    debug: process.env.NODE_ENV === 'development',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      // Path to load translations from
      loadPath: '/src/assets/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage'],
    },
  });

// Helper function to get language by code
export function getLanguage(code: string): Language {
  return languages.find(lang => lang.code === code) || languages[0];
}

// Custom hook to manage language settings
export function useLanguage() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<Language>(getLanguage(
    i18n.language || localStorage.getItem('language') || defaultLanguage
  ));

  // Change language function
  const changeLanguage = (langCode: string) => {
    const newLang = getLanguage(langCode);
    i18n.changeLanguage(langCode);
    setLanguage(newLang);
    localStorage.setItem('language', newLang.code);
    document.documentElement.dir = newLang.direction;
    document.documentElement.lang = newLang.code;
  };

  // Set initial document direction and language
  useEffect(() => {
    document.documentElement.dir = language.direction;
    document.documentElement.lang = language.code;
  }, [language]);

  return {
    language,
    languages,
    changeLanguage,
  };
}

export { useTranslation };
