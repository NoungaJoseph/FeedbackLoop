import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FeedbackLoop - Collect & Manage User Feedback',
  description: 'A powerful platform for businesses to collect, organize, and manage user feedback with voting and commenting.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://feedbackloop.app',
    siteName: 'FeedbackLoop',
    title: 'FeedbackLoop - Collect & Manage User Feedback',
    description: 'A powerful platform for businesses to collect, organize, and manage user feedback with voting and commenting.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FeedbackLoop Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FeedbackLoop - Collect & Manage User Feedback',
    description: 'A powerful platform for businesses to collect, organize, and manage user feedback with voting and commenting.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
