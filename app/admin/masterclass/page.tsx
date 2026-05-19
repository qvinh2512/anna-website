'use client'
import { useEffect, useState, useRef } from 'react'
import { createClient } from '../../lib/supabase/client'

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

const colorMap: Record<string, string> = {
  rose:    'border-rose-200 bg-rose-50',
  amber:   'border-amber-200 bg-amber-50',
  emerald: 'border-emerald-200 bg-emerald-50',
  blue:    'border-blue-200 bg-blue-50',
  purple:  'border-purple-200 bg-purple-50',
}

export default function AdminMasterclassPage() {
  const supabase = createClient()
  const [list, setList] = useState<Masterclass[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Masterclass | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageInput, setImageInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = () => {
    supabase.from('masterclasses').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setList(data as Masterclass[]); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing({ id: '', ...empty }); setForm(empty); setImageInput('') }
  const openEdit = (mc: Masterclass) => { setEditing(mc); setForm({ ...mc }); setImageInput('') }
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

  // Upload ảnh từ máy lên Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    const newUrls: string[] = []
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage
        .from('masterclass-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('masterclass-images')
          .getPublicUrl(data.path)
        newUrls.push(urlData.publicUrl)
      }
    }
    setForm(f => ({ ...f, images: [...(f.images || []), ...newUrls] }))
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const addImageUrl = () => {
    if (!imageInput.trim()) return
    setForm(f => ({ ...f, images: [...(f.images || []), imageInput.trim()] }))
    setImageInput('')
  }

  const removeImage = (i: number) => {
    setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))
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
              <p className="text-xs text-gray-500 mb-2">{mc.event}</p>
              {mc.piece && (
                <div className="bg-white rounded-lg px-3 py-2 text-xs text-gray-600 italic border mb-2">
                  🎵 {mc.piece}
                </div>
              )}
              <div className="flex gap-1.5 text-xs text-gray-400 mb-3">
                {mc.youtube_url && <span>▶ Video</span>}
                {mc.images?.length > 0 && <span>📸 {mc.images.length} ảnh</span>}
                {mc.significance && <span>💭 Cảm nhận</span>}
              </div>
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
              {/* Ngày + Màu */}
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

              {/* Tên Giáo sư */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tên Giáo sư / Tiêu đề</label>
                <input value={form.professor} onChange={e => setForm(f => ({...f, professor: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300"
                  placeholder="Prof. Felix Schwartz" />
              </div>

              {/* Sự kiện */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mô tả sự kiện</label>
                <input value={form.event} onChange={e => setForm(f => ({...f, event: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300"
                  placeholder="Masterclass violin quốc tế" />
              </div>

              {/* Tác phẩm */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bài học / Tác phẩm</label>
                <input value={form.piece} onChange={e => setForm(f => ({...f, piece: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300"
                  placeholder="Küchler Concertino Op.15" />
              </div>

              {/* YouTube */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Link YouTube (video buổi học)</label>
                <input value={form.youtube_url} onChange={e => setForm(f => ({...f, youtube_url: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300"
                  placeholder="https://youtube.com/watch?v=..." />
              </div>

              {/* Giới thiệu GS */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Giới thiệu Giáo sư</label>
                <textarea value={form.professor_bio} onChange={e => setForm(f => ({...f, professor_bio: e.target.value}))}
                  rows={3} className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300 resize-none"
                  placeholder="Giáo sư violin người Pháp, từng biểu diễn tại Carnegie Hall..." />
              </div>

              {/* Cảm nhận */}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Cảm nhận của Anna</label>
                <textarea value={form.significance} onChange={e => setForm(f => ({...f, significance: e.target.value}))}
                  rows={4} className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300 resize-none"
                  placeholder="Buổi học hôm nay thật ý nghĩa với mình vì..." />
              </div>

              {/* Hình ảnh */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Hình ảnh</label>

                {/* Upload từ máy */}
                <div className="border-2 border-dashed border-rose-200 rounded-xl p-4 text-center mb-3 hover:border-rose-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple
                    onChange={handleFileUpload} className="hidden" />
                  {uploading ? (
                    <p className="text-rose-400 text-sm">⏳ Đang upload...</p>
                  ) : (
                    <>
                      <p className="text-2xl mb-1">📷</p>
                      <p className="text-sm text-gray-500">Nhấn để chọn ảnh từ máy</p>
                      <p className="text-xs text-gray-400 mt-1">Hỗ trợ JPG, PNG, WEBP · Chọn nhiều ảnh cùng lúc</p>
                    </>
                  )}
                </div>

                {/* Hoặc dán URL */}
                <div className="flex gap-2 mb-3">
                  <input value={imageInput} onChange={e => setImageInput(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300"
                    placeholder="Hoặc dán link URL ảnh..."
                    onKeyDown={e => e.key === 'Enter' && addImageUrl()} />
                  <button onClick={addImageUrl}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm text-gray-600">
                    + Thêm
                  </button>
                </div>

                {/* Preview ảnh đã thêm */}
                {form.images && form.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative group">
                        <img src={img} alt="" className="w-full h-24 object-cover rounded-lg" />
                        <button onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          ✕
                        </button>
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
              <button onClick={save} disabled={saving || uploading}
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
