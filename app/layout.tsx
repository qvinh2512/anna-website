import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { createClient } from './lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Anna Duyên An',
  description: 'Hành trình âm nhạc - nghệ thuật - trưởng thành của Anna Duyên An',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user ? await supabase
    .from('profiles').select('full_name,role').eq('id', user.id).single() 
    : { data: null }

  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-[#fdfaf5] dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <Navbar user={user} profile={profile} />
        
        <main className="pt-16">
          {children}
        </main>

        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
