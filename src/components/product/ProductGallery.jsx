import { useState } from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

export default function ProductGallery({ images = [], primaryImage }) {
  const all = primaryImage
    ? [primaryImage, ...images.filter(i => i !== primaryImage)]
    : images.length ? images : ['/placeholder-product.jpg']

  const [selected, setSelected] = useState(0)

  return (
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

      {/* Main */}
      <div className="flex-1 relative group bg-surface overflow-hidden rounded-sm" style={{ paddingBottom: '120%' }}>
        <img
          src={all[selected]}
          alt="Product"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.target.src = '/placeholder-product.jpg' }}
        />
        <button className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={14} />
        </button>
        {all.length > 1 && (
          <>
            <button
              onClick={() => setSelected(i => (i - 1 + all.length) % all.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setSelected(i => (i + 1) % all.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
          {all.map((_, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className={`rounded-full transition-all ${i === selected ? 'w-4 h-1.5 bg-dark' : 'w-1.5 h-1.5 bg-dark/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}