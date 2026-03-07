import ProductCard from './ProductCard'
import { ProductGridSkeleton } from '../common/Skeleton'

export default function ProductGrid({ products = [], isLoading, cols = 4 }) {
  if (isLoading) return <ProductGridSkeleton count={cols * 2} />

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <img src="/placeholder-product.jpg" alt="" className="w-28 h-28 opacity-20 mb-4 rounded" />
        <p className="text-base font-bold text-dark">No products found</p>
        <p className="text-sm text-muted mt-1">Try removing some filters</p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 ${cols >= 4 ? 'md:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-' + cols} gap-3`}>
      {products.map((p) => <ProductCard key={p.productId} product={p} />)}
    </div>
  )
}