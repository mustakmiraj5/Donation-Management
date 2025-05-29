import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Donation Management',
  description: 'Created by Mustak Sahariar',
  generator: 'miraj.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
    <Navbar />
    <html lang="en">
      
      <body>
        
        {children}
      </body>
    </html>
    </>
  )
}
