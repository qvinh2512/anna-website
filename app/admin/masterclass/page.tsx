'use client'
import { useState } from 'react'

type Card = {
  id: number
  date: string
  prof: string
  event: string
  piece: string
  color: 'rose' | 'amber' | 'emerald'
}

const COLOR_STYLES = {
  rose:    'border-rose-200 bg-rose-50',
  amber:   'border-amber-200 bg-amber-50',
  emerald: 'border-emerald-200 bg-emerald-50',
}

const INITIAL: Card[] = [
  { id: 1, date: '18.03.2025', prof: 'Prof. Felix Schwartz',       event: 'Masterclass violin quốc tế', piece: 'Küchler Concertino',          color: 'rose'    },
  { id: 2, date: '26.03.2025', prof: 'Prof. Addison',              event: 'Masterclass tại TP.HCM',     piece: 'Kỹ thuật ngón tay & âm sắc', color: 'amber'   },
  { id: 3, date: '2024',       prof: 'Giáo sư thỉnh giảng (Pháp)', event: 'Masterclass nghệ thuật',     piece: 'Certificate of Participation', color: 'emerald' },
]

export default function AdminMasterclassPage() {
  const [cards, setCards] = useState<Card[]>(INITIAL)
  const [editing, setEditing] = useState<Card | null>(null)
  const [isNew, setIsNew] = useState(false)

  const openNew = () => {
    setEditing({ id: Date.now(), date: '', prof: '', event: '', piece: '', color: 'rose' })
    setIsNew(true)
  }

  const openEdit = (c: Card) => {
    setEditing({ ...c })
    setIsNew(false)
  }

  const save = () => {
    if (!editing) return
    if (isNew) setCards(prev => [...prev, editing])
    else setCards(prev => prev.map(c => c.id === editing.id ? editing : c))
    setEditing(null)
  }

  const remove = (id: number) => {
    if (confirm('Xoá Masterclass này?')) setCards(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>
            Masterclass
          </h1>
          <p className="text-gray-400 text-sm mt-1">Quản lý các lớp học với Giáo sư violin</p>
        </div>
        <button onClick={openNew}
          className="px-4 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors">
          + Thêm mới
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(c => (
          <div key={c.id} className={`border-2 ${COLOR_STYLES[c.color]} rounded-2xl p-5 relative`}>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">{c.date}</p>
            <h3 className="font-semibold text-gray-900 mb-1" style={{fontFamily:"'Playfair Display',serif"}}>{c.prof}</h3>
            <p className="text-xs text-gray-500 mb-3">{c.event}</p>
            <div className="bg-white rounded-lg px-3 py-2 text-xs text-gray-700 italic border border-gray-100 mb-4">
              🎵 {c.piece}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)}
                className="flex-1 py-1.5 text-xs border border-gray-200 rounded-full hover:bg-white transition-colors">
                ✏️ Sửa
              </button>
              <button onClick={() => remove(c.id)}
                className="flex-1 py-1.5 text-xs border border-red-200 text-red-500 rounded-full hover:bg-red-50 transition-colors">
                🗑 Xoá
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4" style={{fontFamily:"'Playfair Display',serif"}}>
              {isNew ? 'Thêm Masterclass mới' : 'Chỉnh sửa Masterclass'}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ngày (VD: 18.03.2025)</label>
                <input type="text" value={editing.date}
                  onChange={e => setEditing(v => v && ({...v, date: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Giáo sư / Tên sự kiện</label>
                <input type="text" value={editing.prof}
                  onChange={e => setEditing(v => v && ({...v, prof: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mô tả ngắn</label>
                <input type="text" value={editing.event}
                  onChange={e => setEditing(v => v && ({...v, event: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bài học / Nội dung</label>
                <input type="text" value={editing.piece}
                  onChange={e => setEditing(v => v && ({...v, piece: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Màu thẻ</label>
                <select value={editing.color}
                  onChange={e => setEditing(v => v && ({...v, color: e.target.value as Card['color']}))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300">
                  <option value="rose">🌸 Hồng</option>
                  <option value="amber">🌼 Vàng</option>
                  <option value="emerald">🌿 Xanh lá</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditing(null)}
                className="flex-1 py-2 border border-gray-200 rounded-full text-sm hover:bg-gray-50 transition-colors">
                Huỷ
              </button>
              <button onClick={save}
                className="flex-1 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors">
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
