'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

export default function LightboxGallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const [orientations, setOrientations] = useState<boolean[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const swipeStartX = useRef<number | null>(null)

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
  const prev = useCallback(() => setIndex(i => i === null ? null : (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex(i => i === null ? null : (i + 1) % images.length), [images.length])

  // Gắn native touch event vào container để tránh iOS passive event issue
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onTouchStart = (e: TouchEvent) => {
      swipeStartX.current = e.touches[0].clientX
    }
    const onTouchEnd = (e: TouchEvent) => {
      if (swipeStartX.current === null) return
      const dx = e.changedTouches[0].clientX - swipeStartX.current
      if (Math.abs(dx) > 50) dx < 0 ? next() : prev()
      swipeStartX.current = null
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [index, next, prev])

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

  useEffect(() => {
    document.body.style.overflow = index !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [index])

  const openImage = (i: number) => setIndex(i)

  const firstPortrait = orientations.length > 0 ? orientations.findIndex(o => o === true) : -1
  const hasPortrait = firstPortrait !== -1
  const others = images.map((_, i) => i).filter(i => i !== firstPortrait)

  const imgCard = (src: string, i: number, extraClass = '', style?: React.CSSProperties) => (
    <div key={i}
      onClick={() => openImage(i)}
      className={`rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative group ${extraClass}`}
      style={style}>
      <img src={src} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover block select-none" draggable={false} />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
        <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
      </div>
    </div>
  )

  const renderGrid = () => {
    if (images.length === 1) return (
      <div className="flex justify-center">
        <div onClick={() => openImage(0)}
          className="rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all relative group max-w-lg w-full">
          <img src={images[0]} alt="Ảnh 1" className="w-full h-auto block select-none" draggable={false} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
            <span className="text-white text-2xl opacity-0 group-hover:opacity-100">🔍</span>
          </div>
        </div>
      </div>
    )

    // Mobile: luôn dùng grid 2 cột
    // Desktop (md+): layout đặc biệt nếu có ảnh đứng
    if (images.length >= 3 && hasPortrait && orientations.length === images.length) {
      const rightImages = others.slice(0, 2)
      const remaining = others.slice(2)
      return (
        <>
          {/* Desktop layout */}
          <div className="hidden md:flex gap-3 mb-3">
            {imgCard(images[firstPortrait], firstPortrait, 'flex-1', { minHeight: '280px' })}
            <div className="flex-1 flex flex-col gap-3">
              {rightImages.map(i => imgCard(images[i], i, 'flex-1', { minHeight: '130px' }))}
            </div>
          </div>
          {/* Mobile layout: grid 2 cột */}
          <div className="grid grid-cols-2 gap-2 md:hidden">
            {images.map((img, i) => imgCard(img, i, '', { minHeight: '120px' }))}
          </div>
          {/* Ảnh thừa trên desktop */}
          {remaining.length > 0 && (
            <div className="hidden md:grid grid-cols-2 gap-3 mt-3">
              {remaining.map(i => imgCard(images[i], i))}
            </div>
          )}
        </>
      )
    }

    return (
      <div className="grid grid-cols-2 gap-2 md:gap-3">
        {images.map((img, i) => imgCard(img, i, '', { minHeight: '120px' }))}
      </div>
    )
  }

  return (
    <>
      {/* Lightbox overlay */}
      {index !== null && (
        <div ref={containerRef}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
          onClick={close}>

          <button onClick={e => { e.stopPropagation(); close() }}
            className="absolute top-4 right-4 text-white w-12 h-12 flex items-center justify-center rounded-full bg-white/20 active:bg-white/40 text-xl z-10 touch-manipulation">
            ✕
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-3 py-1 rounded-full select-none">
            {index + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-2 text-white w-14 h-14 flex items-center justify-center rounded-full bg-white/20 active:bg-white/40 text-4xl z-10 touch-manipulation">
              ‹
            </button>
          )}

          <div className="w-full max-w-4xl max-h-[85vh] px-16 flex items-center justify-center"
            onClick={e => e.stopPropagation()}>
            <img src={images[index]} alt={`Ảnh ${index + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl select-none"
              draggable={false} />
          </div>

          {images.length > 1 && (
            <button onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-2 text-white w-14 h-14 flex items-center justify-center rounded-full bg-white/20 active:bg-white/40 text-4xl z-10 touch-manipulation">
              ›
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 select-none">
              {images.map((_, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/40'}`} />
              ))}
            </div>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-white/40 text-xs md:hidden select-none">
              Vuốt trái / phải để chuyển ảnh
            </div>
          )}
        </div>
      )}

      {renderGrid()}
      <p className="text-xs text-gray-400 text-center mt-3">Nhấn vào ảnh để phóng to</p>
    </>
  )
}