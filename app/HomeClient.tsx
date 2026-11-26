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

type Auto = {
  age: string
  lop: string
  namHoc: string
  nhacVienText: string
  violinYears: string
  masterclassCount: string
  nhacVienTextEn?: string
}

type Post = {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  images?: string[]
  youtube_url?: string
  published_at?: string
  created_at?: string
  category_id: number
}

type Video = { title: string; youtube_url: string } | null

const CAT: Record<number, { path: string; label: string; labelEn: string; color: string }> = {
  1: { path: 'nhat-ky',    label: 'Nhật ký',    labelEn: 'Diary',     color: 'text-rose-500 bg-rose-50' },
  3: { path: 'nghe-thuat', label: 'Nghệ thuật', labelEn: 'Art',       color: 'text-emerald-600 bg-emerald-50' },
  4: { path: 'hoc-thuat',  label: 'Học thuật',  labelEn: 'Studies',   color: 'text-blue-600 bg-blue-50' },
  6: { path: 'xa-hoi',     label: 'Xã hội',     labelEn: 'Community', color: 'text-violet-600 bg-violet-50' },
}

// Chữ hiển thị cho 2 ngôn ngữ — bố cục dùng chung
const TEXT = {
  vi: {
    born: 'Sinh ngày', ageUnit: 'tuổi', grade: 'Học sinh lớp', school: 'Sedbergh Việt Nam', conservatory: 'Nhạc viện TP. HCM',
    schoolYear: 'Năm học', stats: ['Năm violin', 'Tranh triển lãm', 'Masterclass'],
    journey: '🌱 Những chặng đường đã qua →', journeyHref: '/thanh-tich',
    exploreKicker: 'Khám phá', exploreTitle: 'Các chuyên mục',
    latestKicker: 'Nhật ký hành trình', latestTitle: ['Mới', 'cập nhật'], newBadge: 'Mới', readMore: 'Đọc tiếp →',
    mcKicker: 'Học hỏi từ đỉnh cao', mcTitle: ['Các lớp', 'Masterclass'], viewAll: 'Xem tất cả →', viewDetail: 'Xem chi tiết →',
    watch: 'Xem Anna biểu diễn', watchSub: 'Theo dõi kênh YouTube để xem các video violin và masterclass',
    heroAlt: 'Anna Duyên An biểu diễn violin', locale: 'vi-VN',
  },
  en: {
    born: 'Born', ageUnit: 'years old', grade: 'Grade', school: 'Sedbergh Vietnam', conservatory: 'HCMC Conservatory of Music',
    schoolYear: 'School year', stats: ['Years of violin', 'Paintings exhibited', 'Masterclasses'],
    journey: '🌱 Along the way →', journeyHref: '/en/milestones',
    exploreKicker: 'Explore', exploreTitle: 'Sections',
    latestKicker: 'Journey diary', latestTitle: ['Latest', 'updates'], newBadge: 'New', readMore: 'Read more →',
    mcKicker: 'Learning from the masters', mcTitle: ['', 'Masterclasses'], viewAll: 'View all →', viewDetail: 'View details →',
    watch: 'Watch Anna perform', watchSub: 'Follow the YouTube channel for violin performances and masterclasses',
    heroAlt: 'Anna Duyen An performing violin', locale: 'en-GB',
  },
}

function ytId(url?: string) {
  if (!url) return null
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([^&\n?#]+)/)
  return m ? m[1] : null
}

type Props = {
  settings: Settings
  masterclasses: Masterclass[]
  auto: Auto
  latestPosts: Post[]
  video: Video
  lang?: 'vi' | 'en'
}

export default function HomeClient({ settings, masterclasses, auto, latestPosts, video, lang = 'vi' }: Props) {
  const en = lang === 'en'
  const T = TEXT[lang]
  const videoId = ytId(video?.youtube_url)
  const [activeDream, setActiveDream] = useState<string | null>(null)

  const s = (key: string, fallback: string) => settings[key] || fallback

  // Dòng giới thiệu đầu trang: chỉ dùng giá trị trong Cài đặt nếu có dấu tiếng Việt
  const rawSubtitle = settings['hero_subtitle'] || ''
  const heroSubtitle = en
    ? (settings['hero_subtitle_en'] || 'Diary · Music · Art')
    : (/[\u00C0-\u1EF9]/.test(rawSubtitle) ? rawSubtitle : 'Nhật ký · Âm nhạc · Nghệ thuật')

  const dreams = en ? [
  { key: 'violin',   label: '🎻 Violin',        color: 'from-rose-500 to-rose-700',
    title: s('dream_violin_title_en', '🎻 Violin — A love since the first note'),
    body: s('dream_violin_body_en', 'Anna studies the violin in the 9-year program at the Ho Chi Minh City Conservatory of Music. Her dream is to become a concert violinist.') },
  { key: 'hoi-hoa',  label: '🎨 Painting',      color: 'from-amber-500 to-amber-700',
    title: s('dream_hoihoa_title_en', "🎨 Painting — Anna's world of colour"),
    body: s('dream_hoihoa_body_en', 'Oil painting is Anna’s second passion. In 2024 she held a charity exhibition of her paintings to support Agent Orange victims.') },
  { key: 'que-sera', label: '🦷 Que sera sera', color: 'from-purple-500 to-purple-700',
    title: s('dream_quesera_title_en', '🦷 Que sera sera — A dream of dentistry'),
    body: s('dream_quesera_body_en', 'Whatever will be, will be. Alongside music, Anna also dreams of one day becoming a dentist.') },
] : [
  { key: 'violin',   label: '🎻 Violin',        color: 'from-rose-500 to-rose-700',   title: s('dream_violin_title', '🎻 Violin'), body: s('dream_violin_body', '') },
  { key: 'hoi-hoa',  label: '🎨 Hội họa',       color: 'from-amber-500 to-amber-700', title: s('dream_hoihoa_title', '🎨 Hội họa'), body: s('dream_hoihoa_body', '') },
  { key: 'que-sera', label: '🦷 Que sera sera', color: 'from-purple-500 to-purple-700', title: s('dream_quesera_title', '🦷 Que sera sera'), body: s('dream_quesera_body', '') },
]

  const dream = activeDream ? dreams.find(d => d.key === activeDream) : null

  const categories = en ? [
  { icon: '📖', label: 'Diary',     href: '/nhat-ky',    desc: 'Everyday moments',        from: 'from-rose-400',    to: 'to-rose-600' },
  { icon: '🎻', label: 'Music',     href: '/am-nhac',    desc: 'Violin · Performances',   from: 'from-amber-400',   to: 'to-amber-600' },
  { icon: '🎨', label: 'Art',       href: '/nghe-thuat', desc: 'Painting · Exhibitions',  from: 'from-emerald-400', to: 'to-emerald-600' },
  { icon: '📚', label: 'Studies',   href: '/hoc-thuat',  desc: 'Sedbergh · Learning',     from: 'from-blue-400',    to: 'to-blue-600' },
  { icon: '👫', label: 'Friends',   href: '/ban-be',     desc: 'Forum · Community',       from: 'from-pink-400',    to: 'to-pink-600' },
  { icon: '🌐', label: 'Community', href: '/xa-hoi',     desc: 'Outreach · Charity',      from: 'from-violet-400',  to: 'to-violet-600' },
] : [
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
      <section className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[calc(100vh-4rem)]">
        {/* Ảnh Anna — trên điện thoại hiện trước */}
        <div className="relative order-first lg:order-last h-[62vh] sm:h-[70vh] lg:h-auto overflow-hidden bg-gray-900">
          <img src="/anna-hero.jpg" alt={T.heroAlt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '40% 22%' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/85 via-gray-900/10 to-transparent lg:bg-gradient-to-r lg:from-gray-900/70 lg:via-transparent lg:to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 lg:left-auto lg:right-6 lg:bottom-6 flex gap-2 flex-wrap lg:justify-end">
            <a href={s('social_youtube', 'https://www.youtube.com/@AnnaDuyenAn')} target="_blank" rel="noopener"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/15 hover:bg-red-600 backdrop-blur-md border border-white/25 text-white rounded-full transition-colors text-xs font-medium">
              ▶ YouTube
            </a>
            <a href={s('social_facebook', 'https://www.facebook.com/anna.duyen.an')} target="_blank" rel="noopener"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/15 hover:bg-blue-600 backdrop-blur-md border border-white/25 text-white rounded-full transition-colors text-xs font-medium">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
          </div>
        </div>

        <div className="bg-gray-900 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-12 lg:py-20">
          <p className="text-rose-400 text-xs tracking-[0.25em] uppercase mb-4 lg:mb-6">
            {heroSubtitle}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white mb-6 lg:mb-8 leading-tight"
            style={{fontFamily:"'Playfair Display',serif"}}>
            Anna <em className="text-yellow-400 whitespace-nowrap">{en ? 'Duyen An' : 'Duyên An'}</em>
          </h1>
          <div className="text-white/70 text-sm leading-loose mb-6 lg:mb-8">
            <p>📅 {T.born} <strong className="text-white">{en ? '4 March 2014' : '04.03.2014'}</strong> · {auto.age} {T.ageUnit}</p>
            <p>🏫 {T.grade} {auto.lop} · <strong className="text-white">{T.school}</strong></p>
            <p>🎻 {en ? auto.nhacVienTextEn : auto.nhacVienText} · <strong className="text-white">{T.conservatory}</strong></p>
            <p className="text-white/40 text-xs mt-1">{T.schoolYear} {auto.namHoc}</p>
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
              [auto.violinYears, T.stats[0], '/am-nhac'],
              [s('stat_tranh', '64'), T.stats[1], '/nghe-thuat'],
              [auto.masterclassCount, T.stats[2], '/masterclass'],
            ].map(([n, l, href]) => (
              <a key={l} href={href} className="group">
                <div className="text-2xl lg:text-3xl text-yellow-400 mb-1 group-hover:text-yellow-300 transition-colors" style={{fontFamily:"'Playfair Display',serif"}}>{n}</div>
                <div className="text-[11px] text-white/40 uppercase tracking-wide leading-snug">{l}</div>
              </a>
            ))}
          </div>

          <a href={T.journeyHref} className="mt-8 inline-flex items-center gap-2 text-sm text-yellow-400/90 hover:text-yellow-300 transition-colors w-fit">
            {T.journey}
          </a>
        </div>
      </section>

      {/* CHUYÊN MỤC */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-rose-500 text-xs tracking-widest uppercase mb-2">{T.exploreKicker}</p>
          <h2 className="text-3xl mb-8 lg:mb-10" style={{fontFamily:"'Playfair Display',serif"}}>{T.exploreTitle}</h2>
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

      {/* MỚI CẬP NHẬT */}
      {latestPosts.length > 0 && (
        <section className="py-12 lg:py-16 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-rose-500 text-xs tracking-widest uppercase mb-2">{T.latestKicker}</p>
            <h2 className="text-2xl lg:text-3xl mb-6 lg:mb-8" style={{fontFamily:"'Playfair Display',serif"}}>
              {T.latestTitle[0]} <em>{T.latestTitle[1]}</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {latestPosts.map(p => {
                const cat = CAT[p.category_id] || CAT[1]
                const id = ytId(p.youtube_url)
                const cover = p.images?.[0] || (id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null)
                const text = p.excerpt || (p.content ? p.content.replace(/<[^>]+>/g, ' ').slice(0, 140) + '…' : '')
                return (
                  <a key={p.id} href={`/${cat.path}/${p.slug}`}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
                    <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      {cover
                        ? <img src={cover} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">🎻</div>}
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>{en ? cat.labelEn : cat.label}</span>
                        {p.created_at && Date.now() - new Date(p.created_at).getTime() < 14 * 86400000 && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-white bg-rose-500 px-1.5 py-0.5 rounded">{T.newBadge}</span>
                        )}
                        {p.published_at && (
                          <span className="text-xs text-gray-400">
                            {new Date(p.published_at).toLocaleDateString(T.locale, en ? { day: 'numeric', month: 'short', year: 'numeric' } : { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug" style={{fontFamily:"'Playfair Display',serif"}}>
                        {p.title}
                      </h3>
                      {text && <p className="text-sm text-gray-500 line-clamp-3">{text}</p>}
                      <p className="text-xs text-rose-400 mt-auto pt-3">{T.readMore}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* MASTERCLASS */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-6 lg:mb-8">
            <div>
              <p className="text-amber-600 text-xs tracking-widest uppercase mb-2">{T.mcKicker}</p>
              <h2 className="text-2xl lg:text-3xl" style={{fontFamily:"'Playfair Display',serif"}}>{T.mcTitle[0]} <em>{T.mcTitle[1]}</em></h2>
            </div>
            <a href="/masterclass" className="text-sm text-rose-500 hover:underline">{T.viewAll}</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {masterclasses.length > 0 ? masterclasses.map(m => (
              <a key={m.id} href={`/am-nhac/masterclass/${m.id}`}
                className={`border-2 ${colorMap[m.color] || colorMap.rose} rounded-2xl p-5 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 block`}>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{m.date}</p>
                <h3 className="font-semibold text-gray-900 mb-1" style={{fontFamily:"'Playfair Display',serif"}}>{m.professor}</h3>
                {!en && <p className="text-xs text-gray-500 mb-3">{m.event}</p>}
                {m.piece && (
                  <div className="bg-white rounded-lg px-3 py-2 text-xs text-gray-700 italic border border-gray-100 mb-3">
                    🎵 {m.piece}
                  </div>
                )}
                <p className="text-xs text-rose-400">{T.viewDetail}</p>
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
          {T.watch}
        </h2>
        <p className="text-white/50 mb-6 text-sm px-6">
          {video?.title || T.watchSub}
        </p>
        {videoId && (
          <div className="max-w-3xl mx-auto px-6 mb-8">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                title={video?.title || 'Anna Duyên An'}
                className="w-full h-full"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
            </div>
          </div>
        )}
        <a href={s('social_youtube', 'https://www.youtube.com/@AnnaDuyenAn')} target="_blank"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg shadow-red-900/50 text-sm">
          ▶ Subscribe · @AnnaDuyenAn
        </a>
      </section>
    </div>
  )
}
