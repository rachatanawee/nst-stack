import type { Metadata } from 'next'
import { Mitr } from 'next/font/google'
import './globals.css'

import { Toaster } from '@/components/ui/sonner'

const mitr = Mitr({ subsets: ['latin', 'thai'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'nst-stack',
  description: 'Event management platform',
}

import ClientProvider from '@/components/ClientProvider'; // Add this import
import i18n from 'i18next'; // Import i18next
import Backend from 'i18next-fs-backend'; // Import i18next-fs-backend
import { initReactI18next } from 'react-i18next/initReactI18next'; // Import initReactI18next

// Initialize i18next on the server
i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: process.cwd() + '/public/locales/{{lng}}/{{ns}}.json',
    },
    lng: 'en', // Default language for server-side rendering
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    preload: ['en', 'th'], // Preload all supported languages
  });

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = await params; // Explicitly await params
  // Load translations for the current locale
  await i18n.changeLanguage(locale);
  const resources = i18n.services.resourceStore.data;

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