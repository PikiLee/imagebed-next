import './globals.css'

import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'

import Header from '@/components/header'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Image Bed Next',
  description: 'Self-hosted image hosting service',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased container py-24',
          fontSans.variable
        )}
      >
        <Header />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
