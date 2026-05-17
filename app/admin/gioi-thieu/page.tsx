'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase/client'

type Section = { key: string; icon: string; label: string; color: string; title: string; body: string }

const META: Record<string, { icon: string; label: string; color: string }> = {
  violin:     { icon: '🎻', label: 'Violin',        color: 'from-rose-500 to-rose-700' },
  'hoi-hoa':  { icon: '🎨', label: 'Hội họa',       color: 'from-amber-500 to-amber-700' },
  'que-sera': { icon: '🦷', label: 'Que sera sera', color: 'from-purple-500 to-purple-700' },
}

export default function AdminGioiThieuPage() {
  const supabase = createClient()
  const [sections, setSections] = useState<Section[]>([])
  const [editing, setEditing] = useState<Section | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadContent() }, [])

  const loadContent = async () => {
    setLoading(true)
    const { data } = await supabase.from('site_content').select('*').in('key', ['violin','hoi-hoa','que-sera'])
    if (data) setSections(data.map((d: any) => ({ ...d, ...META[d.key] })))
    setLoading(false)
  }

  const save = async () => {
    if (!editing) return
    setSaving(true)
    const { error } = await supabase
      .from('site_content')
      .update({ title: editing.title, body: editing.body, updated_at: new Date().toISOString() })
      .eq('key', editing.key)
    setSaving(false)
    if (error) {
      setToast('❌ Lỗi: ' + error.message)
    } else {
      setSections(prev => prev.map(s => s.key === editing.key ? { ...s, ...editing } : s))
      setEditing(null)
      setToast('✅ Đã lưu! Trang chủ sẽ cập nhật ngay.')
    }
    setTimeout(() => setToast(''), 4000)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>Giới thiệu trang chủ</h1>
        <p className="text-gray-400 text-sm mt-1">Chỉnh sửa và lưu vào database — cập nhật ngay trang chủ.</p>
      </div>

      {toast && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm border ${toast.startsWith('✅') ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {toast}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sections.map(s => (
            <div key={s.key} className="bg-white rounded-2xl border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl`}>{s.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{s.label}</p>
                    <p className="text-xs text-gray-400">Trang chủ · Tag giới thiệu</p>
                  </div>
                </div>
                <button onClick={() => setEditing({ ...s })}
                  className="px-4 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-gray-50 transition-colors whitespace-nowrap">
                  ✏️ Sửa
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-700 mb-1">{s.icon} {s.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-lg font-semibold mb-4" style={{fontFamily:"'Playfair Display',serif"}}>
              {editing.icon} Chỉnh sửa — {editing.label}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tiêu đề</label>
                <input type="text" value={editing.title}
                  onChange={e => setEditing(v => v && ({...v, title: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nội dung giới thiệu</label>
                <textarea value={editing.body} rows={7}
                  onChange={e => setEditing(v => v && ({...v, body: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditing(null)}
                className="flex-1 py-2 border border-gray-200 rounded-full text-sm hover:bg-gray-50">Huỷ</button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 disabled:opacity-60">
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
