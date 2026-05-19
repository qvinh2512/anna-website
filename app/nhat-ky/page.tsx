import { createClient } from '../lib/supabase/server'

function getYouTubeId(url: string) {
  if (!url) return null
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default async function NhatKyPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('category_id', 1)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-rose-500 text-xs tracking-widest uppercase mb-2">Hằng ngày</p>
        <h1 className="text-4xl mb-3" style={{fontFamily:"'Playfair Display',serif"}}>
          📖 Nhật <em>Ký</em>
        </h1>
        <p className="text-gray-500">Những trang nhật ký hằng ngày của Anna — suy nghĩ, cảm xúc và kỷ niệm.</p>
      </div>

      {user && (
        <div className="mb-8">
          <a href="/admin/bai-viet/moi"
            className="inline-block px-6 py-2.5 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors">
            + Viết bài mới
          </a>
        </div>
      )}

      {!posts || posts.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <div className="text-6xl mb-4">📖</div>
          <p>Chưa có bài viết nào. Anna ơi, viết bài đầu tiên đi!</p>
        </div>
      ) : (
        <div className="space-y-10">
          {posts.map(post => (
            <article key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Hình ảnh */}
              {post.images && post.images.length > 0 && (
                <div className="columns-2 gap-2 p-4">
                  {post.images.map((img: string, i: number) => (
                    <div key={i} className="rounded-xl overflow-hidden mb-2 break-inside-avoid">
                      <img src={img} alt={`Ảnh ${i+1}`} className="w-full h-auto object-contain" />
                    </div>
                  ))}
                </div>
              )}

              <div className="p-6">
                {/* Ngày */}
                <p className="text-xs text-gray-400 mb-2">
                  {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                  }) : ''}
                </p>

                {/* Tiêu đề */}
                <h2 className="text-xl font-semibold text-gray-900 mb-3"
                  style={{fontFamily:"'Playfair Display',serif"}}>
                  {post.title}
                </h2>

                {/* Nội dung */}
                {post.content && (
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap mb-4">
                    {post.content}
                  </p>
                )}

                {/* Video YouTube */}
                {post.youtube_url && getYouTubeId(post.youtube_url) && (
                  <div className="mt-4">
                    <div className="relative w-full rounded-xl overflow-hidden bg-black"
                      style={{paddingTop:'56.25%'}}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${getYouTubeId(post.youtube_url)}?rel=0`}
                        title={post.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag: string, i: number) => (
                      <span key={i} className="text-xs bg-rose-50 text-rose-400 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
