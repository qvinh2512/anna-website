'use client'
import { useState, useEffect, useCallback } from 'react'

export default function LightboxGallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null)

  const close = useCallback(() => setIndex(null), [])
  const prev = useCallback(() => setIndex(i => i === null ? null : (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex(i => i === null ? null : (i + 1) % images.length), [images.length])

  useEffect(() => {
    if (index === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, close, prev, next])

  return (
    <>
      {index !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={close}>
          <button onClick={close} className="absolute top-4 right-4 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all text-2xl z-10">✕</button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">{index + 1} / {images.length}</div>
          {images.length > 1 && (
            <button onClick={e => { e.stopPropagation(); prev() }} className="absolute left-4 text-white w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-4xl z-10">‹</button>
          )}
          <div className="max-w-4xl max-h-[85vh] px-16" onClick={e => e.stopPropagation()}>
            <img src={images[index]} alt={`Ảnh ${index + 1}`} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          </div>
          {images.length > 1 && (
            <button onClick={e => { e.stopPropagation(); next() }} className="absolute right-4 text-white w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-4xl z-10">›</button>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/40'}`} />
              ))}
            </div>
          )}
        </div>
      )}
      <div className={`${images.length === 1 ? 'flex justify-center' : 'grid grid-cols-2 gap-3'}`}>
        {images.map((img, i) => (
          <div key={i} onClick={() => setIndex(i)}
            className="rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200 relative group">
            <img src={img} alt={`Ảnh ${i + 1}`} className="w-full h-auto object-contain block" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
              <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 text-center mt-3">Click vào ảnh để phóng to</p>
    </>
  )
}