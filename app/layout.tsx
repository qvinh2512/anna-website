import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { createClient } from './lib/supabase/server'

export const metadata: Metadata = {
  title: 'Anna Duyên An',
  description: 'Nhật ký hành trình Âm nhạc & Nghệ thuật',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-amber-50">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b h-16 flex items-center justify-between px-6">
          <a href="/" className="text-lg font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>
            Anna <span className="text-rose-500">Duyên An</span>
          </a>
          <div className="flex items-center gap-1 text-sm">
            {[
              ['📖 Nhật Ký','/nhat-ky'],
              ['🎻 Âm Nhạc','/am-nhac'],
              ['🎨 Nghệ Thuật','/nghe-thuat'],
              ['📚 Học Thuật','/hoc-thuat'],
              ['👫 Bạn Bè','/ban-be'],
              ['🌏 Xã Hội','/xa-hoi'],
            ].map(([label,href]) => (
              <a key={href} href={href} className="px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors hidden lg:block">
                {label}
              </a>
            ))}
            {user ? (
              <a href="/admin" className="ml-2 px-4 py-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors">
                ⚙️ Quản lý
              </a>
            ) : (
              <a href="/dang-nhap" className="ml-2 px-4 py-1.5 border border-rose-300 text-rose-500 rounded-full hover:bg-rose-50 transition-colors">
                Đăng nhập
              </a>
            )}
          </div>
        </nav>
        <main className="flex-1 pt-16">{children}</main>
        <footer className="bg-gray-900 text-center py-8">
          <p className="text-white text-lg italic mb-1" style={{fontFamily:"'Playfair Display',serif"}}>
            Anna <span className="text-yellow-400">Duyên An</span>
          </p>
          <p className="text-gray-400 text-sm italic mb-3">"Que sera sera"</p>
          <a href="https://www.youtube.com/@AnnaDuyenAn" target="_blank" className="text-red-400 text-sm hover:text-red-300">
            ▶ YouTube @AnnaDuyenAn
          </a>
          <p className="mt-3 text-gray-600 text-xs">© 2025 Anna Duyên An · TP. Hồ Chí Minh</p>
        </footer>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}