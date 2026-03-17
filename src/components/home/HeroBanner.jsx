import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const BANNERS = [
  { id: 1, image: '/images/banners/banner1.jpg', title: 'New Arrivals', subtitle: 'Explore latest trends', cta: 'Shop Now', link: '/category/new-arrivals', bg: '#FFF0F3' },
  { id: 2, image: '/images/banners/banner2.jpg', title: 'End of Season Sale', subtitle: 'Up to 50% off', cta: 'Shop Sale', link: '/category/sale-clearance', bg: '#EEF2FF' },
  { id: 3, image: '/images/banners/banner3.jpg', title: 'Top Brands', subtitle: 'All your favourites in one place', cta: 'Explore', link: '/category/best-sellers', bg: '#FFF7ED' },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const go = useCallback((idx) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent(idx)
    setTimeout(() => setIsAnimating(false), 400)
  }, [isAnimating])

  useEffect(() => {
    const t = setInterval(() => go((current + 1) % BANNERS.length), 4500)
    return () => clearInterval(t)
  }, [current, go])

  const banner = BANNERS[current]

  return (
    <div className="relative w-full overflow-hidden select-none" style={{ backgroundColor: banner.bg }}>
      <div className="relative w-full" style={{ paddingBottom: '28%' }}>
        <img
          key={banner.id}
          src={banner.image}
          alt={banner.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-400"
          style={{ opacity: isAnimating ? 1 : 1 }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
        {/* Fallback text overlay when image is missing 
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-4xl md:text-6xl font-black text-dark opacity-5">{banner.title}</h2>
        </div>*/}
        {/* CTA overlay */}
        <div className="absolute bottom-8 right-10 hidden md:block">
          <Link
            to={banner.link}
            className="bg-dark text-white px-8 py-3 text-sm font-bold hover:bg-primary transition-colors inline-block"
          >
            {banner.cta}
          </Link>
        </div>
      </div>

      {/* Prev/Next */}
      <button
        onClick={() => go((current - 1 + BANNERS.length) % BANNERS.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => go((current + 1) % BANNERS.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-1.5 bg-dark' : 'w-1.5 h-1.5 bg-dark/30'}`}
          />
        ))}
      </div>
    </div>
  )
}