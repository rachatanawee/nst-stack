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
import { useTranslation } from '@/lib/i18n.server';

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { locale } = params;
  const { i18n } = await useTranslation(locale);
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