import type { Metadata } from 'next'
import { Mitr } from 'next/font/google'
import './globals.css'

import { Toaster } from '@/components/ui/sonner'

const mitr = Mitr({ subsets: ['latin', 'thai'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'nst-stack',
  description: 'Event management platform',
}

import ClientProvider from '@/components/ClientProvider';
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';

const initI18next = async (lng: string, ns: string) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(resourcesToBackend((language: string, namespace: string) => import(`../../../public/locales/${language}/${namespace}.json`)))
    .init({
      lng,
      ns,
      fallbackLng: 'en',
      defaultNS: 'common',
      preload: ['en', 'th'],
    });
  return i18nInstance;
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params
}: LayoutProps) {
  const { locale } = await params;
  const i18nInstance = await initI18next(locale, 'common');
  const resources = i18nInstance.services.resourceStore.data;

  return (
    <html lang={locale}>
      <body className={mitr.className}>
        <ClientProvider locale={locale} resources={resources}> {/* Pass resources to ClientProvider */}
          {children}
        </ClientProvider>
        <Toaster />
      </body>
    </html>
  )
}