'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase/client'

type Video = {
  id: string
  title: string
  youtube_url: string
  category: string
  year: string
  sort_order: number
}

const CATEGORIES = ['Nhạc Việt', 'Cổ điển', 'Nhạc Thánh']

function getYouTubeId(url: string) {
  if (!url) return null
  const match = url.match(/(?:v=|youtu\.be\/|embed\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default function AdminVideoPage() {
  const supabase = createClient()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('Nhạc Việt')
  const [year, setYear] = useState(new Date().getFullYear().toString())

  const load = async () => {
    const { data } = await supabase.from('videos').select('*').order('sort_order').order('created_at', { ascending: false })
    if (data) setVideos(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    if (!title.trim() || !url.trim()) { alert('Nhập đủ tiêu đề và link YouTube!'); return }
    if (!getYouTubeId(url)) { alert('Link YouTube không hợp lệ!'); return }
    setSaving(true)
    const { error } = await supabase.from('videos').insert({
      title: title.trim(),
      youtube_url: url.trim(),
      category,
      year,
      sort_order: videos.length,
    })
    if (error) { alert('Lỗi: ' + error.message) }
    else {
      setTitle(''); setUrl(''); setShowForm(false)
      load()
    }
    setSaving(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Xóa video này?')) return
    await supabase.from('videos').delete().eq('id', id)
    load()
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>
            🎬 Quản lý Video
          </h1>
          <p className="text-gray-400 text-sm mt-1">Thêm hoặc xóa video YouTube trên trang Âm Nhạc</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 transition-colors">
          + Thêm video
        </button>
      </div>

      {/* Form thêm video */}
      {showForm && (
        <div className="bg-white border rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Thêm video mới</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Tiêu đề *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="Đời có bao nhiêu ngày vui"
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Link YouTube *</label>
              <input type="url" value={url} onChange={e => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Thể loại</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Năm</label>
                <input type="text" value={year} onChange={e => setYear(e.target.value)}
                  placeholder="2025"
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300" />
              </div>
            </div>
            {/* Preview */}
            {getYouTubeId(url) && (
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">Preview</label>
                <img src={`https://img.youtube.com/vi/${getYouTubeId(url)}/mqdefault.jpg`}
                  alt="preview" className="rounded-xl w-full max-w-xs" />
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={add} disabled={saving}
                className="px-6 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 disabled:opacity-60 transition-colors">
                {saving ? 'Đang lưu...' : '💾 Lưu'}
              </button>
              <button onClick={() => setShowForm(false)}
                className="px-6 py-2 border rounded-full text-sm hover:bg-gray-50 transition-colors">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách video */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Đang tải...</div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-4xl mb-3">🎬</div>
          <p>Chưa có video nào. Thêm video đầu tiên đi!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((v, i) => (
            <div key={v.id} className="bg-white border rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <span className="text-gray-300 text-sm w-6 text-center">{i + 1}</span>
              <img src={`https://img.youtube.com/vi/${getYouTubeId(v.youtube_url)}/mqdefault.jpg`}
                alt={v.title} className="w-24 h-14 object-cover rounded-lg flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm truncate">{v.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{v.year} · {v.category}</p>
              </div>
              <button onClick={() => remove(v.id)}
                className="text-red-400 hover:text-red-600 text-sm px-3 py-1 rounded-full hover:bg-red-50 transition-colors flex-shrink-0">
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 pt-6 border-t">
        <a href="/am-nhac" className="text-sm text-rose-500 hover:underline">← Xem trang Âm Nhạc</a>
      </div>
    </div>
  )
}
