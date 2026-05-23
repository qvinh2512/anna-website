'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../lib/supabase/client'

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

export default function MasterclassPage() {
  const supabase = createClient()
  const [masterclasses, setMasterclasses] = useState<Masterclass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('masterclasses').select('id,date,professor,event,piece,color,event_date')
      .order('event_date', { ascending: false })
      .then(({ data }) => { if (data) setMasterclasses(data); setLoading(false) })
  }, [])

  return (
    <div style={{backgroundColor:'#fffbf5'}} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-amber-600 text-xs tracking-widest uppercase mb-2">Học hỏi từ đỉnh cao</p>
          <h1 className="text-4xl mb-3" style={{fontFamily:"'Playfair Display',serif"}}>
            🎓 Các lớp <em>Masterclass</em>
          </h1>
          <p className="text-gray-500 text-sm">Những buổi học với các Giáo sư violin hàng đầu trong hành trình của Anna.</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => (
              <div key={i} className="border-2 border-gray-100 bg-gray-50 rounded-2xl p-5 animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {masterclasses.map(m => (
              <a key={m.id} href={`/masterclass/${m.id}`}
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
            ))}
          </div>
        )}
      </div>
    </div>
  )
}