import { createClient } from '../lib/supabase/client'
import { ACHIEVEMENTS, TYPE_LABEL } from '@/lib/achievements'

export const revalidate = 60

export const metadata = {
  title: 'Anna Duyen An · Young Violinist & Artist',
  description: 'Anna Duyen An — young violinist at the Ho Chi Minh City Conservatory of Music, student at Sedbergh Vietnam, and oil painter.',
}

const ORDINAL = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth']

function ytId(url?: string) {
  if (!url) return null
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([^&\n?#]+)/)
  return m ? m[1] : null
}

export default async function EnglishPage() {
  const supabase = createClient()

  const { data: settingsRows } = await supabase.from('site_settings').select('key, value')
  const s: Record<string, string> = {}
  for (const r of settingsRows || []) s[r.key] = r.value

  const { data: masterclasses } = await supabase
    .from('masterclasses')
    .select('id,date,professor,event_date')
    .order('event_date', { ascending: false })

  const { data: videoRows } = await supabase
    .from('videos').select('title,youtube_url')
    .order('sort_order').order('created_at', { ascending: false }).limit(1)
  const videoId = ytId(videoRows?.[0]?.youtube_url)

  // Auto-updating facts (Vietnam time, school year starts in September)
  const now = new Date(Date.now() + 7 * 60 * 60 * 1000)
  const year = now.getUTCFullYear(), month = now.getUTCMonth() + 1, day = now.getUTCDate()
  const schoolYear = month >= 9 ? year : year - 1
  const age = year - 2014 - (month < 3 || (month === 3 && day < 4) ? 1 : 0)
  const nvYear = schoolYear - parseInt(s['nhacvien_start_year'] || '2025', 10) + 1
  const nvText = nvYear >= 1 && nvYear <= 9
    ? `${ORDINAL[nvYear - 1].charAt(0).toUpperCase() + ORDINAL[nvYear - 1].slice(1)}-year student, 9-year Violin Program`
    : 'Violin Program'
  const email = s['email'] || 'contact@annaduyenan.info'

  const groups: { key: 'award' | 'study' | 'community'; title: string }[] = [
    { key: 'award', title: 'Honors & Awards' },
    { key: 'study', title: 'Education' },
    { key: 'community', title: 'Community & Social Activities' },
  ]

  return (
    <div lang="en" style={{ backgroundColor: '#fffbf5' }} className="min-h-screen">
      {/* HERO */}
      <section className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[calc(100vh-4rem)]">
        <div className="relative order-first lg:order-last h-[62vh] sm:h-[70vh] lg:h-auto overflow-hidden bg-gray-900">
          <img src="/anna-hero.jpg" alt="Anna Duyen An performing violin"
            className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '40% 22%' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-gray-900/70 lg:via-transparent" />
        </div>
        <div className="bg-gray-900 flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-12 lg:py-20">
          <p className="text-rose-400 text-xs tracking-[0.25em] uppercase mb-4">Young Violinist · Artist</p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white mb-6 leading-tight" style={{ fontFamily: "'Playfair Display',serif" }}>
            Anna <em className="text-yellow-400 whitespace-nowrap">Duyen An</em>
          </h1>
          <div className="text-white/70 text-sm leading-loose mb-8">
            <p>📅 Born 4 March 2014 · {age} years old</p>
            <p>🏫 Student at <strong className="text-white">Sedbergh Vietnam</strong></p>
            <p>🎻 {nvText} · <strong className="text-white">Ho Chi Minh City Conservatory of Music</strong></p>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-lg mb-8">
            Anna is a young violinist from Ho Chi Minh City who loves performing, oil painting and
            giving back to her community. She balances conservatory training with her academic studies,
            and dreams of becoming both a concert violinist and a dentist.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#achievements" className="px-5 py-2.5 bg-yellow-400 text-gray-900 rounded-full text-sm font-medium hover:bg-yellow-300 transition-colors">
              Along the way
            </a>
            <a href={`mailto:${email}`} className="px-5 py-2.5 border border-white/30 text-white rounded-full text-sm hover:bg-white/10 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section id="achievements" className="max-w-5xl mx-auto px-6 py-16 scroll-mt-20">
        <p className="text-rose-500 text-xs tracking-widest uppercase mb-2">Along the way</p>
        <h2 className="text-3xl mb-10" style={{ fontFamily: "'Playfair Display',serif" }}>Milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groups.map(g => (
            <div key={g.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>{TYPE_LABEL[g.key].icon}</span> {g.title}
              </h3>
              <ul className="space-y-4">
                {ACHIEVEMENTS.filter(a => a.type === g.key).map((a, i) => (
                  <li key={i}>
                    <p className="text-xs text-gray-400 mb-0.5">{a.dateEn}</p>
                    <p className="text-sm font-medium text-gray-900 leading-snug">{a.titleEn}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{a.detailEn}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* MASTERCLASSES */}
      {masterclasses && masterclasses.length > 0 && (
        <section className="bg-white border-y border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-16">
            <p className="text-amber-600 text-xs tracking-widest uppercase mb-2">Learning from the masters</p>
            <h2 className="text-3xl mb-8" style={{ fontFamily: "'Playfair Display',serif" }}>Masterclasses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {masterclasses.map(m => (
                <a key={m.id} href={`/masterclass/${m.id}`}
                  className="border border-amber-100 bg-amber-50/40 rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <p className="text-xs text-gray-400 mb-1">
                    {m.event_date ? new Date(m.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : m.date}
                  </p>
                  <p className="font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display',serif" }}>{m.professor}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* VIDEO */}
      <section className="py-16 bg-gray-900 text-center">
        <h2 className="text-2xl lg:text-3xl text-white italic mb-3" style={{ fontFamily: "'Playfair Display',serif" }}>
          Watch Anna perform
        </h2>
        <p className="text-white/50 mb-8 text-sm">{videoRows?.[0]?.title || 'Violin performances and masterclasses'}</p>
        {videoId && (
          <div className="max-w-3xl mx-auto px-6 mb-8">
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}`} title={videoRows?.[0]?.title || 'Anna Duyen An'}
                className="w-full h-full" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </div>
        )}
        <a href={s['social_youtube'] || 'https://www.youtube.com/@AnnaDuyenAn'} target="_blank" rel="noopener"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm">
          ▶ YouTube · @AnnaDuyenAn
        </a>
      </section>

      {/* CONTACT */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl mb-3" style={{ fontFamily: "'Playfair Display',serif" }}>Get in touch</h2>
        <p className="text-gray-500 text-sm mb-6">For performances, masterclasses or collaborations, please contact Anna&apos;s family.</p>
        <a href={`mailto:${email}`} className="text-rose-600 hover:underline font-medium break-all">{email}</a>
        <p className="mt-8 text-xs text-gray-400">
          <a href="/" className="hover:text-rose-500">Xem bản tiếng Việt →</a>
        </p>
      </section>
    </div>
  )
}
