import { createClient } from '../app/lib/supabase/server'
import { notFound } from 'next/navigation'
import LightboxGallery from './LightboxGallery'

function getYouTubeId(url: string) {
  if (!url) return null
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

type Props = { slug: string; backHref: string; backLabel: string }

export default async function PostDetail({ slug, backHref, backLabel }: Props) {
  const supabase = createClient()
  const { data: post } = await supabase.from('posts').select('*').eq('slug', slug).single()
  if (!post) notFound()
  const ytId = post.youtube_url ? getYouTubeId(post.youtube_url) : null

  return (
    <div style={{backgroundColor:'#fffbf5'}} className="min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <a href={backHref} className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-8 transition-colors">← {backLabel}</a>
        <div className="mb-8">
          <p className="text-xs text-gray-400 mb-3">
            {post.published_at ? new Date(post.published_at).toLocaleDateString('vi-VN',{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'}) : ''}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight" style={{fontFamily:"'Playfair Display',serif"}}>{post.title}</h1>
          {post.excerpt && <p className="text-gray-500 text-base italic border-l-4 border-rose-200 pl-4">{post.excerpt}</p>}
        </div>
        {post.content && (
          <div className="prose prose-base max-w-none text-gray-700 leading-relaxed mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />
        )}
        {ytId && (
          <div className="mb-8">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-black" style={{paddingTop:'56.25%'}}>
              <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${ytId}?rel=0`} title={post.title} allowFullScreen />
            </div>
          </div>
        )}
        {post.images && post.images.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📸 Hình ảnh</h2>
            <LightboxGallery images={post.images} />
          </div>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag: string, i: number) => (
              <span key={i} className="text-sm bg-rose-50 text-rose-400 px-3 py-1 rounded-full">#{tag}</span>
            ))}
          </div>
        )}
        <div className="border-t border-gray-100 pt-6">
          <a href={backHref} className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600 text-sm">← Xem tất cả {backLabel}</a>
        </div>
      </div>
    </div>
  )
}