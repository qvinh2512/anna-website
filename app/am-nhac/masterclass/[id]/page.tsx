'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../../../lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'

type Masterclass = {
  id: string
  date: string
  professor: string
  event: string
  piece: string
  color: string
  professor_bio: string
  significance: string
  youtube_url: string
  images: string[]
  created_at: string
}

const colorMap: Record<string, string> = {
  rose:    'from-rose-400 to-rose-600',
  amber:   'from-amber-400 to-amber-600',
  emerald: 'from-emerald-400 to-emerald-600',
  blue:    'from-blue-400 to-blue-600',
  purple:  'from-purple-400 to-purple-600',
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
    supabase
      .from('masterclasses')
      .select('*')
      .eq('id', params.id)
      .single()
      .then(({ data }) => {
        setMc(data)
        setLoading(false)
      })
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400 text-sm">Đang tải...</div>
    </div>
  )

  if (!mc) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-400 text-sm">Không tìm thấy bài viết.</div>
    </div>
  )

  const ytId = getYouTubeId(mc.youtube_url)
  const gradient = colorMap[mc.color] || colorMap.rose

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">

      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-8 transition-colors"
      >
        ← Quay lại
      </button>

      <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-8 text-white mb-8`}>
        <p className="text-white/70 text-xs uppercase tracking-widest mb-3">🎻 Masterclass</p>
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
          {mc.professor}
        </h1>
        <p className="text-white/80 text-sm mb-1">{mc.event}</p>
        <p className="text-white/60 text-xs">{mc.date}</p>
        {mc.piece && (
          <div
