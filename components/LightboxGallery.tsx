'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

export default function LightboxGallery({ images }: { images: string[] }) {
  const [index, setIndex] = useState<number | null>(null)
  const [orientations, setOrientations] = useState<boolean[]>([])
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const touchMoved = useRef(false)

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

  // Swipe trong lightbox
  const lbTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchMoved.current = false
  }
  const lbTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    if (Math.abs(e.touches[0].clientX - touchStartX.current) > 10) touchMoved.current = true
  }
  const lbTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? next() : prev()
    } else if (!touchMoved.current) {
      close()
    }
    touchStartX.current = null
  }

  // Touch trên thumbnail để mở lightbox
  const thumbTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchMoved.current = false
  }
  const thumbTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    if (Math.abs(e.touches[0].clientX - touchStartX.current) > 10) touchMoved.current = true
  }
  const thumbTouchEnd = (i: number) => (e: React.TouchEvent) => {
    e.preventDefault()
    if (!touchMoved.current) setIndex(i)
    touchStartX.current = null
  }

  const firstPortrait = orientations.length > 0 ? orientations.findIndex(o => o === true) : -1
  const hasPortrait = firstPortrait !== -1
  const others = images.map((_, i) => i).filter(i => i !== firstPortrait)

  const imgCard = (src: string, i: number, extraClass = '', style?: React.CSSProperties) => (
    <div key={i}
      onClick={() => setIndex(i)}
      onTouchStart={thumbTouchStart}
      onTouchMove={thumbTouchMove}
      onTouchEnd={thumbTouchEnd(i)}
      className={`rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative group ${extraClass}`}
      style={style}>
      <img src={src} alt={`Ảnh ${i + 1}`} className="w-full h-full object-cover block pointer-events-none" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center pointer-events-none">
        <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
      </div>
    </div>
  )

  const renderGrid = () => {
    if (images.length === 1) return (
      <div className="flex justify-center">
        <div
          onClick={() => setIndex(0)}
          onTouchStart={thumbTouchStart}
          onTouchMove={thumbTouchMove}
          onTouchEnd={thumbTouchEnd(0)}
          className="rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all relative group max-w-lg w-full">
          <img src={images[0]} alt="Ảnh 1" className="w-full h-auto block pointer-events-none" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center pointer-events-none">
            <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity">🔍</span>
          </div>
        </div>
      </div>
    )
    if (images.length === 2) return (
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, i) => imgCard(img, i, '', { minHeight: '160px', maxHeight: '320px' }))}
      </div>
    )
    if (images.length >= 3 && hasPortrait && orientations.length === images.length) {
      const rightImages = others.slice(0, 2)
      const remaining = others.slice(2)
      return (
        <>
          <div className="flex gap-3 mb-3">
            {imgCard(images[firstPortrait], firstPortrait, 'flex-1', { minHeight: '280px' })}
            <div className="flex-1 flex flex-col gap-3">
              {rightImages.map(i => imgCard(images[i], i, 'flex-1', { minHeight: '130px' }))}
            </div>
          </div>
          {remaining.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {remaining.map(i => imgCard(images[i], i))}
            </div>
          )}
        </>
      )
    }
    return (
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, i) => imgCard(img, i))}
      </div>
    )
  }

  return (
    <>
      {index !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onTouchStart={lbTouchStart}
          onTouchMove={lbTouchMove}
          onTouchEnd={lbTouchEnd}
          onClick={close}>

          <button onClick={e => { e.stopPropagation(); close() }}
            className="absolute top-4 right-4 text-white w-12 h-12 flex items-center justify-center rounded-full bg-white/10 active:bg-white/30 text-2xl z-10">
            ✕
          </button>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/40 px-3 py-1 rounded-full pointer-events-none">
            {index + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-2 text-white w-14 h-14 flex items-center justify-center rounded-full bg-white/10 active:bg-white/30 text-4xl z-10">
              ‹
            </button>
          )}

          <div className="max-w-4xl max-h-[85vh] px-16" onClick={e => e.stopPropagation()}>
            <img
              src={images[index]}
              alt={`Ảnh ${index + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl pointer-events-none" />
          </div>

          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-2 text-white w-14 h-14 flex items-center justify-center rounded-full bg-white/10 active:bg-white/30 text-4xl z-10">
              ›
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none">
              {images.map((_, i) => (
                <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${i === index ? 'bg-white scale-125' : 'bg-white/40'}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {renderGrid()}
      <p className="text-xs text-gray-400 text-center mt-3">Nhấn vào ảnh để phóng to</p>
    </>
  )
}