/**
 * Internationalization configuration for the government agency website
 * This configuration sets up translations for English, French, and Arabic
 * with English as the default language
 */
const path = require('path');

module.exports = {
  i18n: {
    // List of supported locales
    locales: ['en', 'fr', 'ar'],
    
    // Default locale
    defaultLocale: 'en',
    
    // Whether to use a localeDetector to automatically detect the user's locale
    localeDetection: true,
    
    // Domains configuration for different locales - uncomment and update when deploying
    /*
    domains: [
      {
        domain: 'govagency.gov',
        defaultLocale: 'en',
      },
      {
        domain: 'fr.govagency.gov',
        defaultLocale: 'fr',
      },
      {
        domain: 'ar.govagency.gov',
        defaultLocale: 'ar',
      },
    ],
    */
  },
  
  // Default namespace used in your i18n files
  defaultNS: 'common',
  
  // List of namespaces required by the app
  ns: [
    'common',
    'home', 
    'about', 
    'services',
    'news',
    'documents',
    'contact',
    'maps',
    'forms', 
    'footer',
    'validation',
    'error',
    'accessibility'
  ],
  
  // Configuration for loading translations
  localePath: path.resolve('./public/locales'),
  
  // Whether to detect language from the browser
  detection: {
    order: ['path', 'cookie', 'header'],
    caches: ['cookie'],
    cookieSecure: process.env.NODE_ENV === 'production',
    lookupCookie: 'NEXT_LOCALE',
    cookieExpirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  },
  
  // Disable built-in rewrite behavior for paths with locale prefixes
  // This allows us to handle language specific SEO needs
  localeStructure: '{{lng}}/{{ns}}',
  
  // This function is executed when a new locale is loaded
  // Use this to format dates, numbers, etc. based on the locale
  interpolation: {
    escapeValue: false,
    format: (value, format, lng) => {
      if (format === 'uppercase') return value.toUpperCase();
      if (format === 'currency' && lng === 'ar') {
        return new Intl.NumberFormat('ar-SA', { 
          style: 'currency', 
          currency: 'SAR' 
        }).format(value);
      }
      if (format === 'currency' && lng === 'fr') {
        return new Intl.NumberFormat('fr-FR', { 
          style: 'currency', 
          currency: 'MAD' 
        }).format(value);
      }
      if (format === 'currency') {
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'MAD' 
        }).format(value);
      }
      if (format === 'date') {
        return new Date(value).toLocaleDateString(lng);
      }
      return value;
    }
  },
  
  // Load translations
  react: {
    useSuspense: false,
  },
  
  // Use HTML in translation files for complex formatting
  // WARNING: Make sure all HTML strings are properly sanitized
  transSupportBasicHtmlNodes: true,
  transKeepBasicHtmlNodesFor: ['br', 'strong', 'b', 'i', 'em', 'a', 'p', 'span'],
  
  // RTL support for Arabic
  load: 'currentOnly',
  returnEmptyString: false,
  returnNull: false,
  returnObjects: true,
  saveMissing: process.env.NODE_ENV !== 'production',
  saveMissingTo: 'fallback',
  missingKeyHandler: (lng, ns, key, fallbackValue) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Missing translation: ${lng}:${ns}:${key}`);
    }
  },
  
  // Ensure fallback language works in a specific order
  fallbackLng: {
    'ar-SA': ['ar', 'en'],
    'fr-FR': ['fr', 'en'],
    'default': ['en']
  },
  
  // Override how keys are separated
  keySeparator: '.',
};