import { useEffect, useState } from 'react';

type Language = {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
};

export const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
];

export const defaultLanguage = 'en';

export function getLanguage(code: string): Language {
  return languages.find(lang => lang.code === code) || languages[0];
}

export function useLanguage() {
  const [language, setLanguage] = useState<Language>(getLanguage(
    localStorage.getItem('language') || defaultLanguage
  ));

  const changeLanguage = (langCode: string) => {
    const newLang = getLanguage(langCode);
    setLanguage(newLang);
    localStorage.setItem('language', newLang.code);
    document.documentElement.dir = newLang.direction;
    document.documentElement.lang = newLang.code;
  };

  useEffect(() => {
    // Set the initial document direction based on the language
    document.documentElement.dir = language.direction;
    document.documentElement.lang = language.code;
  }, [language]);

  return {
    language,
    languages,
    changeLanguage,
  };
}

// Basic translation function
export function useTranslation() {
  const { language } = useLanguage();
  
  // This is a simplified version - in a real app, you would load translations from JSON files
  const getTranslation = (key: string, placeholders: Record<string, string> = {}): string => {
    let translation = key;
    
    // Replace placeholders in the translation
    Object.entries(placeholders).forEach(([key, value]) => {
      translation = translation.replace(`{{${key}}}`, value);
    });
    
    return translation;
  };
  
  return {
    t: getTranslation,
    language,
  };
}
