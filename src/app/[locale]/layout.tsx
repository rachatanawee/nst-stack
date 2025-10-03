import type { Metadata } from 'next'
import { Noto_Sans_Thai } from 'next/font/google'
import './globals.css'

const noto = Noto_Sans_Thai({ subsets: ['latin', 'thai'] })

export const metadata: Metadata = {
  title: 'nst-stack',
  description: 'Event management platform',
}

import ClientProvider from '@/components/ClientProvider';
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { Toaster } from '@/components/ui/sonner';

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
      <body className={noto.className}>
        <ClientProvider locale={locale} resources={resources}> {/* Pass resources to ClientProvider */}
          {children}
        </ClientProvider>
        <Toaster />
      </body>
    </html>
  )
}