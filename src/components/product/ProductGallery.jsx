import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'

export default function ProductGallery({ images = [], primaryImage }) {
  const all = primaryImage
    ? [primaryImage, ...images.filter(i => i !== primaryImage)]
    : images.length ? images : ['/placeholder-product.jpg']

  const [selected, setSelected] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  // Keyboard navigation when lightbox is open
  const handleKeyDown = useCallback((e) => {
    if (!lightbox) return
    if (e.key === 'ArrowRight') setSelected(i => (i + 1) % all.length)
    if (e.key === 'ArrowLeft')  setSelected(i => (i - 1 + all.length) % all.length)
    if (e.key === 'Escape')     setLightbox(false)
  }, [lightbox, all.length])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  return (
    <>
      <div className="flex gap-3 sticky top-20">
        {/* Thumbnails */}
        <div className="flex flex-col gap-2 w-14 flex-shrink-0">
          {all.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`border-2 rounded overflow-hidden transition-all ${selected === i ? 'border-dark' : 'border-transparent hover:border-border'}`}
              style={{ paddingBottom: '133%', position: 'relative' }}
            >
              <img
                src={img}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => { e.target.src = '/placeholder-product.jpg' }}
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div
          className="flex-1 relative group bg-surface overflow-hidden rounded-sm cursor-zoom-in"
          style={{ paddingBottom: '120%' }}
          onClick={() => setLightbox(true)}
        >
          <img
            src={all[selected]}
            alt="Product"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.target.src = '/placeholder-product.jpg' }}
          />

          {/* Zoom hint button */}
          <button
            className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={(e) => { e.stopPropagation(); setLightbox(true) }}
          >
            <ZoomIn size={14} />
          </button>

          {/* Prev / Next */}
          {all.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setSelected(i => (i - 1 + all.length) % all.length) }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setSelected(i => (i + 1) % all.length) }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {all.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelected(i) }}
                className={`rounded-full transition-all ${i === selected ? 'w-4 h-1.5 bg-dark' : 'w-1.5 h-1.5 bg-dark/30'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors z-10"
            onClick={() => setLightbox(false)}
          >
            <X size={22} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {selected + 1} / {all.length}
          </div>

          {/* Prev */}
          {all.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); setSelected(i => (i - 1 + all.length) % all.length) }}
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Main zoomed image */}
          <div
            className="max-w-3xl max-h-[88vh] mx-16 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={all[selected]}
              alt="Product zoomed"
              className="max-w-full max-h-[88vh] object-contain rounded shadow-2xl"
              onError={(e) => { e.target.src = '/placeholder-product.jpg' }}
            />
          </div>

          {/* Next */}
          {all.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors z-10"
              onClick={(e) => { e.stopPropagation(); setSelected(i => (i + 1) % all.length) }}
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Thumbnail strip */}
          {all.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {all.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-12 h-14 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${i === selected ? 'border-white' : 'border-white/20 hover:border-white/50'}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/placeholder-product.jpg' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
