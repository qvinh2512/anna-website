import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';

export default function Navbar({ user, profile }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setDarkMode(!darkMode);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          <div>
            <div className="font-semibold text-xl tracking-tight">Anna Duyên An</div>
            <div className="text-[10px] text-gray-500 -mt-1">Violinist & Artist</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/nhat-ky" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Nhật Ký</Link>
          <Link href="/am-nhac" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Âm Nhạc</Link>
          <Link href="/nghe-thuat" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Nghệ Thuật</Link>
          <Link href="/hoc-tap" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Học Tập</Link>
          <Link href="/masterclass" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Masterclass</Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <Link href="/admin" className="text-sm px-5 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors">
              Admin
            </Link>
          ) : (
            <Link href="/auth/login" className="text-sm px-5 py-2 border border-gray-300 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              Đăng nhập
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white dark:bg-gray-950 py-4">
          <div className="flex flex-col px-6 gap-4 text-sm">
            <Link href="/nhat-ky" className="py-2">Nhật Ký</Link>
            <Link href="/am-nhac" className="py-2">Âm Nhạc</Link>
            <Link href="/nghe-thuat" className="py-2">Nghệ Thuật</Link>
            <Link href="/hoc-tap" className="py-2">Học Tập</Link>
            <Link href="/masterclass" className="py-2">Masterclass</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
