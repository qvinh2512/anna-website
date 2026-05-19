'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../lib/supabase/client'

type Video = {
  id: string
  title: string
  youtube_url: string
  category: string
  year: string
}

type Masterclass = {
  id: string
  date: string
  professor: string
  event: string
  piece: string
  color: string
  event_date: string
}

const colorMap: Record<string, string> = {
  rose:    'border-rose-200 bg-rose-50',
  amber:   'border-amber-200 bg-amber-50',
  emerald: 'border-emerald-200 bg-emerald-50',
  blue:    'border-blue-200 bg-blue-50',
  purple:  'border-purple-200 bg-purple-50',
}

function getYouTubeId(url: string) {
  if (!url) return null
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default function AmNhacPage() {
  const supabase = createClient()
  const [videos, setVideos] = useState<Video[]>([])
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([])
  const [activeCategory, setActiveCategory] = useState('Tất cả')
  const [activeVideo, setActiveVideo] = useState<Video | null>(null)

  useEffect(() => {
    supabase
      .from('videos')
      .select('*')
      .order('year', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setVideos(data)
          setActiveVideo(data[0])
        }
      })

    supabase
      .from('masterclasses')
      .select('id,date,professor,event,piece,color,event_date')
      .order('event_date', { ascending: false })
      .then(({ data }) => { if (data) setMasterclasses(data) })
  }, [])

  const categories = ['Tất cả', ...Array.from(new Set(videos.map(v => v.category)))]
  const filtered = activeCategory === 'Tất cả' ? videos : videos.filter(v => v.category === activeCategory)

  return (
    <div style={{ backgroundColor: '#fffbf5' }} className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* TIÊU ĐỀ */}
        <div className="mb-10">
          <h1 className="text-4xl mb-2" style={{ fontFamily: "'Playfair Display',serif" }}>
            🎻 Âm <em>Nhạc</em>
          </h1>
          <p className="text-gray-500 text-sm">Violin, biểu diễn, masterclass, luyện tập và hành trình tại Nhạc viện.</p>
        </div>

        {/* VIDEO PLAYER + PLAYLIST */}
        <section className="mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Player trái */}
            <div className="lg:col-span-2">
              {activeVideo ? (
                <div>
                  <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-black mb-4"
                    style={{ paddingTop: '56.25%' }}>
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${getYouTubeId(activeVideo.youtube_url)}?rel=0&autoplay=0`}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <span className="text-xs text-rose-500 font-medium bg-rose-50 px-2 py-0.5 rounded-full">
                      {activeVideo.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2 mb-1"
                      style={{ fontFamily: "'Playfair Display',serif" }}>
                      {activeVideo.title}
                    </h3>
                    <p className="text-xs text-gray-400">Anna Duyên An · {activeVideo.year}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Chưa có video</p>
                </div>
              )}
            </div>

            {/* Playlist phải */}
            <div className="lg:col-span-1">
              {/* Bộ lọc */}
              <div className="flex flex-wrap gap-2 mb-3">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      activeCategory === cat
                        ? 'bg-rose-500 text-white border-rose-500'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-rose-300'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Danh sách video */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filtered.map(v => (
                  <button key={v.id} onClick={() => setActiveVideo(v)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      activeVideo?.id === v.id
                        ? 'bg-rose-50 border-rose-200'
                        : 'bg-white border-gray-100 hover:border-rose-200'
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activeVideo?.id === v.id ? 'bg-rose-500' : 'bg-gray-200'
                      }`}>
                        <span className={`text-xs ${activeVideo?.id === v.id ? 'text-white' : 'text-gray-500'}`}>▶</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{v.title}</p>
                        <p className="text-xs text-gray-400">{v.year} · {v.category}</p>
                      </div>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">Chưa có video</p>
                )}
              </div>
            </div>
          </div>

          {/* Nút YouTube */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-sm mb-3">Xem thêm các video của Anna</p>
            <a href="https://www.youtube.com/@AnnaDuyenAn" target="_blank"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm shadow-md">
              ▶ YouTube @AnnaDuyenAn
            </a>
          </div>
        </section>

        {/* MASTERCLASS */}
        <section className="mb-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-2">Học hỏi từ đỉnh cao</p>
              <h2 className="text-2xl" style={{ fontFamily: "'Playfair Display',serif" }}>
                Các lớp <em>Masterclass</em>
              </h2>
            </div>
            <a href="/admin/masterclass"
              className="text-sm px-3 py-1.5 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 transition-colors">
              ✏️ Chỉnh sửa
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {masterclasses.length > 0 ? masterclasses.map(m => (
              <a key={m.id} href={`/am-nhac/masterclass/${m.id}`}
                className={`border-2 ${colorMap[m.color] || colorMap.rose} rounded-2xl p-5 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 block`}>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{m.date}</p>
                <h3 className="font-semibold text-gray-900 mb-1"
                  style={{ fontFamily: "'Playfair Display',serif" }}>
                  {m.professor}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{m.event}</p>
                {m.piece && (
                  <div className="bg-white rounded-lg px-3 py-2 text-xs text-gray-700 italic border border-gray-100 mb-3">
                    🎵 {m.piece}
                  </div>
                )}
                <p className="text-xs text-rose-400">Xem chi tiết →</p>
              </a>
            )) : (
              [1,2,3].map(i => (
                <div key={i} className="border-2 border-gray-100 bg-gray-50 rounded-2xl p-5 animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  )
}
