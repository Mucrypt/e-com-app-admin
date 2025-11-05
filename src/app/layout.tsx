import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { ResponsiveProvider } from '@/providers/responsive-provider'
import AppWrapper from '@/components/layout/AppWrapper'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'mukulah',
  description:
    'Mukulah Admin is a dashboard for managing products, orders, and users  e-commerce app.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ResponsiveProvider>
          <AppWrapper>
            {children}
          </AppWrapper>
        </ResponsiveProvider>
      </body>
    </html>
  )
}
