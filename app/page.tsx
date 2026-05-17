export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        <div className="bg-gray-900 flex flex-col justify-center px-12 py-24">
          <p className="text-rose-400 text-xs tracking-widest uppercase mb-6">Nhật ký · Âm nhạc · Nghệ thuật</p>
          <h1 className="text-6xl text-white mb-6 leading-tight" style={{fontFamily:"'Playfair Display',serif"}}>
            Anna<br/><em className="text-yellow-400">Duyên An</em>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-sm mb-8">
            Sinh ngày 04.03.2014 · Học sinh lớp 6 trường <strong className="text-white/80">Sedbergh Việt Nam</strong> · Năm nhất Trung cấp Violin 9 năm tại <strong className="text-white/80">Nhạc viện TP.HCM</strong>
          </p>
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
                className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <span className="text-3xl block mb-3">{cat.icon}</span>
                <span className="font-medium text-sm text-gray-900 block mb-1">{cat.label}</span>
                <span className="text-xs text-gray-500">{cat.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* YOUTUBE */}
      <section className="py-16 bg-gray-900 text-center">
        <div className="text-4xl mb-4">▶️</div>
        <h2 className="text-3xl text-white italic mb-3" style={{fontFamily:"'Playfair Display',serif"}}>Xem Anna biểu diễn</h2>
        <p className="text-white/50 mb-6 text-sm">Theo dõi kênh YouTube để xem các video violin và masterclass</p>
        <a href="https://www.youtube.com/@AnnaDuyenAn" target="_blank"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
          Subscribe · @AnnaDuyenAn
        </a>
      </section>
    </div>
  )
}