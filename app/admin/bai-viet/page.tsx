export default function AdminBaiVietPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>Bài viết</h1>
        <a href="/admin/bai-viet/moi"
          className="px-5 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors">
          + Viết bài mới
        </a>
      </div>
      <div className="bg-white rounded-2xl border p-8 text-center text-gray-400">
        <div className="text-5xl mb-3">📝</div>
        <p>Chưa có bài viết nào.</p>
        <a href="/admin/bai-viet/moi"
          className="inline-block mt-4 px-5 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600">
          Viết bài đầu tiên
        </a>
      </div>
    </div>
  )
}