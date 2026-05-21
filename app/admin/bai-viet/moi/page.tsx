'use client'
import { useState } from 'react'
import { createClient } from '../../../lib/supabase/client'
import dynamic from 'next/dynamic'

const RichEditor = dynamic(() => import('../../../../components/RichEditor'), { ssr: false })

const CATEGORIES = [
  { id: 1, name: '📖 Nhật Ký',    slug: 'nhat-ky'    },
  { id: 2, name: '🎻 Âm Nhạc',   slug: 'am-nhac'    },
  { id: 3, name: '🎨 Nghệ Thuật', slug: 'nghe-thuat' },
  { id: 4, name: '📚 Học Thuật',  slug: 'hoc-thuat'  },
  { id: 5, name: '👫 Bạn Bè',    slug: 'ban-be'     },
  { id: 6, name: '🌏 Xã Hội',    slug: 'xa-hoi'     },
]

export default function NewPostPage() {
  const supabase = createClient()
  const [title, setTitle]     = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [youtube, setYoutube] = useState('')
  const [catId, setCatId]     = useState(1)
  const [tags, setTags]       = useState('')
  const [saving, setSaving]   = useState(false)
  const [done, setDone]       = useState(false)
  const [images, setImages]   = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const uploadImage = async (file: File) => {
    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `posts/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('anna-images').upload(fileName, file)
    if (error) { alert('Lỗi upload: ' + error.message); setUploading(false); return }
    const { data } = supabase.storage.from('anna-images').getPublicUrl(fileName)
    setImages(prev => [...prev, data.publicUrl])
    setUploading(false)
  }

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx))

  const save = async (status: 'draft' | 'published') => {
    if (!title.trim()) { alert('Nhập tiêu đề đi!'); return }
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('Chưa đăng nhập!'); setSaving(false); return }

    const slug = title.toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g,'a')
      .replace(/[èéẹẻẽêềếệểễ]/g,'e')
      .replace(/[ìíịỉĩ]/g,'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g,'o')
      .replace(/[ùúụủũưừứựửữ]/g,'u')
      .replace(/[ỳýỵỷỹ]/g,'y')
      .replace(/đ/g,'d')
      .replace(/[^a-z0-9\s]/g,'')
      .trim().replace(/\s+/g,'-') + '-' + Date.now()

    const { error } = await supabase.from('posts').insert({
      author_id:    user.id,
      category_id:  catId,
      title:        title.trim(),
      slug,
      excerpt:      excerpt.trim() || null,
      content:      content || null,
      youtube_url:  youtube.trim() || null,
      images:       images.length > 0 ? images : null,
      tags:         tags.split(',').map(t=>t.trim()).filter(Boolean),
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
    })

    if (error) { alert('Lỗi: ' + error.message) }
    else { setDone(true) }
    setSaving(false)
  }

  if (done) return (
    <div className="text-center py-24">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-2xl font-semibold mb-3">Đăng bài thành công!</h2>
      <div className="flex gap-3 justify-center">
        <a href="/admin/bai-viet" className="px-5 py-2 border rounded-full text-sm hover:bg-gray-50">
          Xem danh sách bài
        </a>
        <button onClick={() => { setDone(false); setTitle(''); setContent(''); setExcerpt(''); setImages([]) }}
          className="px-5 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600">
          Viết bài mới
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6" style={{fontFamily:"'Playfair Display',serif"}}>
        Viết bài mới
      </h1>

      <div className="bg-white rounded-2xl border p-6 space-y-5">

        {/* Tiêu đề */}
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Tiêu đề *</label>
          <input type="text" value={title} onChange={e=>setTitle(e.target.value)}
            placeholder="Tiêu đề bài viết..."
            className="w-full text-xl border-0 border-b border-gray-100 pb-2 focus:outline-none focus:border-rose-300 transition-colors" />
        </div>

        {/* Chuyên mục */}
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Chuyên mục</label>
          <select value={catId} onChange={e=>setCatId(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300">
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Tóm tắt */}
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Tóm tắt ngắn</label>
          <textarea rows={2} value={excerpt} onChange={e=>setExcerpt(e.target.value)}
            placeholder="Một câu mô tả ngắn về bài viết..."
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300 resize-none" />
        </div>

        {/* Nội dung - Rich Editor */}
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Nội dung bài viết</label>
          <RichEditor value={content} onChange={setContent} placeholder="Viết nội dung bài ở đây..." />
        </div>

        {/* Upload ảnh bìa */}
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">📸 Ảnh bìa (hiển thị đầu bài)</label>
          <label className={`flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? 'border-gray-200 bg-gray-50' : 'border-rose-200 hover:border-rose-400 hover:bg-rose-50'}`}>
            <input type="file" accept="image/*" multiple className="hidden" disabled={uploading}
              onChange={e => { Array.from(e.target.files||[]).forEach(f=>uploadImage(f)); e.target.value='' }} />
            {uploading
              ? <span className="text-xs text-gray-400">⏳ Đang upload...</span>
              : <span className="text-xs text-rose-400">📎 Chọn ảnh bìa (có thể chọn nhiều)</span>}
          </label>
          {images.length > 0 && (
            <div className="grid grid-cols-
