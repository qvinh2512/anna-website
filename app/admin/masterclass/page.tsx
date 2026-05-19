'use client'
import { useEffect, useState } from 'react'
import { createClient } from '../../../lib/supabase/client'

type Masterclass = {
  id: string
  date: string
  professor: string
  event: string
  piece: string
  color: string
  professor_bio: string
  significance: string
  youtube_url: string
  images: string[]
}

const empty: Omit<Masterclass, 'id'> = {
  date: '', professor: '', event: '', piece: '',
  color: 'rose', professor_bio: '', significance: '',
  youtube_url: '', images: []
}

const colors = [
  { value: 'rose',    label: '🌸 Hồng' },
  { value: 'amber',   label: '🌼 Vàng' },
  { value: 'emerald', label: '🌿 Xanh lá' },
  { value: 'blue',    label: '💙 Xanh dương' },
  { value: 'purple',  label: '💜 Tím' },
]

export default function AdminMasterclassPage() {
  const supabase = createClient()
  const [list, setList] = useState<Masterclass[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Masterclass | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [imageInput, setImageInput] = useState('')

  const load = () => {
    supabase.from('masterclasses').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setList(data as Masterclass[]); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const openNew = () => {
    setEditing({ id: '', ...empty })
    setForm(empty)
    setImageInput('')
  }

  const openEdit = (mc: Masterclass) => {
    setEditing(mc)
    setForm({ ...mc })
    setImageInput('')
  }

  const closeModal = () => { setEditing(null); setForm(empty) }

  const save = async () => {
    setSaving(true)
    if (editing?.id) {
      await supabase.from('masterclasses').update(form).eq('id', editing.id)
    } else {
      await supabase.from('masterclasses').insert(form)
    }
    setSaving(false)
    closeModal()
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Xoá masterclass này?')) return
    await supabase.from('masterclasses').delete().eq('id', id)
    load()
  }

  const addImage = () => {
    if (!imageInput.trim()) return
    setForm(f => ({ ...f, images: [...(f.images || []), imageInput.trim()] }))
    setImageInput('')
  }

  const removeImage = (i: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))
  }

  const colorMap: Record<string, string> = {
    rose: 'border-rose-200 bg-rose-50',
    amber: 'border-amber-200 bg-amber-50',
    emerald: 'border-emerald-200 bg-emerald-50',
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>Masterclass</h1>
          <p className="text-gray-400 text-sm mt-1">Quản lý các lớp học với Giáo sư violin</p>
        </div>
        <button onClick={openNew}
          className="px-4 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors">
          + Thêm mới
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(mc => (
            <div key={mc.id}
              className={`border-2 ${colorMap[mc.color] || colorMap.rose} rounded-2xl p-5 shadow-sm`}>
              <p className="text-xs text-gray-400 mb-1">{mc.date}</p>
              <h3 className="font-semibold text-gray-800 mb-1 text-sm" style={{fontFamily:"'Playfair Display',serif"}}>
                {mc.professor}
              </h3>
              <p className="text-xs text-gray-500 mb-3">{mc.event}</p>
              {mc.piece && (
                <div className="bg-white rounded-lg px-3 py-2 text-xs text-gray-600 italic border mb-3">
                  🎵 {mc.piece}
                </div>
              )}
              {mc.youtube_url && (
                <p className="text-xs text-rose-400 mb-3">▶ Có video YouTube</p>
              )}
              <div className="flex gap-2 flex-wrap">
                <a href={`/am-nhac/masterclass/${mc.id}`} target="_blank"
                  className="text-xs px-3 py-1.5 border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50">
                  👁 Xem
                </a>
                <button onClick={() => openEdit(mc)}
                  className="text-xs px-3 py-1.5 border border-amber-200 rounded-full text-amber-600 hover:bg-amber-50">
                  ✏️ Sửa
                </button>
                <button onClick={() => del(mc.id)}
                  className="text-xs px-3 py-1.5 border border-red-200 rounded-full text-red-500 hover:bg-red-50">
                  🗑 Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>
                {editing.id ? 'Chỉnh sửa Masterclass' : 'Thêm Masterclass mới'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Ngày (VD: 18.03.2025)</label>
                  <input value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Màu thẻ</label>
                  <select value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300 bg-white">
                    {colors.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Tên Giáo sư / Tiêu đề</label>
                <input value={form.professor} onChange={e => setForm(f => ({...f, professor: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300"
                  placeholder="Prof. Felix Schwartz" />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Mô tả sự kiện</label>
                <input value={form.event} onChange={e => setForm(f => ({...f, event: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300"
                  placeholder="Masterclass violin quốc tế" />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Bài học / Tác phẩm</label>
                <input value={form.piece} onChange={e => setForm(f => ({...f, piece: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300"
                  placeholder="Küchler Concertino Op.15" />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Link YouTube (video buổi học)</label>
                <input value={form.youtube_url} onChange={e => setForm(f => ({...f, youtube_url: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300"
                  placeholder="https://youtube.com/watch?v=..." />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Giới thiệu Giáo sư</label>
                <textarea value={form.professor_bio} onChange={e => setForm(f => ({...f, professor_bio: e.target.value}))}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300 resize-none"
                  placeholder="Giáo sư violin người Pháp, từng biểu diễn tại Carnegie Hall..." />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Cảm nhận của Anna</label>
                <textarea value={form.significance} onChange={e => setForm(f => ({...f, significance: e.target.value}))}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300 resize-none"
                  placeholder="Buổi học hôm nay thật ý nghĩa với mình vì..." />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Hình ảnh (URL)</label>
                <div className="flex gap-2 mb-2">
                  <input value={imageInput} onChange={e => setImageInput(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300"
                    placeholder="https://..." onKeyDown={e => e.key === 'Enter' && addImage()} />
                  <button onClick={addImage}
                    className="px-4 py-2 bg-rose-500 text-white rounded-xl text-sm hover:bg-rose-600">
                    + Thêm
                  </button>
                </div>
                {form.images && form.images.length > 0 && (
                  <div className="space-y-1">
                    {form.images.map((img, i) => (
                      <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                        <span className="flex-1 text-xs text-gray-500 truncate">{img}</span>
                        <button onClick={() => removeImage(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button onClick={closeModal}
                className="flex-1 py-2.5 border border-gray-200 rounded-full text-sm text-gray-500 hover:bg-gray-50">
                Huỷ
              </button>
              <button onClick={save} disabled={saving}
                className="flex-1 py-2.5 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 disabled:opacity-50">
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
