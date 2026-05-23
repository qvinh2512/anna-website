// components/Footer.tsx
import Link from 'next/link';
import { getSiteSettings } from '@/lib/settings';

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand + Bio */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-violet-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-inner">
                A
              </div>
              <div>
                <div className="text-3xl font-semibold tracking-tight">Anna Duyên An</div>
                <div className="text-sm text-pink-600 dark:text-pink-400">
                  {settings.tagline || "Violinist • Young Artist"}
                </div>
              </div>
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
              {settings.bio || "Hành trình âm nhạc, nghệ thuật và sự trưởng thành của một cô bé tài năng."}
            </p>
            
            <div className="mt-6 text-xs uppercase tracking-widest text-gray-500">
              Sinh năm 2014
            </div>
          </div>

          {/* Khám phá */}
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-6 text-lg">Khám phá</h4>
            <div className="space-y-4 text-[15px] text-gray-600 dark:text-gray-400">
              <Link href="/nhat-ky" className="hover:text-pink-600 transition-colors block">{settings.menu_nhatky || "Nhật Ký"}</Link>
              <Link href="/am-nhac" className="hover:text-pink-600 transition-colors block">{settings.menu_amnhac || "Âm Nhạc"}</Link>
              <Link href="/nghe-thuat" className="hover:text-pink-600 transition-colors block">{settings.menu_nghethuat || "Nghệ Thuật"}</Link>
              <Link href="/hoc-thuat" className="hover:text-pink-600 transition-colors block">{settings.menu_hocthuat || "Học thuật"}</Link>
              <Link href="/masterclass" className="hover:text-pink-600 transition-colors block">Masterclass</Link>
            </div>
          </div>

          {/* Liên hệ */}
          <div className="md:col-span-2">
            <h4 className="font-semibold mb-6 text-lg">Liên hệ</h4>
            <div className="space-y-3 text-[15px]">
              <p>
                Email: <span className="text-gray-900 dark:text-white">{settings.email || "contact@annaduyenan.info"}</span>
              </p>
              <p>
                Điện thoại: <span className="text-gray-900 dark:text-white">{settings.phone || "+84 123 456 789"}</span>
              </p>
            </div>
          </div>

          {/* Theo dõi */}
          <div className="md:col-span-3">
            <h4 className="font-semibold mb-6 text-lg">Theo dõi Anna</h4>
            <div className="space-y-3 text-[15px]">
              {settings.social_youtube && (
                <a href={settings.social_youtube} target="_blank" className="hover:text-pink-600 transition-colors flex items-center gap-2">
                  → YouTube
                </a>
              )}
              {settings.social_instagram && (
                <a href={settings.social_instagram} target="_blank" className="hover:text-pink-600 transition-colors flex items-center gap-2">
                  → Instagram
                </a>
              )}
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" className="hover:text-pink-600 transition-colors flex items-center gap-2">
                  → Facebook
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
          © 2026 Anna Duyên An • All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
