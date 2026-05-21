'use client'
import { useState } from 'react'

type Settings = Record<string, string>
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

type Props = {
  settings: Settings
  masterclasses: Masterclass[]
}

export default function HomeClient({ settings, masterclasses }: Props) {
  const [activeDream, setActiveDream] = useState<string | null>(null)

  const s = (key: string, fallback: string) => settings[key] || fallback

  const dreams = [
  { key: 'violin',   label: '🎻 Violin',        color: 'from-rose-500 to-rose-700',   title: s('dream_violin_title', '🎻 Violin'), body: s('dream_violin_body', '') },
  { key: 'hoi-hoa',  label: '🎨 Hội họa',       color: 'from-amber-500 to-amber-700', title: s('dream_hoihoa_title', '🎨 Hội họa'), body: s('dream_hoihoa_body', '') },
  { key: 'que-sera', label: '🦷 Que sera sera', color: 'from-purple-500 to-purple-700', title: s('dream_quesera_title', '🦷 Que sera sera'), body: s('dream_quesera_body', '') },
]

  const dream = activeDream ? dreams.find(d => d.key === activeDream) : null

  const categories = [
  { icon: '📖', label: s('menu_nhatky', 'Nhật Ký'),      href: '/nhat-ky',    desc: 'Hằng ngày',            from: 'from-rose-400',    to: 'to-rose-600' },
  { icon: '🎻', label: s('menu_amnhac', 'Âm Nhạc'),      href: '/am-nhac',    desc: 'Violin · Biểu diễn',   from: 'from-amber-400',   to: 'to-amber-600' },
  { icon: '🎨', label: s('menu_nghethuat', 'Nghệ Thuật'), href: '/nghe-thuat', desc: 'Hội họa · Triển lãm',  from: 'from-emerald-400', to: 'to-emerald-600' },
  { icon: '📚', label: s('menu_hocthuat', 'Học Thuật'),   href: '/hoc-thuat',  desc: 'Sedbergh · Kiến thức', from: 'from-blue-400',    to: 'to-blue-600' },
  { icon: '👫', label: s('menu_banbe', 'Bạn Bè'),         href: '/ban-be',     desc: 'Diễn đàn · Giao lưu',  from: 'from-pink-400',    to: 'to-pink-600' },
  { icon: '🌐', label: s('menu_xahoi', 'Xã Hội'),         href: '/xa-hoi',     desc: 'Cộng đồng · Từ thiện', from: 'from-violet-400',  to: 'to-violet-600' },
]

  return (
    <div>
      {/* HERO */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-gray-900 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-16 lg:py-24">
          <p className="text-rose-400 text-xs tracking-widest uppercase mb-4 lg:mb-6">
            {s('hero_subtitle', 'Nhật ký · Âm nhạc · Nghệ thuật')}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white mb-6 lg:mb-8 leading-tight"
            style={{fontFamily:"'Playfair Display',serif"}}>
            Anna <em className="text-yellow-400">Duyên An</em>
          </h1>
          <div className="text-white/70 text-sm leading-loose mb-6 lg:mb-8">
            <p>📅 Sinh ngày <strong className="text-white">04.03.2014</strong></p>
            <p>🏫 Học sinh trường <strong className="text-white">Sedbergh Việt Nam</strong></p>
            <p>🎻 Năm nhất Trung cấp Violin 9 năm · <strong className="text-white">Nhạc viện TP. HCM</strong></p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4 lg:mb-6">
            {dreams.map(t => (
              <button key={t.key} onClick={() => setActiveDream(prev => prev === t.key ? null : t.key)}
                className={`text-xs px-4 py-2 bg-gradient-to-br ${t.color} text-white rounded-xl font-medium
                  shadow-lg shadow-black/30 border border-white/20
                  transform hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer
                  ${activeDream === t.key ? 'ring-2 ring-white/60 scale-105' : ''}`}>
                {t.label}
              </button>
            ))}
          </div>

          {dream && (
            <div className="mb-6 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 relative">
              <button onClick={() => setActiveDream(null)}
                className="absolute top-3 right-3 text-white/50 hover:text-white text-lg leading-none">×</button>
              <h3 className="text-white font-semibold mb-2 text-sm" style={{fontFamily:"'Playfair Display',serif"}}>
                {dream.title}
              </h3>
              <p className="text-white/70 text-xs leading-relaxed">{dream.body}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 lg:pt-8">
            {[
              [s('stat_violin', '4+'), 'Năm violin'],
              [s('stat_tranh', '64'), 'Tranh triển lãm'],
              [s('stat_masterclass', '6+'), 'Masterclass'],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl lg:text-3xl text-yellow-400 mb-1" style={{fontFamily:"'Playfair Display',serif"}}>{n}</div>
                <div className="text-xs text-white/40 uppercase tracking-wide">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 flex items-center justify-center py-10 lg:py-16 px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6 lg:mb-8">
              <img src="/violin.png" alt="Violin"
                className="w-48 sm:w-56 lg:w-64 h-auto object-contain drop-shadow-2xl rounded-lg"
                style={{filter:'drop-shadow(0 20px 60px rgba(0,0,0,0.8))'}} />
            </div>
            <p className="text-white/30 text-xs italic mb-4">Stradivarius · 1715</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href={s('social_youtube', 'https://www.youtube.com/@AnnaDuyenAn')} target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-xs">
                ▶ YouTube @AnnaDuyenAn
              </a>
              <a href={s('social_facebook', 'https://www.facebook.com/anna.duyen.an')} target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-xs">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook Anna Duyên An
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CHUYÊN MỤC */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-rose-500 text-xs tracking-widest uppercase mb-2">Khám phá</p>
          <h2 className="text-3xl mb-8 lg:mb-10" style={{fontFamily:"'Playfair Display',serif"}}>Các chuyên mục</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {categories.map(cat => (
              <a key={cat.href} href={cat.href}
                className={`group relative bg-gradient-to-br ${cat.from} ${cat.to}
                  rounded-2xl p-4 lg:p-5 text-center text-white shadow-lg hover:shadow-2xl
                  transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer border border-white/20`}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                <span className="text-3xl lg:text-4xl block mb-2 lg:mb-3 drop-shadow-md">{cat.icon}</span>
                <span className="font-semibold text-xs lg:text-sm block mb-1 drop-shadow">{cat.label}</span>
                <span className="text-xs text-white/80 hidden sm:block">{cat.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* MASTERCLASS */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-6 lg:mb-8">
            <div>
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-2">Học hỏi từ đỉnh cao</p>
              <h2 className="text-2xl lg:text-3xl" style={{fontFamily:"'Playfair Display',serif"}}>Các lớp <em>Masterclass</em></h2>
            </div>
            <div className="flex items-center gap-3">
              <a href="/am-nhac" className="text-sm text-rose-500 hover:underline">Xem tất cả →</a>
              <a href="/admin/masterclass" className="hidden sm:block text-sm px-3 py-1.5 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50 transition-colors">
                ✏️ Chỉnh sửa
              </a>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {masterclasses.length > 0 ? masterclasses.map(m => (
              <a key={m.id} href={`/am-nhac/masterclass/${m.id}`}
                className={`border-2 ${colorMap[m.color] || colorMap.rose} rounded-2xl p-5 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 block`}>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{m.date}</p>
                <h3 className="font-semibold text-gray-900 mb-1" style={{fontFamily:"'Playfair Display',serif"}}>{m.professor}</h3>
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
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* YOUTUBE */}
      <section className="py-12 lg:py-16 bg-gray-900 text-center">
        <div className="text-4xl mb-4">▶️</div>
        <h2 className="text-2xl lg:text-3xl text-white italic mb-3" style={{fontFamily:"'Playfair Display',serif"}}>
          Xem Anna biểu diễn
        </h2>
        <p className="text-white/50 mb-6 text-sm px-6">
          Theo dõi kênh YouTube để xem các video violin và masterclass
        </p>
        <a href={s('social_youtube', 'https://www.youtube.com/@AnnaDuyenAn')} target="_blank"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-red-900/50 text-sm">
          ▶ Subscribe · @AnnaDuyenAn
        </a>
      </section>
    </div>
  )
}
