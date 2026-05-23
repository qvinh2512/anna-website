'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'

type Masterclass = {
  id: string; date: string; professor: string; event: string
  piece: string; color: string; professor_bio: string
  significance: string; youtube_url: string; images: string[]
}

const colorMap: Record<string, string> = {
  rose: 'from-rose-400 to-rose-600', amber: 'from-amber-400 to-amber-600',
  emerald: 'from-emerald-400 to-emerald-600', blue: 'from-blue-400 to-blue-600',
  purple: 'from-purple-400 to-purple-600',
}

function getYouTubeId(url: string) {
  if (!url) return null
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default function MasterclassDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [mc, setMc] = useState<Masterclass | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('masterclasses').select('*').eq('id', params.id).single()
      .then(({ data }) => { setMc(data); setLoading(false) })
  }, [params.id])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400 text-sm">Đang tải...</div></div>
  if (!mc) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400 text-sm">Không tìm thấy.</div></div>

  const ytId = getYouTubeId(mc.youtube_url)
  const gradient = colorMap[mc.color] || colorMap.rose

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-8">← Quay lại</button>
      <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-8 text-white mb-8`}>
        <p className="text-white/70 text-xs uppercase tracking-widest mb-3">🎻 Masterclass</p>
        <h1 className="text-3xl font-bold mb-2">{mc.professor}</h1>
        <p className="text-white/80 text-sm mb-1">{mc.event}</p>
        <p className="text-white/60 text-xs">{mc.date}</p>
        {mc.piece && <div className="mt-4 inline-block bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm">🎵 {mc.piece}</div>}
      </div>
      {ytId && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🎬 Video</h2>
          <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-black" style={{paddingTop:'56.25%'}}>
            <iframe className="absolute inset-0 w-full h-full" src={`https://www.youtube.com/embed/${ytId}?rel=0`} title={mc.professor} allowFullScreen />
          </div>
        </div>
      )}
      {mc.professor_bio && (
        <div className="mb-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">👨‍🏫 Giới thiệu Giáo sư</h2>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{mc.professor_bio}</p>
        </div>
      )}
      {mc.significance && (
        <div className="mb-8 bg-rose-50 rounded-2xl p-6 border border-rose-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">💭 Cảm nhận của Anna</h2>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{mc.significance}</p>
        </div>
      )}
      {mc.images && mc.images.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">📸 Hình ảnh</h2>
          <div className={`${mc.images.length === 1 ? 'flex justify-center' : 'grid grid-cols-2 gap-3'}`}>
            {mc.images.map((img, i) => (
              <div key={i} className="rounded-xl overflow-hidden shadow-md">
                <img src={img} alt={`Ảnh ${i+1}`} className="w-full h-auto object-contain block" />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="border-t border-gray-100 pt-6 text-center">
        <a href="/masterclass" className="text-rose-500 hover:text-rose-600 text-sm">← Xem tất cả Masterclass</a>
      </div>
    </div>
  )
}