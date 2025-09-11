'use client'; // This must be the very first line

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n'; // Adjust path as needed
import { Resource } from 'i18next'; // Import Resource type
import { useEffect } from 'react'; // Import useEffect

export default function ClientProvider({ children, locale, resources }: { children: React.ReactNode; locale: string; resources: Resource }) {
  // Initialize i18n with resources from SSR
  if (!i18n.isInitialized || i18n.language !== locale) {
    i18n.init({
      lng: locale,
      resources: resources,
      ns: ['common'],
      defaultNS: 'common',
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false,
      },
    });
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
