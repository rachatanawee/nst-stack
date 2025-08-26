import type { Metadata } from 'next'
import { Mitr } from 'next/font/google'
import './globals.css'

import { Toaster } from '@/components/ui/sonner'

const mitr = Mitr({ subsets: ['latin', 'thai'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'Eventify',
  description: 'Event management platform',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={mitr.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}