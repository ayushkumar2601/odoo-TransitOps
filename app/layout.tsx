import type { Metadata } from 'next'

import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Inter } from 'next/font/google'

// Initialize fonts per Airtable/Linear enterprise hierarchy
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
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
import { ThemeProvider } from '@/lib/theme/theme-provider'

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
        '--font-heading': inter.style.fontFamily,
        '--font-body': inter.style.fontFamily,
      } as React.CSSProperties}
    >
      <body
        suppressHydrationWarning
        className={`${inter.className} antialiased bg-background text-on-background overflow-x-hidden selection:bg-[#FF5A36]/20 selection:text-[#FF5A36]`}
      >
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
