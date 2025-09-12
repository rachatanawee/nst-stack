'use client'; // This must be the very first line

import { I18nextProvider } from 'react-i18next';
import { createInstance, Resource } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';

export default function ClientProvider({ children, locale, resources }: { children: React.ReactNode; locale: string; resources: Resource }) {
  const i18nInstance = createInstance();

  i18nInstance
    .use(initReactI18next)
    .init({
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

  return (
    <I18nextProvider i18n={i18nInstance}>
      {children}
    </I18nextProvider>
  );
}
