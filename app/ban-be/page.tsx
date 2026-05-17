export default function BanBePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-rose-500 text-xs tracking-widest uppercase mb-2">Diễn đàn · Giao lưu · Kết nối</p>
        <h1 className="text-4xl mb-3" style={{fontFamily:"'Playfair Display',serif"}}>
          👫 Bạn <em>Bè</em>
        </h1>
        <p className="text-gray-500">Nơi Anna và các bạn giao lưu, trao đổi về âm nhạc và cuộc sống.</p>
      </div>
      <div className="text-center py-24 text-gray-400">
        <div className="text-6xl mb-4">👫</div>
        <p>Diễn đàn sắp ra mắt!</p>
        <p className="text-sm mt-2">Đăng ký tài khoản để tham gia thảo luận cùng Anna.</p>
        <a href="/dang-ky" className="inline-block mt-4 px-6 py-2.5 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors">
          Đăng ký tham gia
        </a>
      </div>
    </div>
  )
}