import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
              <span className="font-semibold">Anna Duyên An</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hành trình của một cô bé yêu âm nhạc và nghệ thuật.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Khám phá</h4>
            <div className="space-y-2 text-sm">
              <Link href="/nhat-ky" className="block text-gray-600 dark:text-gray-400 hover:text-pink-600">Nhật ký</Link>
              <Link href="/am-nhac" className="block text-gray-600 dark:text-gray-400 hover:text-pink-600">Âm nhạc</Link>
              <Link href="/nghe-thuat" className="block text-gray-600 dark:text-gray-400 hover:text-pink-600">Nghệ thuật</Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Liên hệ</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <p>Email: contact@annaduyenan.info</p>
              <p>YouTube: Anna Duyên An</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Theo dõi</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Cập nhật hành trình của Anna qua Instagram và YouTube.
            </p>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          © 2026 Anna Duyên An. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
