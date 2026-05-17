export default function NhatKyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-rose-500 text-xs tracking-widest uppercase mb-2">Hằng ngày</p>
        <h1 className="text-4xl mb-3" style={{fontFamily:"'Playfair Display',serif"}}>
          📖 Nhật <em>Ký</em>
        </h1>
        <p className="text-gray-500">Những trang nhật ký hằng ngày của Anna — suy nghĩ, cảm xúc và kỷ niệm.</p>
      </div>
      <div className="text-center py-24 text-gray-400">
        <div className="text-6xl mb-4">📖</div>
        <p>Chưa có bài viết nào. Anna ơi, viết bài đầu tiên đi!</p>
        <a href="/admin/bai-viet/moi" className="inline-block mt-4 px-6 py-2.5 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors">
          + Viết bài mới
        </a>
      </div>
    </div>
  )
}