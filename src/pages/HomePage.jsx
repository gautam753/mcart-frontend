import { useEffect, useState } from 'react'
import HeroBanner from '../components/home/HeroBanner'
import CategoryCards from '../components/home/CategoryCards'
import ProductCarousel from '../components/home/ProductCarousel'
import { getAllProducts, filterProducts, getProductsByBrand } from '../api/productApi'

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState([])
  const [trending, setTrending] = useState([])
  const [onSale, setOnSale] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.allSettled([
      getAllProducts(),
      filterProducts({ onSale: true, page: 0, size: 12 }),
    ]).then(([allRes, saleRes]) => {
      if (allRes.status === 'fulfilled') {
        const all = allRes.value.data || []
        setNewArrivals(all.slice(0, 14))
        const sorted = [...all].sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0))
        setTrending(sorted.slice(0, 14))
      }
      if (saleRes.status === 'fulfilled') setOnSale(saleRes.value.data || [])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="pb-8">
      <HeroBanner />
      <CategoryCards />
      <div className="h-px bg-surface" />
      <ProductCarousel title="New Arrivals" products={newArrivals} viewAllLink="/category/new-arrivals" loading={loading} />
      <div className="h-2 bg-surface my-2" />
      <ProductCarousel title="Trending Now" products={trending} viewAllLink="/category/trending-now" loading={loading} />
      {onSale.length > 0 && (
        <>
          <div className="max-w-screen-xl mx-auto px-4 my-6">
            <div className="relative overflow-hidden rounded-sm bg-gradient-to-r from-primary via-pink-500 to-primary-dark text-white text-center py-8 px-4">
              <p className="text-3xl font-black tracking-tight">🔥 END OF SEASON SALE</p>
              <p className="text-sm mt-2 opacity-90">Upto 50% off — Limited time only</p>
            </div>
          </div>
          <ProductCarousel title="Best Deals" products={onSale} viewAllLink="/category/sale-clearance" />
          <ProductCarousel title="Under ₹499" products={onSale} viewAllLink="/category/under-499" />
          <ProductCarousel title="Best Sellers" products={onSale} viewAllLink="/category/best-sellers" />
        </>
      )}
    </div>
  )
}