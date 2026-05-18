'use client'
import { useState, useEffect } from 'react'
import { createClient } from './lib/supabase/client'

type DreamContent = { title: string; body: string }

export default function HomePage() {
  const supabase = createClient()
  const [activeDream, setActiveDream] = useState<string | null>(null)
  const [dreamContent, setDreamContent] = useState<Record<string, DreamContent>>({
    violin:     { title: '🎻 Violin — Đam mê từ tiếng đàn đầu tiên', body: '' },
    'hoi-hoa':  { title: '🎨 Hội họa — Thế giới màu sắc của Anna', body: '' },
    'que-sera': { title: '🦷 Que sera sera — Ước mơ Bác sỹ Nha khoa', body: '' },
  })

  useEffect(() => {
    supabase.from('site_content').select('key,title,body').in('key', ['violin','hoi-hoa','que-sera'])
      .then(({ data }) => {
        if (data) {
          const map: Record<string, DreamContent> = {}
          data.forEach((d: any) => { map[d.key] = { title: d.title, body: d.body } })
          setDreamContent(map)
        }
      })
  }, [])

  const toggleDream = (key: string) => {
    setActiveDream(prev => prev === key ? null : key)
  }

  const dream = activeDream ? dreamContent[activeDream] : null

  return (
    <div>
      {/* HERO */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-gray-900 flex flex-col justify-center px-12 py-24">
          <p className="text-rose-400 text-xs tracking-widest uppercase mb-6">Nhật ký · Âm nhạc · Nghệ thuật</p>

          <h1 className="text-7xl text-white mb-8 leading-none whitespace-nowrap" style={{fontFamily:"'Playfair Display',serif"}}>
            Anna <em className="text-yellow-400">Duyên An</em>
          </h1>

          <div className="text-white/70 text-sm leading-loose mb-8">
            <p>📅 Sinh ngày <strong className="text-white">04.03.2014</strong></p>
            <p>🏫 Học sinh trường <strong className="text-white">Sedbergh Việt Nam</strong></p>
            <p>🎻 Năm nhất Trung cấp Violin 9 năm · <strong className="text-white">Nhạc viện TP. HCM</strong></p>
          </div>

          {/* Tags 3D — nhấp vào xem giới thiệu */}
          <div className="flex flex-wrap gap-3 mb-4">
            {[
              {label:'🎻 Violin',        key:'violin',    color:'from-rose-500 to-rose-700'},
              {label:'🎨 Hội họa',      key:'hoi-hoa',   color:'from-amber-500 to-amber-700'},
              {label:'🦷 Que sera sera', key:'que-sera',  color:'from-purple-500 to-purple-700'},
            ].map(t=>(
              <button
                key={t.key}
                onClick={() => toggleDream(t.key)}
                className={`text-xs px-4 py-2 bg-gradient-to-br ${t.color} text-white rounded-xl font-medium
                  shadow-lg shadow-black/30 border border-white/20
                  transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer
                  ${activeDream === t.key ? 'ring-2 ring-white/60 scale-105' : ''}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Dream detail panel */}
          {dream && (
            <div className="mb-6 bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20 relative">
              <button
                onClick={() => setActiveDream(null)}
                className="absolute top-3 right-3 text-white/50 hover:text-white text-lg leading-none">
                ×
              </button>
              <h3 className="text-white font-semibold mb-2 text-sm" style={{fontFamily:"'Playfair Display',serif"}}>
                {dream.title}
              </h3>
              <p className="text-white/70 text-xs leading-relaxed">{dream.body}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            {[['4+','Năm violin'],['64','Tranh triển lãm'],['6+','Masterclass']].map(([n,l])=>(
              <div key={l}>
                <div className="text-3xl text-yellow-400 mb-1" style={{fontFamily:"'Playfair Display',serif"}}>{n}</div>
                <div className="text-xs text-white/40 uppercase tracking-wide">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 flex items-center justify-center py-16 px-8">
          <div className="text-center">
            {/* Stradivarius Violin SVG */}
<div className="flex justify-center mb-8">
  <img 
    src="/violin.png" 
    alt="Violin" 
    className="w-64 h-auto object-contain drop-shadow-2xl rounded-lg"
    style={{filter:'drop-shadow(0 20px 60px rgba(0,0,0,0.8))'}}
  />
</div>            <p className="text-white/30 text-xs italic mb-4">Stradivarius · 1715</p>
            <a href="https://www.youtube.com/@AnnaDuyenAn" target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-full text-sm
                hover:bg-red-600 transition-colors shadow-lg shadow-red-900/50">
              ▶ YouTube @AnnaDuyenAn
            </a>
          </div>
        </div>
      </section>

      {/* CHUYÊN MỤC 3D */}
      <section className="py-20 bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-rose-500 text-xs tracking-widest uppercase mb-2">Khám phá</p>
          <h2 className="text-3xl mb-10" style={{fontFamily:"'Playfair Display',serif"}}>Các chuyên mục</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              {icon:'📖', label:'Nhật Ký',    href:'/nhat-ky',    desc:'Hằng ngày',           from:'from-rose-400',   to:'to-rose-600'},
              {icon:'🎻', label:'Âm Nhạc',   href:'/am-nhac',    desc:'Violin · Biểu diễn',  from:'from-amber-400',  to:'to-amber-600'},
              {icon:'🎨', label:'Nghệ Thuật', href:'/nghe-thuat', desc:'Hội họa · Triển lãm', from:'from-emerald-400',to:'to-emerald-600'},
              {icon:'📚', label:'Học Thuật',  href:'/hoc-thuat',  desc:'Sedbergh · Kiến thức',from:'from-blue-400',   to:'to-blue-600'},
              {icon:'👫', label:'Bạn Bè',    href:'/ban-be',     desc:'Diễn đàn · Giao lưu', from:'from-pink-400',   to:'to-pink-600'},
              {icon:'🌏', label:'Xã Hội',    href:'/xa-hoi',     desc:'Cộng đồng · Từ thiện',from:'from-violet-400', to:'to-violet-600'},
            ].map(cat=>(
              <a key={cat.href} href={cat.href}
                className={`group relative bg-gradient-to-br ${cat.from} ${cat.to}
                  rounded-2xl p-5 text-center text-white
                  shadow-lg hover:shadow-2xl
                  transform hover:-translate-y-2 hover:scale-105
                  transition-all duration-300 cursor-pointer
                  border border-white/20`}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                <span className="text-4xl block mb-3 drop-shadow-md">{cat.icon}</span>
                <span className="font-semibold text-sm block mb-1 drop-shadow">{cat.label}</span>
                <span className="text-xs text-white/80">{cat.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MASTERCLASS PREVIEW */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-2">Học hỏi từ đỉnh cao</p>
              <h2 className="text-3xl" style={{fontFamily:"'Playfair Display',serif"}}>Các lớp <em>Masterclass</em></h2>
            </div>
            <div className="flex items-center gap-4">
              <a href="/am-nhac" className="text-sm text-rose-500 hover:underline">Xem tất cả →</a>
              <a href="/admin/masterclass" className="text-sm px-3 py-1.5 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 transition-colors">
                ✏️ Chỉnh sửa
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {date:'18.03.2025', prof:'Prof. Felix Schwartz',       event:'Masterclass violin quốc tế',   piece:'Küchler Concertino',          color:'border-rose-200 bg-rose-50'},
              {date:'26.03.2025', prof:'Prof. Addison',              event:'Masterclass tại TP.HCM',       piece:'Kỹ thuật ngón tay & âm sắc',  color:'border-amber-200 bg-amber-50'},
              {date:'2024',       prof:'Giáo sư thỉnh giảng (Pháp)', event:'Masterclass nghệ thuật',       piece:'Certificate of Participation', color:'border-emerald-200 bg-emerald-50'},
            ].map(m=>(
              <div key={m.prof}
                className={`border-2 ${m.color} rounded-2xl p-5 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{m.date}</p>
                <h3 className="font-semibold text-gray-900 mb-1" style={{fontFamily:"'Playfair Display',serif"}}>{m.prof}</h3>
                <p className="text-xs text-gray-500 mb-3">{m.event}</p>
                <div className="bg-white rounded-lg px-3 py-2 text-xs text-gray-700 italic border border-gray-100">
                  🎵 {m.piece}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YOUTUBE */}
      <section className="py-16 bg-gray-900 text-center">
        <div className="text-4xl mb-4">▶️</div>
        <h2 className="text-3xl text-white italic mb-3" style={{fontFamily:"'Playfair Display',serif"}}>Xem Anna biểu diễn</h2>
        <p className="text-white/50 mb-6 text-sm">Theo dõi kênh YouTube để xem các video violin và masterclass</p>
        <a href="https://www.youtube.com/@AnnaDuyenAn" target="_blank"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full
            hover:bg-red-600 transition-colors shadow-lg shadow-red-900/50">
          ▶ Subscribe · @AnnaDuyenAn
        </a>
      </section>
    </div>
  )
}
