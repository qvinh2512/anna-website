'use client'
import { useState } from 'react'

const videos = [
  { id: 'mbAQble4EQc', title: 'Đời có bao nhiêu ngày vui', date: '2025', category: 'Nhạc Việt' },
  { id: 'Nz2CVY65yDA', title: 'Tình ca (st: Phạm Duy)', date: '2025', category: 'Nhạc Việt' },
  { id: '4HPoDsWxNuI', title: 'Mùa Xuân đầu tiên (st: Văn Cao)', date: '2025', category: 'Nhạc Việt' },
  { id: 'QAIPDAqVjkY', title: 'Concerto in A minor Mov.1 - Antonio Vivaldi', date: '2024', category: 'Cổ điển' },
  { id: 'GpcoSy5lCho', title: 'Mắt lệ cho người (st: Từ Công Phụng)', date: '2024', category: 'Nhạc Việt' },
  { id: 'xROh1y8pW0g', title: 'Diventimento in F (W.A. Mozart) - Vietnam Youth String Ensemble', date: '2025', category: 'Cổ điển' },
  { id: 'RKYfaNd1wm0', title: 'Thuyền viễn xứ (st: Phạm Duy)', date: '2025', category: 'Nhạc Việt' },
  { id: 'zYj1_JjR8d4', title: 'Concerto in B minor (Op.35 Mov.1) - O. Rieding', date: '2025', category: 'Cổ điển' },
  { id: 'nJEu1RskEmA', title: 'Violin Concertino, Op.15 (Ferdinand Küchler) - Slide On Strings', date: '2025', category: 'Cổ điển' },
  { id: '8qmlGXc9148', title: 'Les Sauvages - Slide On Strings', date: '2025', category: 'Cổ điển' },
  { id: 'RdzFGDGe3y0', title: 'Lời thiên thu gọi (st: Trịnh Công Sơn)', date: '2024', category: 'Nhạc Việt' },
]

const categories = ['Tất cả', 'Cổ điển', 'Nhạc Việt', 'Nhạc Thánh']

export default function AmNhacPage() {
  const [activeVideo, setActiveVideo] = useState(videos[0])
  const [activeCategory, setActiveCategory] = useState('Tất cả')

  const filtered = activeCategory === 'Tất cả' ? videos : videos.filter(v => v.category === activeCategory)

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-yellow-600 text-xs tracking-widest uppercase mb-2">Violin · Biểu diễn · Masterclass</p>
        <h1 className="text-4xl mb-3" style={{fontFamily:"'Playfair Display',serif"}}>
          🎻 Âm <em>Nhạc</em>
        </h1>
        <p className="text-gray-500 text-sm">Violin, biểu diễn, masterclass, luyện tập và hành trình tại Nhạc viện.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player - chiếm 2/3 */}
        <div className="lg:col-span-2">
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black mb-4"
            style={{paddingTop:'56.25%'}}>
            <iframe
              key={activeVideo.id}
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${activeVideo.id}?rel=0&autoplay=0`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full mb-2 inline-block">
              {activeVideo.category}
            </span>
            <h2 className="font-semibold text-gray-800 text-lg leading-snug">{activeVideo.title}</h2>
            <p className="text-gray-400 text-sm mt-1">Anna Duyên An · {activeVideo.date}</p>
          </div>
        </div>

        {/* Playlist - chiếm 1/3 */}
        <div className="lg:col-span-1">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3 py-1 rounded-full border transition-all ${
                  activeCategory === cat
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-rose-300'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Video list */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filtered.map((v, i) => (
              <button key={v.id} onClick={() => setActiveVideo(v)}
                className={`w-full text-left flex gap-3 p-3 rounded-xl border-2 transition-all ${
                  activeVideo.id === v.id
                    ? 'border-rose-400 bg-rose-50'
                    : 'border-gray-100 hover:border-rose-200 bg-white'
                }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mt-0.5 ${
                  activeVideo.id === v.id ? 'bg-rose-500' : 'bg-gray-200 text-gray-500'
                }`}>
                  {activeVideo.id === v.id ? '▶' : i + 1}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-xs leading-snug line-clamp-2">{v.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{v.date} · {v.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Link YouTube */}
      <div className="text-center mt-10">
        <p className="text-gray-400 text-sm mb-3">Xem thêm các video của Anna</p>
        <a href="https://www.youtube.com/@AnnaDuyenAn" target="_blank"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg text-sm">
          ▶ YouTube @AnnaDuyenAn
        </a>
      </div>
    </div>
  )
}
