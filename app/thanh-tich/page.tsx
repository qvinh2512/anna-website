import { createClient } from '../lib/supabase/client'
import { ACHIEVEMENTS, TYPE_LABEL } from '@/lib/achievements'

export const revalidate = 60

export const metadata = {
  title: 'Thành tích · Anna Duyên An',
  description: 'Giải thưởng, học tập, Masterclass và hoạt động cộng đồng của Anna Duyên An',
}

export default async function ThanhTichPage() {
  const supabase = createClient()
  const { data: masterclasses } = await supabase
    .from('masterclasses')
    .select('id,date,professor,event,event_date')
    .order('event_date', { ascending: false })

  const awards = ACHIEVEMENTS.filter(a => a.type === 'award').length
  const years = Array.from(new Set(ACHIEVEMENTS.map(a => a.year))).sort((a, b) => b - a)

  return (
    <div style={{ backgroundColor: '#fffbf5' }} className="min-h-screen">
      {/* Đầu trang */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-14 lg:py-20">
          <p className="text-yellow-400 text-xs tracking-[0.25em] uppercase mb-3">Hành trình & ghi nhận</p>
          <h1 className="text-4xl lg:text-5xl mb-4" style={{ fontFamily: "'Playfair Display',serif" }}>
            Thành <em className="text-yellow-400">tích</em>
          </h1>
          <p className="text-white/60 max-w-2xl leading-relaxed">
            Những dấu mốc trên hành trình âm nhạc, nghệ thuật và cộng đồng của Anna.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mt-10 border-t border-white/10 pt-6">
            {[
              [String(awards), 'Giải quốc tế'],
              [String(masterclasses?.length || 0), 'Masterclass'],
              ['8/10', 'Điểm thi Nhạc viện'],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="text-3xl text-yellow-400" style={{ fontFamily: "'Playfair Display',serif" }}>{n}</div>
                <div className="text-[11px] text-white/40 uppercase tracking-wide mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dòng thời gian */}
      <section className="max-w-5xl mx-auto px-6 py-14">
        {years.map(year => (
          <div key={year} className="mb-12">
            <h2 className="text-3xl text-gray-300 mb-6" style={{ fontFamily: "'Playfair Display',serif" }}>{year}</h2>
            <div className="relative border-l-2 border-rose-100 ml-2 space-y-6">
              {ACHIEVEMENTS.filter(a => a.year === year).map((a, i) => {
                const t = TYPE_LABEL[a.type]
                return (
                  <div key={i} className="relative pl-8">
                    <span className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-white border-4 border-rose-400" />
                    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden sm:flex">
                      {a.image && (
                        <div className="sm:w-56 flex-shrink-0 h-48 sm:h-auto">
                          <img src={a.image} alt={a.title} className="w-full h-full object-cover" style={{ objectPosition: '50% 30%' }} />
                        </div>
                      )}
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${t.color}`}>{t.icon} {t.vi}</span>
                          <span className="text-xs text-gray-400">{a.date}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 leading-snug" style={{ fontFamily: "'Playfair Display',serif" }}>
                          {a.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">{a.detail}</p>
                      </div>
                    </article>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Masterclass */}
        {masterclasses && masterclasses.length > 0 && (
          <div className="mt-16">
            <p className="text-amber-600 text-xs tracking-widest uppercase mb-2">Học hỏi từ đỉnh cao</p>
            <h2 className="text-2xl lg:text-3xl mb-6" style={{ fontFamily: "'Playfair Display',serif" }}>
              Các lớp <em>Masterclass</em>
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
              {masterclasses.map(m => (
                <a key={m.id} href={`/masterclass/${m.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-rose-50/40 transition-colors">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{m.professor}</p>
                    {m.event && <p className="text-xs text-gray-500 truncate">{m.event}</p>}
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{m.date}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
