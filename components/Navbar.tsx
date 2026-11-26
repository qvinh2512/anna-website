'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, User } from 'lucide-react';

const LINKS = [
  { href: '/nhat-ky',    label: 'Nhật ký' },
  { href: '/am-nhac',    label: 'Âm nhạc' },
  { href: '/nghe-thuat', label: 'Nghệ thuật' },
  { href: '/hoc-thuat',  label: 'Học thuật' },
  { href: '/masterclass', label: 'Masterclass' },
  { href: '/thanh-tich', label: 'Thành tích' },
  { href: '/ban-be',     label: 'Bạn bè' },
];

const LINKS_EN = [
  { href: '/nhat-ky',       label: 'Diary' },
  { href: '/am-nhac',       label: 'Music' },
  { href: '/nghe-thuat',    label: 'Art' },
  { href: '/hoc-thuat',     label: 'Studies' },
  { href: '/masterclass',   label: 'Masterclass' },
  { href: '/en/milestones', label: 'Milestones' },
  { href: '/ban-be',        label: 'Friends' },
];

// Cặp trang tương ứng Việt ↔ Anh
const PAIRS: [string, string][] = [['/thanh-tich', '/en/milestones'], ['/', '/en']];

export default function Navbar({ user, profile }: any) {
  const pathname = usePathname() || '/';
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  // Đóng menu điện thoại khi chuyển trang
  useEffect(() => { setIsOpen(false) }, [pathname]);

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

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const isEnglish = pathname === '/en' || pathname.startsWith('/en/');
  const links = isEnglish ? LINKS_EN : LINKS;
  const switchHref = isEnglish
    ? (PAIRS.find(([, e]) => e === pathname)?.[0] || '/')
    : (PAIRS.find(([v]) => v === pathname)?.[1] || '/en');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 group min-w-0">
          <div className="w-9 h-9 flex-shrink-0 bg-gradient-to-br from-pink-500 via-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform"
            style={{ fontFamily: "'Playfair Display',serif" }}>
            A
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-base sm:text-lg leading-tight whitespace-nowrap" style={{ fontFamily: "'Playfair Display',serif" }}>
              Anna Duyên An
            </div>
            <div className="hidden sm:block text-[11px] text-gray-500 dark:text-gray-400 tracking-wide">Violin • Art • Journey</div>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`relative py-1 transition-colors ${isActive(l.href)
                ? 'text-pink-600 dark:text-pink-400 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-pink-500 after:rounded-full'
                : 'text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400'}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <Link href={switchHref}
            className="px-2.5 py-1.5 text-xs font-semibold tracking-wide rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-pink-400 hover:text-pink-600 transition-colors"
            title={isEnglish ? 'Tiếng Việt' : 'English'}>
            {isEnglish ? 'VI' : 'EN'}
          </Link>

          <button onClick={toggleDarkMode} aria-label="Đổi giao diện sáng/tối"
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden xl:block text-sm text-gray-500 dark:text-gray-400">
                Xin chào, <span className="font-medium text-gray-800 dark:text-gray-200">{profile?.full_name || 'Bạn'}</span>
              </span>
              {profile?.role === 'anna' && (
                <Link href="/admin" className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-medium rounded-lg transition-colors">
                  Admin
                </Link>
              )}
            </div>
          ) : (
            <Link href="/dang-nhap" aria-label={isEnglish ? 'Sign in' : 'Đăng nhập'} title={isEnglish ? 'Sign in' : 'Đăng nhập'}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-pink-600 transition-colors">
              <User size={18} />
            </Link>
          )}

          <button onClick={() => setIsOpen(!isOpen)} aria-label="Menu" className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg">
          <div className="flex flex-col px-4 py-3 text-base font-medium">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className={`px-3 py-3 rounded-xl ${isActive(l.href)
                  ? 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
