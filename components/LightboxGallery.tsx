'use client'
import { useState, useEffect, useCallback } from 'react'

export default function LightboxGallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const [orientations, setOrientations] = useState<boolean[]>([]) // true = đứng

  useEffect(() => {
    const results: boolean[] = new Array(images.length).fill(true)
    let loaded = 0
    images.forEach((src, i) => {
      const img = new Image()
      img.onload = () => {
        results[i] = img.naturalHeight > img.naturalWidth
        loaded++
        if (loaded === images.length) setOrientations([...results])
      }
      img.src = src
    })
  }, [images])

  const close = useCallback(() => setIndex(null), [])
  const prev  = useCallback(() => setIndex(i => i === null ? null : (i - 1 + images.length) % images.length), [images.length])
  const next  = useCallback(() => setIndex(i => i === null ? null : (i + 1) % images.length), [images.length])

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

  // Tìm ảnh đứng đầu tiên và các ảnh còn lại
  const firstPortrait = orientations.length > 0 ? orientations.findIndex(o => o === true) : -1
  const hasPortrait = firstPortrait !== -1
  const others = images.map((_, i) => i).filter(i => i !== firstPortrait)

  // Layout thông minh theo số lượng ảnh
  const renderGrid = () => {
    if (images.length === 1) {
      return (
        <div className="flex justify-center">
          <div onClick={() => setIndex(0)} className="rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative group max-w-lg w-full">
            <img src={images[0]} alt="Ảnh 1" className="w-full h-auto block" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
              <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
            </div>
          </div>
        </div>
      )
    }

    if (images.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-3">
          {images.map((img, i) => (
            <div key={i} onClick={() => setIndex(i)} className="rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative group">
              <img src={img} alt={`Ảnh ${i+1}`} className="w-full h-full object-cover block" style={{minHeight:'160px', maxHeight:'320px'}} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
              </div>
            </div>
          ))}
        </div>
      )
    }

    // 3+ ảnh: nếu có ảnh đứng → layout đặc biệt (đứng trái + ngang phải)
    if (images.length >= 3 && hasPortrait && orientations.length === images.length) {
      const rightImages = others.slice(0, 2)
      const remaining = others.slice(2)
      return (
        <>
          <div className="flex gap-3 mb-3">
            {/* Ảnh đứng bên trái */}
            <div onClick={() => setIndex(firstPortrait)} className="flex-1 rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative group">
              <img src={images[firstPortrait]} alt={`Ảnh ${firstPortrait+1}`} className="w-full h-full object-cover block" style={{minHeight:'280px'}} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
              </div>
            </div>
            {/* 2 ảnh ngang chồng bên phải */}
            <div className="flex-1 flex flex-col gap-3">
              {rightImages.map(i => (
                <div key={i} onClick={() => setIndex(i)} className="flex-1 rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative group">
                  <img src={images[i]} alt={`Ảnh ${i+1}`} className="w-full h-full object-cover block" style={{minHeight:'130px'}} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Ảnh còn lại xếp grid 2 cột */}
          {remaining.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {remaining.map(i => (
                <div key={i} onClick={() => setIndex(i)} className="rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative group">
                  <img src={images[i]} alt={`Ảnh ${i+1}`} className="w-full h-auto object-cover block" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )
    }

    // Fallback: grid 2 cột đều
    return (
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, i) => (
          <div key={i} onClick={() => setIndex(i)} className="rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative group">
            <img src={img} alt={`Ảnh ${i+1}`} className="w-full h-auto object-cover block" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
              <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {/* Lightbox */}
      {index !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={close}>
          <button onClick={close} className="absolute top-4 right-4 text-white/70 hover:text-white w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-2xl z-10">✕</button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">{index + 1} / {images.length}</div>
          {images.length > 1 && (
            <button onClick={e => { e.stopPropagation(); prev() }} className="absolute left-4 text-white w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-4xl z-10">‹</button>
          )}
          <div className="max-w-4xl max-h-[85vh] px-16" onClick={e => e.stopPropagation()}>
            <img src={images[index]} alt={`Ảnh ${index + 1}`} className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
          </div>
          {images.length > 1 && (
            <button onClick={e => { e.stopPropagation(); next() }} className="absolute right-4 text-white w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-4xl z-10">›</button>
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

      {renderGrid()}
      <p className="text-xs text-gray-400 text-center mt-3">Click vào ảnh để phóng to</p>
    </>
  )
}