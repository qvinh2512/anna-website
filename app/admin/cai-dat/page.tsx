'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase/client'

type Settings = Record<string, string>

const SECTIONS = [
  {
    id: 'stats',
    title: '📊 Thống kê trang chủ',
    desc: 'Các con số hiển thị ở trang chủ',
    fields: [
      { key: 'stat_violin',      label: 'Số năm Violin',       placeholder: '4+' },
      { key: 'stat_tranh',       label: 'Số tranh triển lãm',  placeholder: '64' },
      { key: 'stat_masterclass', label: 'Số Masterclass',      placeholder: '6+' },
    ]
  },
  {
    id: 'social',
    title: '🔗 Mạng xã hội',
    desc: 'Link các trang mạng xã hội của Anna',
    fields: [
      { key: 'social_youtube',  label: 'YouTube',  placeholder: 'https://youtube.com/@AnnaDuyenAn' },
      { key: 'social_facebook', label: 'Facebook', placeholder: 'https://facebook.com/anna.duyen.an' },
    ]
  },
  {
    id: 'dreams',
    title: '💭 Ô mơ ước trang chủ',
    desc: 'Nội dung khi click vào Violin, Hội họa, Que sera sera',
    fields: [
      { key: 'dream_violin_title',   label: 'Tiêu đề Violin',         placeholder: '🎻 Violin — Đam mê từ tiếng đàn đầu tiên' },
      { key: 'dream_violin_body',    label: 'Nội dung Violin',         placeholder: 'Mô tả về violin...' },
      { key: 'dream_hoihoa_title',   label: 'Tiêu đề Hội họa',        placeholder: '🎨 Hội họa — Thế giới màu sắc của Anna' },
      { key: 'dream_hoihoa_body',    label: 'Nội dung Hội họa',        placeholder: 'Mô tả về hội họa...' },
      { key: 'dream_quesera_title',  label: 'Tiêu đề Que sera sera',   placeholder: '🦷 Que sera sera — Ước mơ Bác sỹ Nha khoa' },
      { key: 'dream_quesera_body',   label: 'Nội dung Que sera sera',  placeholder: 'Mô tả về ước mơ...' },
    ]
  },
  {
    id: 'menu',
    title: '📋 Tên các chuyên mục',
    desc: 'Đổi tên hiển thị trên menu và trang chủ',
    fields: [
      { key: 'menu_nhatky',    label: 'Nhật Ký',    placeholder: 'Nhật Ký' },
      { key: 'menu_amnhac',    label: 'Âm Nhạc',    placeholder: 'Âm Nhạc' },
      { key: 'menu_nghethuat', label: 'Nghệ Thuật', placeholder: 'Nghệ Thuật' },
      { key: 'menu_hocthuat',  label: 'Học Thuật',  placeholder: 'Học Thuật' },
      { key: 'menu_banbe',     label: 'Bạn Bè',     placeholder: 'Bạn Bè' },
      { key: 'menu_xahoi',     label: 'Xã Hội',     placeholder: 'Xã Hội' },
    ]
  },
  {
    id: 'theme',
    title: '🎨 Theme màu',
    desc: 'Màu chủ đạo của trang web',
    fields: [
      { key: 'theme_color', label: 'Màu chủ đạo', placeholder: 'rose' },
    ]
  },
]

const THEME_COLORS = [
  { key: 'rose',    label: 'Hồng',  bg: 'bg-rose-500' },
  { key: 'amber',   label: 'Vàng',  bg: 'bg-amber-500' },
  { key: 'emerald', label: 'Xanh lá', bg: 'bg-emerald-500' },
  { key: 'blue',    label: 'Xanh dương', bg: 'bg-blue-500' },
  { key: 'purple',  label: 'Tím',   bg: 'bg-purple-500' },
  { key: 'violet',  label: 'Tím đậm', bg: 'bg-violet-500' },
]

export default function CaiDatPage() {
  const supabase = createClient()
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('site_settings').select('key,value')
      .then(({ data }) => {
        if (data) {
          const map: Settings = {}
          data.forEach(d => { map[d.key] = d.value || '' })
          setSettings(map)
        }
        setLoading(false)
      })
  }, [])

  const saveSection = async (sectionId: string, keys: string[]) => {
    setSaving(sectionId)
    for (const key of keys) {
      await supabase.from('site_settings')
        .upsert({ key, value: settings[key] || '', updated_at: new Date().toISOString() })
    }
    setSaving(null)
    setSaved(sectionId)
    setTimeout(() => setSaved(null), 2000)
  }

  if (loading) return <div className="py-24 text-center text-gray-400">Đang tải...</div>

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-2" style={{fontFamily:"'Playfair Display',serif"}}>
        Cài đặt trang
      </h1>
      <p className="text-gray-400 text-sm mb-8">Tùy chỉnh nội dung và giao diện trang web của Anna</p>

      <div className="space-y-6">
        {SECTIONS.map(section => (
          <div key={section.id} className="bg-white rounded-2xl border p-6">
            <div className="mb-4">
              <h2 className="font-semibold text-gray-800 mb-1">{section.title}</h2>
              <p className="text-xs text-gray-400">{section.desc}</p>
            </div>

            {/* Theme color picker đặc biệt */}
            {section.id === 'theme' ? (
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wide mb-3">Chọn màu chủ đạo</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {THEME_COLORS.map(color => (
                    <button key={color.key} type="button"
                      onClick={() => setSettings(prev => ({ ...prev, theme_color: color.key }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                        settings['theme_color'] === color.key
                          ? 'border-gray-800 shadow-md scale-105'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}>
                      <div className={`w-4 h-4 rounded-full ${color.bg}`} />
                      <span className="text-sm">{color.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {section.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                      {field.label}
                    </label>
                    {field.key.endsWith('_body') ? (
                      <textarea rows={3}
                        value={settings[field.key] || ''}
                        onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300 resize-none" />
                    ) : (
                      <input type="text"
                        value={settings[field.key] || ''}
                        onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:border-rose-300" />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => saveSection(section.id, section.fields.map(f => f.key))}
                disabled={saving === section.id}
                className="px-5 py-2 bg-rose-500 text-white rounded-full text-sm hover:bg-rose-600 disabled:opacity-60 transition-colors">
                {saving === section.id ? '⏳ Đang lưu...' : '💾 Lưu'}
              </button>
              {saved === section.id && (
                <span className="text-green-500 text-sm">✅ Đã lưu!</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
