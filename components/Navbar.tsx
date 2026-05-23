'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

export default function Navbar({ user, profile }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-105 transition-transform">
            A
          </div>
          <div>
            <div className="font-semibold text-2xl tracking-tighter">Anna Duyên An</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Violin • Art • Journey</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/nhat-ky" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Nhật Ký</Link>
          <Link href="/am-nhac" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Âm Nhạc</Link>
          <Link href="/nghe-thuat" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Nghệ Thuật</Link>
          <Link href="/hoc-thuat" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Học thuật</Link>
          <Link href="/ban-be" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Bạn Bè</Link>
          <Link href="/masterclass" className="text-pink-600 dark:text-pink-400 font-semibold">Masterclass</Link>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleDarkMode} className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <Link href="/admin" className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-2xl transition-colors">
              Admin
            </Link>
          ) : (
            <Link href="/dang-nhap" className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-2xl text-sm font-medium transition-colors">
              Đăng nhập
            </Link>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-3">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white dark:bg-gray-950 py-6">
          <div className="flex flex-col px-6 gap-6 text-base font-medium">
            <Link href="/nhat-ky">Nhật Ký</Link>
            <Link href="/am-nhac">Âm Nhạc</Link>
            <Link href="/nghe-thuat">Nghệ Thuật</Link>
            <Link href="/hoc-thuat">Học thuật</Link>
            <Link href="/ban-be">Bạn Bè</Link>
            <Link href="/masterclass">Masterclass</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
