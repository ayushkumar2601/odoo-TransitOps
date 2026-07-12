import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'

// Initialize fonts
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TransitOps — Enterprise Fleet Intelligence Platform',
  description: 'AI-powered transport operations, digital twins, predictive maintenance, and real-time haulage dispatch.',
  generator: 'TransitOps',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

import { MapBackground } from '@/components/map-background'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark scroll-smooth"
      style={{
        '--font-heading': plusJakarta.style.fontFamily,
        '--font-body': plusJakarta.style.fontFamily,
      } as React.CSSProperties}
    >
      <body
        suppressHydrationWarning
        className={`${plusJakarta.className} antialiased bg-background text-on-background overflow-x-hidden selection:bg-surface-variant selection:text-primary`}
      >
        <MapBackground />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
