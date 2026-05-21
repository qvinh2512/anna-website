'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../../lib/supabase/client'

type Post = {
  id: string
  title: string
  status: string
  category_id: number
  published_at: string | null
  created_at: string
  views: number | null
  tags: string[] | null
}

const CATEGORIES: Record<number, string> = {
  1: '📖 Nhật Ký',
  2: '🎻 Âm Nhạc',
  3: '🎨 Nghệ Thuật',
  4: '📚 Học Thuật',
  5: '👫 Bạn Bè',
  6: '🌏 Xã Hội',
}

export default function AdminBaiVietPage() {
  const supabase = createClient()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all'|'published'|'draft'>('all')

  const load = async () => {
    setLoading(true)
    let query = supabase
      .from('posts')
      .select('id,title,status,category_id,published_at,created_at,views,tags')
      .order('created_at', { ascending: false })
    if (filter !== 'all') query = query.eq('status', filter)
    const { data } = await query
    if (data) setPosts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [filter])

  const deletePost = async (id: string) => {
    if (!confirm('Xóa bài viết này?')) return
    await supabase.from('posts').delete().eq('id', id)
    load()
  }

  const filtered = posts.filter(p => filter === 'all' || p.status === filter)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>
          Bài viết
          <span className="ml-2 text-sm text-gray-400 font-normal">({posts.length} bài)</span>
        </h1>
        <a href="/admin/bai-viet/moi"
          className="px-5 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors">
          + Viết bài mới
        </a>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {([['all','Tất cả'],['published','Đã đăng'],['draft','Nháp']] as const).map(([key,label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${filter === key ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-gray-500 border-gray-200 hover:border-rose-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Đang tải...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <div className="text-4xl mb-3">📝</div>
            <p>Chưa có bài viết nào.</p>
            <a href="/admin/bai-viet/moi"
              className="inline-block mt-4 px-5 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600">
              Viết bài đầu tiên
            </a>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                <th className="text-left px-4 py-3">Tiêu đề</th>
                <th className="text-left px-4 py-3">Danh mục</th>
                <th className="text-left px-4 py-3">Trạng thái</th>
                <th className="text-left px-4 py-3">Ngày đăng</th>
                <th className="text-left px-4 py-3">Lượt xem</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post, i) => (
                <tr key={post.id} className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800 text-sm line-clamp-1">{post.title}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {post.tags.slice(0,3).map((tag,i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {CATEGORIES[post.category_id] || 'Khác'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${post.status === 'published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {post.status === 'published' ? '✅ Đã đăng' : '📝 Nháp'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString('vi-VN')
                      : new Date(post.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">
                    {post.views ?? 0} 👁
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-end">
                      <a href={`/admin/bai-viet/${post.id}`}
                        className="text-xs px-3 py-1 border rounded-full text-gray-500 hover:bg-gray-50 transition-colors">
                        Sửa
                      </a>
                      <button onClick={() => deletePost(post.id)}
                        className="text-xs px-3 py-1 border border-red-200 rounded-full text-red-400 hover:bg-red-50 transition-colors">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
