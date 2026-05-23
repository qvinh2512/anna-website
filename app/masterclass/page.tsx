// app/masterclass/page.tsx
import { getSiteSettings } from '@/lib/settings';
import Image from 'next/image';
import Link from 'next/link';

export default async function MasterclassPage() {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-[#fdfaf5] dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/violin-masterclass.jpg')] bg-cover bg-center opacity-70"></div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1 bg-pink-600 text-white text-sm rounded-full mb-6">
            Masterclass Violin
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white tracking-tighter mb-6">
            Masterclass<br />cùng Anna Duyên An
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Chia sẻ kinh nghiệm, kỹ thuật violin và hành trình âm nhạc từ cô bé tài năng sinh năm 2014
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Thông tin Masterclass */}
          <div>
            <h2 className="text-4xl font-semibold mb-8">Masterclass Violin</h2>
            
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm">
                <h3 className="text-2xl font-medium mb-4">Nội dung Masterclass</h3>
                <ul className="space-y-4 text-lg">
                  <li className="flex gap-3">🎻 Kỹ thuật cơ bản & tư thế đúng</li>
                  <li className="flex gap-3">🎵 Cách diễn đạt cảm xúc qua âm nhạc</li>
                  <li className="flex gap-3">📝 Luyện tập hiệu quả cho trẻ em</li>
                  <li className="flex gap-3">🌟 Chuẩn bị thi & biểu diễn</li>
                  <li className="flex gap-3">❤️ Xây dựng tình yêu âm nhạc lâu dài</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm">
                <h3 className="text-2xl font-medium mb-4">Đối tượng</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Trẻ em từ 7–16 tuổi, phụ huynh và giáo viên violin muốn học hỏi phương pháp dạy con hiệu quả.
                </p>
              </div>
            </div>
          </div>

          {/* Video & Đăng ký */}
          <div>
            <div className="aspect-video bg-black rounded-3xl overflow-hidden mb-8">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/VIDEO_ID_HERE" 
                title="Masterclass Anna Duyên An"
                allowFullScreen
                className="rounded-3xl"
              ></iframe>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-violet-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-3xl">
              <h3 className="text-2xl font-semibold mb-6">Đăng ký tham gia Masterclass</h3>
              
              <div className="space-y-4">
                <button className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-2xl transition-all text-lg">
                  Đăng ký Masterclass sắp tới
                </button>
                
                <p className="text-center text-sm text-gray-500">
                  Hoặc liên hệ qua email: <span className="font-medium">{settings.email || "contact@annaduyenan.info"}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Các video nổi bật */}
        <div className="mt-20">
          <h2 className="text-3xl font-semibold mb-10">Các buổi Masterclass nổi bật</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bạn có thể thêm nhiều card video ở đây */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  ▶️
                </div>
              </div>
              <div className="p-6">
                <p className="font-medium">Que Sera Sera - Violin Performance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
