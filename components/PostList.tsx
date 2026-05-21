import { createClient } from '../app/lib/supabase/server'
import Link from 'next/link'

function getYouTubeId(url: string) {
  if (!url) return null
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

type Props = {
  categoryId: number
  basePath: string
  title: string
  emoji: string
  subtitle: string
  color: string
  settingKey?: string
}

export default async function PostList({ categoryId, basePath, title, emoji, subtitle, color, settingKey }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: settingsData } = await supabase.from('site_settings').select('key,value')
  const s: Record<string, string> = {}
  if (settingsData) settingsData.forEach(d => { s[d.key] = d.value || '' })
  const displayTitle = settingKey ? (s[settingKey] || title) : title

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('category_id', categoryId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  return (
    <div style={{backgroundColor:'#fffbf5'}} className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className={`text-${color}-500 text-xs tracking-widest uppercase mb-2`}>Bài viết</p>
    <h1 className="text-4xl mb-3" style={{fontFamily:"'Playfair Display',serif"}}>
  {emoji} <em>{displayTitle}</em>
</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>

        {user && (
          <div className="mb-8">
            <a href="/admin/bai-viet/moi"
              className={`inline-block px-6 py-2.5 bg-${color}-500 text-white rounded-full text-sm hover:bg-${color}-600 transition-colors`}>
              + Viết bài mới
            </a>
          </div>
        )}

        {!posts || posts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <div className="text-6xl mb-4">{emoji}</div>
            <p>Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => {
              const firstImage = post.images?.[0]
              const ytId = post.youtube_url ? getYouTubeId(post.youtube_url) : null
              const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null
              const coverImage = firstImage || thumb

              return (
                <article key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="flex">
                    {coverImage && (
                      <div className="flex-shrink-0 w-36 sm:w-48">
                        <img src={coverImage} alt={post.title}
                          className="w-full h-full object-cover" style={{minHeight:'120px',maxHeight:'160px'}} />
                      </div>
                    )}
                    <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-400">
                            {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN', {
                              day:'2-digit', month:'2-digit', year:'numeric'
                            }) : ''}
                          </span>
                          {ytId && <span className="text-xs bg-red-50 text-red-400 px-2 py-0.5 rounded-full">▶ Video</span>}
                        </div>
                        <h2 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug"
                          style={{fontFamily:"'Playfair Display',serif"}}>
                          {post.title}
                        </h2>
                        {post.excerpt ? (
                          <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
                        ) : post.content ? (
                          <p className="text-gray-500 text-sm line-clamp-2">
                            {post.content.replace(/<[^>]+>/g, ' ').slice(0, 120)}...
                          </p>
                        ) : null}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex flex-wrap gap-1">
                          {(post.tags || []).slice(0,3).map((tag: string, i: number) => (
                            <span key={i} className="text-xs bg-gray-50 text-gray-400 px-2 py-0.5 rounded-full">#{tag}</span>
                          ))}
                        </div>
                        <Link href={`/${basePath}/${post.slug}`}
                          className={`text-xs text-${color}-400 hover:text-${color}-600 transition-colors flex-shrink-0 ml-2`}>
                          Đọc tiếp →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
