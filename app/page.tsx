export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-gray-900 flex flex-col justify-center px-12 py-24">
          <p className="text-rose-400 text-xs tracking-widest uppercase mb-6">Nhật ký · Âm nhạc · Nghệ thuật</p>

          <h1 className="text-6xl text-white mb-8 leading-tight" style={{fontFamily:"'Playfair Display',serif"}}>
            Anna <em className="text-yellow-400">Duyên An</em>
          </h1>

          <div className="text-white/60 text-base leading-loose mb-8 space-y-1">
            <p>📅 Sinh ngày <strong className="text-white/80">04.03.2014</strong></p>
            <p>🏫 Học sinh lớp 6 trường <strong className="text-white/80">Sedbergh Việt Nam</strong> (2024-2025)</p>
            <p>🎻 Năm nhất Trung cấp Violin 9 năm tại <strong className="text-white/80">Nhạc viện TP. HCM</strong></p>
          </div>

          <div className="flex flex-wrap gap-2 mb-10">
            {['🎻 Violin','🎨 Hội họa','🦷 Que sera sera'].map(t=>(
              <span key={t} className="text-xs px-3 py-1 border border-white/20 text-white/60 rounded-full">{t}</span>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            {[['4+','Năm violin'],['64','Tranh triển lãm'],['6+','Masterclass']].map(([n,l])=>(
              <div key={l}>
                <div className="text-3xl text-yellow-400 mb-1" style={{fontFamily:"'Playfair Display',serif"}}>{n}</div>
                <div className="text-xs text-white/40 uppercase tracking-wide">{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <div className="text-9xl mb-6">🎻</div>
            <a href="https://www.youtube.com/@AnnaDuyenAn" target="_blank"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors">
              ▶ YouTube @AnnaDuyenAn
            </a>
          </div>
        </div>
      </section>

      {/* CHUYÊN MỤC */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-rose-500 text-xs tracking-widest uppercase mb-2">Khám phá</p>
          <h2 className="text-3xl mb-8" style={{fontFamily:"'Playfair Display',serif"}}>Các chuyên mục</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              {icon:'📖',label:'Nhật Ký',href:'/nhat-ky',desc:'Hằng ngày'},
              {icon:'🎻',label:'Âm Nhạc',href:'/am-nhac',desc:'Violin · Biểu diễn'},
              {icon:'🎨',label:'Nghệ Thuật',href:'/nghe-thuat',desc:'Hội họa · Triển lãm'},
              {icon:'📚',label:'Học Thuật',href:'/hoc-thuat',desc:'Sedbergh · Kiến thức'},
              {icon:'👫',label:'Bạn Bè',href:'/ban-be',desc:'Diễn đàn · Giao lưu'},
              {icon:'🌏',label:'Xã Hội',href:'/xa-hoi',desc:'Cộng đồng · Từ thiện'},
            ].map(cat=>(
              <a key={cat.href} href={cat.href}
                className="bg-amber-50 border border-amber-100