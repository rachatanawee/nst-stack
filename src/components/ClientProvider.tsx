'use client'; // This must be the very first line

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n'; // Adjust path as needed
// No useEffect needed here for init

// Initialize i18n once with resources
if (!i18n.isInitialized) {
  i18n.init({
    lng: 'en', // Default language, will be overridden by locale prop
    resources: {}, // Initial empty resources, will be populated by prop
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
  });
}

export default function ClientProvider({ children, locale, resources }: { children: React.ReactNode; locale: string; resources: any }) {
  // Update i18n resources and language when props change
  if (resources && Object.keys(resources).length > 0) {
    Object.keys(resources).forEach(lng => {
      Object.keys(resources[lng]).forEach(ns => {
        i18n.addResourceBundle(lng, ns, resources[lng][ns], true, true);
      });
    });
  }
  if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}