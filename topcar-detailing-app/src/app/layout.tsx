import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Top Car Detailing - Professional Car Detailing Services',
  description: 'Book professional car detailing services with Top Car Detailing. From basic washes to premium paint protection, we provide quality mobile car detailing services.',
  keywords: 'car detailing, mobile car wash, paint protection, interior cleaning, exterior detailing',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}
