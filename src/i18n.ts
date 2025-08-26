import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    ns: ['common'], // Specify namespaces
    defaultNS: 'common', // Set default namespace
    load: 'languageOnly', // Load only the language, not specific regional variants
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['path', 'navigator'], // Prioritize path for language detection
      lookupFromPathIndex: 0, // Look for language in the first path segment
      checkWhitelist: true, // Only use whitelisted languages
    },
  });

export default i18n;
