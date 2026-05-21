'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../../lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const RichEditor = dynamic(() => import('../../../../components/RichEditor'), { ssr: false })

const CATEGORIES = [
  { id: 1, name: '📖 Nhật Ký' },
  { id: 2, name: '🎻 Âm Nhạc' },
  { id: 3, name: '🎨 Nghệ Thuật' },
  { id: 4, name: '📚 Học Thuật' },
  { id: 5, name: '👫 Bạn Bè' },
  { id: 6, name: '🌏 Xã Hội' },
]

export default function EditPostPage() {
  const supabase = createClient()
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [done, setDone] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [youtube, setYoutube] = useState('')
  const [catId, setCatId] = useState(1)
  const [tags, setTags] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [status, setStatus] = useState('published')

  useEffect(() => {
    supabase.from('posts').select('*').eq('id', params.id).single()
      .then(({ data }) => {
        if (data) {
          setTitle(data.title || '')
          setContent(data.content || '')
          setExcerpt(data.excerpt || '')
          setYoutube(data.youtube_url || '')
          setCatId(data.category_id || 1)
          setTags((data.tags || []).join(', '))
          setImages(data.images || [])
          setStatus(data.status || 'published')
        }
        setLoading(false)
      })
  }, [params.id])

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

  const save = async (newStatus: string) => {
    if (!title.trim()) { alert('Nhập tiêu đề đi!'); return }
    setSaving(true)
    const { error } = await supabase.from('posts').update({
      title: title.trim(),
      content: content || null,
      excerpt: excerpt.trim() || null,
      youtube_url: youtube.trim() || null,
      images: images.length > 0 ? images : null,
      category_id: catId,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null,
    }).eq('id', params.id)
    if (error) { alert('Lỗi: ' + error.message) }
    else { setDone(true) }
    setSaving(false)
  }

  if (loading) return <div className="py-24 text-center text-gray-400">Đang tải...</div>

  if (done) return (
    <div className="text-center py-24">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-2xl font-semibold mb-3">Đã lưu!</h2>
      <div className="flex gap-3 justify-center">
        <button onClick={() => router.back()}
          className="px-5 py-2 border rounded-full text-sm hover:bg-gray-50">
          ← Quay lại
        </button>
        <a href="/admin/bai-viet"
          className="px-5 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600">
          Danh sách bài
        </a>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 text-sm">← Quay lại</button>
        <h1 className="text-2xl font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>Sửa bài viết</h1>
        <span className={`text-xs px-2 py-0.5 rounded-full ${status === 'published' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
          {status === 'published' ? '✅ Đã đăng' : '📝 Nháp'}
        </span>
      </div>

      <div className="bg-white rounded-2xl border p-6 space-y-5">
        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Tiêu đề *</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)}
            className="w-full text-xl border-0 border-b border-gray-100 pb-2 focus:outline-none focus:border-rose-300" />
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Chuyên mục</label>
          <select value={catId} onChange={e => setCatId(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300">
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Tóm tắt ngắn</label>
          <textarea rows={2} value={excerpt} onChange={e => setExcerpt(e.target.value)}
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300 resize-none" />
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">Nội dung bài viết</label>
          <RichEditor value={content} onChange={setContent} />
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">📸 Ảnh bìa</label>
          <label className={`flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? 'border-gray-200 bg-gray-50' : 'border-rose-200 hover:border-rose-400 hover:bg-rose-50'}`}>
            <input type="file" accept="image/*" multiple className="hidden" disabled={uploading}
              onChange={e => { Array.from(e.target.files||[]).forEach(f => uploadImage(f)); e.target.value = '' }} />
            {uploading ? <span className="text-xs text-gray-400">⏳ Đang upload...</span>
              : <span className="text-xs text-rose-400">📎 Thêm ảnh bìa</span>}
          </label>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {images.map((url, i) => (
                <div key={i} className="relative group rounded-xl overflow-hidden">
                  <img src={url} alt="" className="w-full h-24 object-cover" />
                  <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">🎬 Link YouTube</label>
          <input type="url" value={youtube} onChange={e => setYoutube(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300" />
        </div>

        <div>
          <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Tags</label>
          <input type="text" value={tags} onChange={e => setTags(e.target.value)}
            placeholder="violin, masterclass, 2025"
            className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300" />
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={() => save('draft')} disabled={saving||uploading}
            className="px-6 py-2.5 border border-gray-200 rounded-full text-sm hover:bg-gray-50 disabled:opacity-60">
            💾 Lưu nháp
          </button>
          <button onClick={() => save('published')} disabled={saving||uploading}
            className="px-6 py-2.5 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 disabled:opacity-60">
            🚀 {saving ? 'Đang lưu...' : 'Cập nhật & đăng'}
          </button>
        </div>
      </div>
    </div>
  )
}
