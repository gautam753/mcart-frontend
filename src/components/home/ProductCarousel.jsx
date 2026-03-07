import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductCard from '../product/ProductCard'
import { ProductCardSkeleton } from '../common/Skeleton'

export default function ProductCarousel({ title, products = [], viewAllLink, loading = false }) {
  const ref = useRef(null)
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 640, behavior: 'smooth' })

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-dark uppercase tracking-wide">{title}</h2>
        <div className="flex items-center gap-2">
          {viewAllLink && (
            <Link
              to={viewAllLink}
              className="text-xs font-bold text-primary border border-primary px-4 py-1.5 hover:bg-primary hover:text-white transition-colors mr-2"
            >
              VIEW ALL
            </Link>
          )}
          <button onClick={() => scroll(-1)} className="p-1.5 border border-border hover:border-dark transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => scroll(1)} className="p-1.5 border border-border hover:border-dark transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div ref={ref} className="flex gap-3 overflow-x-auto no-scrollbar">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-44"><ProductCardSkeleton /></div>
          ))
          : products.map((p) => (
            <div key={p.productId} className="flex-shrink-0 w-44">
              <ProductCard product={p} />
            </div>
          ))
        }
      </div>
    </section>
  )
}