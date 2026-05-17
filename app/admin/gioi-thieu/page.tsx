'use client'
import { useState } from 'react'

type Section = {
  key: string
  icon: string
  label: string
  title: string
  body: string
  color: string
}

const INITIAL: Section[] = [
  {
    key: 'violin',
    icon: '🎻',
    label: 'Violin',
    color: 'from-rose-500 to-rose-700',
    title: 'Violin — Đam mê từ tiếng đàn đầu tiên',
    body: 'Anna bắt đầu học violin từ nhỏ và hiện là học sinh năm nhất ngành Violin hệ Trung cấp 9 năm tại Nhạc viện Thành phố Hồ Chí Minh. Mỗi ngày luyện tập là một hành trình khám phá âm nhạc — từ các bài etude cơ bản đến những buổi Masterclass với các Giáo sư quốc tế. Anna đã tham gia nhiều buổi hòa tấu, biểu diễn tại các sân khấu lớn như Dalat Opera House. Ước mơ lớn nhất của Anna là trở thành nghệ sỹ violin chuyên nghiệp.',
  },
  {
    key: 'hoi-hoa',
    icon: '🎨',
    label: 'Hội họa',
    color: 'from-amber-500 to-amber-700',
    title: 'Hội họa — Thế giới màu sắc của Anna',
    body: 'Bên cạnh âm nhạc, hội họa là người bạn đồng hành thứ hai của Anna. Anna yêu thích vẽ tranh sơn dầu — từ tĩnh vật đến phong cảnh. Năm 2024, Anna cùng bạn Nguyên Khoa tổ chức triển lãm tranh từ thiện "Tết Yêu Thương, Xuân Chia Sẻ" tại M&M Workshop, Thủ Đức — bán tranh gây quỹ giúp các em nhỏ bệnh hiểm nghèo.',
  },
  {
    key: 'que-sera',
    icon: '🦷',
    label: 'Que sera sera',
    color: 'from-purple-500 to-purple-700',
    title: 'Que sera sera — Ước mơ Bác sỹ Nha khoa',
    body: '"Que sera sera — whatever will be, will be." Anna có ước mơ thứ hai song song với âm nhạc: trở thành Bác sỹ Nha khoa. Anna tin rằng có thể vừa là nghệ sỹ violin vừa là bác sỹ — vì cả hai đều cần sự tỉ mỉ, kiên nhẫn và trái tim yêu thương con người.',
  },
]

export default function AdminGioiThieuPage() {
  const [sections, setSections] = useState<Section[]>(INITIAL)
  const [editing, setEditing] = useState<Section | null>(null)
  const [saved, setSaved] = useState(false)

  const openEdit = (s: Section) => {
    setEditing({ ...s })
    setSaved(false)
  }

  const save = () => {
    if (!editing) return
    setSections(prev => prev.map(s => s.key === editing.key ? editing : s))
    setEditing(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{fontFamily:"'Playfair Display',serif"}}>
          Giới thiệu trang chủ
        </h1>
        <p className="text-gray-400 text-sm mt-1">Chỉnh sửa nội dung 3 mục Violin · Hội họa · Que sera sera hiện trên trang chủ</p>
      </div>

      {saved && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          ✅ Đã lưu thành công!
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {sections.map(s => (
          <div key={s.key} className="bg-white rounded-2xl border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-2xl w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  {s.icon}
                </span>
                <div>
                  <p className="font-semibold text-sm">{s.label}</p>
                  <p className="text-xs text-gray-400">Trang chủ · Tag giới thiệu</p>
                </div>
              </div>
              <button onClick={() => openEdit(s)}
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

      {/* MODAL */}
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
                <textarea value={editing.body} rows={6}
                  onChange={e => setEditing(v => v && ({...v, body: e.target.value}))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-rose-300 resize-none" />
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
