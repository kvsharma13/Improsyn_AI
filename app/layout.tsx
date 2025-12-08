import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Improsyn AI - Pharmed Voice Agent',
  description: 'AI-powered voice agent platform for Pharmed',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
