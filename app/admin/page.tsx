export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2" style={{fontFamily:"'Playfair Display',serif"}}>
        Dashboard
      </h1>
      <p className="text-gray-500 text-sm mb-8">Chào mừng Anna trở lại! Quản lý trang web tại đây.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Bài đã đăng', value: '0', icon: '📝', color: 'bg-rose-50 text-rose-500' },
          { label: 'Thành viên',  value: '1', icon: '👤', color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Bình luận',   value: '0', icon: '💬', color: 'bg-green-50 text-green-600' },
          { label: 'Chờ duyệt',  value: '0', icon: '⏳', color: 'bg-purple-50 text-purple-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-5">
            <div className={`text-2xl mb-2`}>{s.icon}</div>
            <div className="text-3xl font-semibold mb-1" style={{fontFamily:"'Playfair Display',serif"}}>{s.value}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <a href="/admin/bai-viet/moi"
          className="bg-white rounded-2xl border p-5 flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-xl">✏️</div>
          <div>
            <p className="font-medium text-sm">Viết bài mới</p>
            <p className="text-xs text-gray-400">Tạo bài viết mới</p>
          </div>
        </a>
        <a href="/admin/thanh-vien"
          className="bg-white rounded-2xl border p-5 flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-xl">👥</div>
          <div>
            <p className="font-medium text-sm">Duyệt thành viên</p>
            <p className="text-xs text-gray-400">Xét duyệt đăng ký</p>
          </div>
        </a>
        <a href="/admin/cai-dat"
          className="bg-white rounded-2xl border p-5 flex items-center gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">⚙️</div>
          <div>
            <p className="font-medium text-sm">Cài đặt trang</p>
            <p className="text-xs text-gray-400">Chỉnh nội dung</p>
          </div>
        </a>
      </div>
    </div>
  )
}