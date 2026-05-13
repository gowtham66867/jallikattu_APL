import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jallikattu Live - Second Screen Experience',
  description: 'Experience the thrill of Jallikattu like never before with real-time predictions, crowd energy, and cultural immersion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-arena via-earth/50 to-arena">
        {children}
      </body>
    </html>
  )
}
