export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-52 bg-gray-900 flex-shrink-0 flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <a href="/" className="text-base italic text-white" style={{fontFamily:"'Playfair Display',serif"}}>
            Anna <span className="text-yellow-400">Quản lý</span>
          </a>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            ['🏠 Dashboard',        '/admin'],
            ['📝 Bài viết',         '/admin/bai-viet'],
            ['✏️ Viết bài mới',     '/admin/bai-viet/moi'],
            ['🎻 Masterclass',      '/admin/masterclass'],
            ['⭐ Giới thiệu',       '/admin/gioi-thieu'],
            ['👤 Thành viên',       '/admin/thanh-vien'],
            ['⚙️ Cài đặt',         '/admin/cai-dat'],
          ].map(([label, href]) => (
            <a key={href} href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              {label}
            </a>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <a href="/" className="text-xs text-white/30 hover:text-white/60">← Về trang chủ</a>
        </div>
      </aside>
      {/* Main */}
      <div className="flex-1 overflow-auto p-8">
        {children}
      </div>
    </div>
  )
}
