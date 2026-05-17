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
              <svg width="220" height="380" viewBox="0 0 220 380" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{filter:'drop-shadow(0 20px 60px rgba(0,0,0,0.8))'}}>
                {/* Scroll / Pegbox */}
                <path d="M108 8 C108 8 115 2 120 6 C125 10 123 18 118 20 C122 22 124 28 120 32 C116 36 110 34 108 30" fill="#8B4513" stroke="#5C2D0A" strokeWidth="1"/>
                <path d="M108 30 L106 50 C106 50 104 52 106 54 L108 56 L112 56 L114 54 C116 52 114 50 114 50 L112 30" fill="#9B5523" stroke="#5C2D0A" strokeWidth="1"/>
                {/* Pegs */}
                <ellipse cx="104" cy="38" rx="4" ry="2" fill="#4A1C00" transform="rotate(-30 104 38)"/>
                <ellipse cx="116" cy="43" rx="4" ry="2" fill="#4A1C00" transform="rotate(-30 116 43)"/>
                <ellipse cx="104" cy="48" rx="4" ry="2" fill="#4A1C00" transform="rotate(-30 104 48)"/>
                <ellipse cx="116" cy="33" rx="4" ry="2" fill="#4A1C00" transform="rotate(-30 116 33)"/>
                {/* Neck */}
                <path d="M104 56 L100 130 L120 130 L116 56 Z" fill="#7A3B10" stroke="#5C2D0A" strokeWidth="1"/>
                {/* Fingerboard */}
                <path d="M106 56 L103 128 L117 128 L114 56 Z" fill="#1a0a00"/>
                {/* Nut */}
                <rect x="104" y="126" width="12" height="4" rx="1" fill="#F5DEB3"/>
                {/* Body top bout */}
                <path d="M110 130 C80 130 58 148 56 168 C54 185 65 198 75 205 C60 212 50 228 50 248 C50 270 70 288 95 295 L95 310 L125 310 L125 295 C150 288 170 270 170 248 C170 228 160 212 145 205 C155 198 166 185 164 168 C162 148 140 130 110 130 Z"
                  fill="url(#woodGrain)" stroke="#5C2D0A" strokeWidth="1.5"/>
                {/* C-bouts waist */}
                <path d="M75 205 C65 208 58 218 58 228 C58 238 65 245 75 248" fill="none" stroke="#5C2D0A" strokeWidth="2"/>
                <path d="M145 205 C155 208 162 218 162 228 C162 238 155 245 145 248" fill="none" stroke="#5C2D0A" strokeWidth="2"/>
                {/* Lower bout */}
                <path d="M95 310 C70 310 48 292 48 268 C48 244 65 228 75 248 C85 268 95 295 110 295 C125 295 135 268 145 248 C155 228 172 244 172 268 C172 292 150 310 125 310 Z"
                  fill="url(#woodGrain2)" stroke="#5C2D0A" strokeWidth="1.5"/>
                {/* Purfling top */}
                <path d="M110 133 C82 133 62 150 60 168 C58 184 68 197 78 204 C63 212 53 227 53 247 C53 268 72 286 97 293"
                  fill="none" stroke="#2C1000" strokeWidth="2" opacity="0.6"/>
                <path d="M110 133 C138 133 158 150 160 168 C162 184 152 197 142 204 C157 212 167 227 167 247 C167 268 148 286 123 293"
                  fill="none" stroke="#2C1000" strokeWidth="2" opacity="0.6"/>
                {/* F-holes */}
                <path d="M88 210 C86 205 85 198 86 192 C87 186 90 183 91 178 M88 210 C90 212 91 214 90 216 C89 218 87 218 86 216 C85 214 86 212 88 210 M91 178 C92 176 94 176 95 178 C96 180 95 182 93 182 C91 182 90 180 91 178 M88 225 C86 230 85 238 86 244 C87 250 90 253 91 258 M88 225 C90 223 91 221 90 219 C89 217 87 217 86 219 C85 221 86 223 88 225"
                  stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <path d="M132 210 C134 205 135 198 134 192 C133 186 130 183 129 178 M132 210 C130 212 129 214 130 216 C131 218 133 218 134 216 C135 214 134 212 132 210 M129 178 C128 176 126 176 125 178 C124 180 125 182 127 182 C129 182 130 180 129 178 M132 225 C134 230 135 238 134 244 C133 250 130 253 129 258 M132 225 C130 223 129 221 130 219 C131 217 133 217 134 219 C135 221 134 223 132 225"
                  stroke="#1a0a00" strokeWidth="2" fill="none" strokeLinecap="round"/>
                {/* Bridge */}
                <path d="M97 265 L98 258 L100 256 L110 256 L120 256 L122 258 L123 265 Z" fill="#D4A96A" stroke="#8B6914" strokeWidth="0.5"/>
                <path d="M99 265 L100 260 M110 265 L110 258 M121 265 L120 260" stroke="#8B6914" strokeWidth="0.5"/>
                {/* Tailpiece */}
                <path d="M100 310 L105 295 L115 295 L120 310 L118 315 L102 315 Z" fill="#2C1000" stroke="#1a0a00" strokeWidth="1"/>
                {/* Strings */}
                {[105, 108, 112, 115].map((x, i) => (
                  <line key={i} x1={x} y1="56" x2={x + (i-1.5)*0.5} y2="312" stroke="#C0C0C0" strokeWidth="0.6" opacity="0.8"/>
                ))}
                {/* Shine/varnish highlight */}
                <path d="M85 148 C80 155 78 165 80 175 C82 180 86 183 88 180" fill="none" stroke="white" strokeWidth="2" opacity="0.15" strokeLinecap="round"/>
                <path d="M90 270 C86 278 85 288 87 296" fill="none" stroke="white" strokeWidth="1.5" opacity="0.12" strokeLinecap="round"/>
                {/* Chin rest */}
                <path d="M100 315 C95 318 92 325 95 330 C98 335 115 336 125 333 C130 331 130 325 127 320 L120 315 Z" fill="#1a0a00" stroke="#0a0500" strokeWidth="1"/>
                {/* Gradients */}
                <defs>
                  <linearGradient id="woodGrain" x1="56" y1="130" x2="170" y2="310" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#C17F3C"/>
                    <stop offset="30%" stopColor="#A0612A"/>
                    <stop offset="60%" stopColor="#8B4513"/>
                    <stop offset="80%" stopColor="#C17F3C"/>
                    <stop offset="100%" stopColor="#8B4513"/>
                  </linearGradient>
                  <linearGradient id="woodGrain2" x1="48" y1="248" x2="172" y2="320" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#8B4513"/>
                    <stop offset="40%" stopColor="#C17F3C"/>
                    <stop offset="70%" stopColor="#A0612A"/>
                    <stop offset="100%" stopColor="#8B4513"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className="text-white/30 text-xs italic mb-4">Stradivarius · 1715</p>
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
