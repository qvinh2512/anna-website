import { createClient } from '../lib/supabase/server'

export default async function XaHoiPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-green-600 text-xs tracking-widest uppercase mb-2">Cộng đồng · Từ thiện · Hoạt động</p>
        <h1 className="text-4xl mb-3" style={{fontFamily:"'Playfair Display',serif"}}>
          🌏 Xã <em>Hội</em>
        </h1>
        <p className="text-gray-500">Hoạt động cộng đồng, từ thiện và những đóng góp cho xã hội.</p>
      </div>
      <div className="text-center py-24 text-gray-400">
        <div className="text-6xl mb-4">🌏</div>
        {user ? (
          <>
            <p>Chưa có bài viết nào. Anna ơi, viết bài đầu tiên đi!</p>
            <a href="/admin/bai-viet/moi" className="inline-block mt-4 px-6 py-2.5 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors">
              + Viết bài mới
            </a>
          </>
        ) : (
          <p className="text-gray-400">Xin lỗi nha, chưa có bài viết :)</p>
        )}
      </div>
    </div>
  )
}
