import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShieldCheck, RotateCcw, Truck, Star, Heart } from 'lucide-react'
import { getProductBySlug, filterProducts } from '../api/productApi'
import { getVariantsByProduct, getVariantById, getLowStockVariants } from '../api/variantApi'
import { getCategoriesForProduct } from '../api/mappingApi'
import ProductGallery from '../components/product/ProductGallery'
import SizeSelector from '../components/product/SizeSelector'
import ColorSelector from '../components/product/ColorSelector'
import ProductBreadcrumb from '../components/product/ProductBreadcrumb'
import Badge from '../components/common/Badge'
import { Skeleton } from '../components/common/Skeleton'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { formatPrice } from '../utils/formatPrice'
import clsx from 'clsx'

// ── Related Product Card ──────────────────────────────────────────────────────
function RelatedProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const wishlisted = isInWishlist(product.productId)
  const price = product.salePrice || product.basePrice
  const mrp = product.basePrice
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : product.discountPercentage || 0

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative flex flex-col bg-white rounded-sm overflow-hidden border border-transparent hover:border-border hover:shadow-md transition-all"
    >
      {/* Image */}
      <div className="relative bg-surface overflow-hidden" style={{ paddingBottom: '133%' }}>
        <img
          src={product.primaryImage || '/placeholder-product.jpg'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = '/placeholder-product.jpg' }}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            {discount}% OFF
          </span>
        )}
        {/* Wishlist button */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.productId) }}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart
            size={14}
            className={wishlisted ? 'fill-primary text-primary' : 'text-muted'}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1">
        <p className="text-xs font-black text-dark truncate">{product.brandName}</p>
        <p className="text-xs text-muted truncate">{product.name}</p>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm font-bold text-dark">{formatPrice(price)}</span>
          {mrp > price && (
            <span className="text-[11px] text-muted line-through">{formatPrice(mrp)}</span>
          )}
        </div>
        {product.ratingAverage > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="flex items-center gap-0.5 bg-[#14958F] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
              <Star size={8} fill="white" /> {product.ratingAverage.toFixed(1)}
            </span>
            <span className="text-[10px] text-muted">{(product.ratingCount || 0).toLocaleString()}</span>
          </div>
        )}
      </div>
    </Link>
  )
}

// ── Related Products Skeleton ─────────────────────────────────────────────────
function RelatedProductSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-sm overflow-hidden border border-border animate-pulse">
      <div className="bg-surface" style={{ paddingBottom: '133%' }} />
      <div className="p-2.5 flex flex-col gap-2">
        <div className="h-3 bg-surface rounded w-2/3" />
        <div className="h-3 bg-surface rounded w-full" />
        <div className="h-4 bg-surface rounded w-1/3" />
      </div>
    </div>
  )
}

// ── Main PDP Page ─────────────────────────────────────────────────────────────
export default function PDPPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [variants, setVariants] = useState([])
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [lowStockIds, setLowStockIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  // Related products state
  const [relatedProducts, setRelatedProducts] = useState([])
  const [relatedLoading, setRelatedLoading] = useState(false)

  const { handleAddToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  useEffect(() => {
    setLoading(true)
    setRelatedProducts([])
    getProductBySlug(slug)
      .then(async (r) => {
        const p = r.data
        setProduct(p)
        setSelectedColor(p.availableColors?.[0] || null)

        const [varRes, lowRes] = await Promise.allSettled([
          getVariantsByProduct(p.productId),
          getLowStockVariants(5),
        ])

        if (varRes.status === 'fulfilled') {
          const vList = varRes.value.data || []
          setVariants(vList)
          if (vList.length) {
            setSelectedVariant(vList[0])
            setSelectedSize(vList[0].size)
          }
        }
        if (lowRes.status === 'fulfilled') {
          setLowStockIds(new Set((lowRes.value.data || []).map(v => v.variantId)))
        }

        // Fetch related products via category
        setRelatedLoading(true)
        getCategoriesForProduct(p.productId)
          .then(async (catRes) => {
            console.log('[Related] getCategoriesForProduct raw:', catRes.data)
            // API returns a plain string categoryId
            const categoryId = typeof catRes.data === 'string'
              ? catRes.data
              : catRes.data?.categoryId || catRes.data?.[0]?.categoryId || catRes.data?.[0]
            console.log('[Related] resolved categoryId:', categoryId)
            if (!categoryId) return
            const prodRes = await filterProducts({ categoryId })
            console.log('[Related] filterProducts raw:', prodRes.data)
            const others = (prodRes.data?.content || prodRes.data || [])
              .filter(rp => rp.productId !== p.productId)
              .slice(0, 8)
            console.log('[Related] final list:', others)
            setRelatedProducts(others)
          })
          .catch((err) => console.error('[Related] error:', err))
          .finally(() => setRelatedLoading(false))
      })
      .finally(() => setLoading(false))
  }, [slug])

  // Update selected variant when size/color changes
  useEffect(() => {
    if (!product || !variants.length) return
    const match = variants.find(v =>
      (!selectedSize || v.size === selectedSize) &&
      (!selectedColor || v.color === selectedColor)
    )
    if (match && match.variantId !== selectedVariant?.variantId) {
      getVariantById(product.productId, match.variantId)
        .then(r => setSelectedVariant(r.data))
        .catch(() => setSelectedVariant(match))
    }
  }, [selectedSize, selectedColor, product, variants])

  if (loading) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-10">
        <Skeleton className="aspect-[3/4]" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-24" />
          <Skeleton className="h-12" />
          <Skeleton className="h-12" />
        </div>
      </div>
    )
  }

  if (!product) return <div className="text-center py-24 text-muted">Product not found.</div>

  const price = selectedVariant?.price || product.salePrice || product.basePrice
  const mrp = selectedVariant?.mrp || product.basePrice
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : product.discountPercentage || 0
  const stock = selectedVariant?.availableStock
  const isLow = selectedVariant && lowStockIds.has(selectedVariant.variantId)
  const isOos = stock === 0
  const wishlisted = isInWishlist(product.productId)
  const oosSize = variants.filter(v => v.availableStock === 0).map(v => v.size)

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-4">
      <ProductBreadcrumb productId={product.productId} productName={product.name} />
      <div className="grid md:grid-cols-2 gap-10 mt-3">
        <ProductGallery images={product.images || []} primaryImage={product.primaryImage} />

        <div className="flex flex-col gap-4 py-2">
          <div>
            <h1 className="text-xl font-black text-dark">{product.brandName}</h1>
            <p className="text-base text-muted mt-0.5">{product.name}</p>
          </div>

          {product.ratingAverage > 0 && (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 bg-[#14958F] text-white text-xs px-2 py-0.5 rounded font-bold">
                <Star size={10} fill="white" /> {product.ratingAverage.toFixed(1)}
              </span>
              <span className="text-xs text-muted">{(product.ratingCount || 0).toLocaleString()} ratings</span>
            </div>
          )}

          <hr className="border-surface" />

          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-black text-dark">{formatPrice(price)}</span>
              {mrp > price && <span className="text-sm text-muted line-through">{formatPrice(mrp)}</span>}
              {discount > 0 && <span className="text-base font-bold text-primary">({discount}% OFF)</span>}
            </div>
            <p className="text-xs text-muted mt-0.5">inclusive of all taxes</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isLow && <Badge variant="low-stock">Only {stock} left!</Badge>}
            {isOos && <Badge variant="out-of-stock">Out of Stock</Badge>}
            {/*{selectedVariant?.sku && <span className="text-xs text-muted">SKU: {selectedVariant.sku}</span>}*/}
          </div>

          {product.availableColors?.length > 0 && (
            <ColorSelector colors={product.availableColors} selected={selectedColor} onChange={setSelectedColor} />
          )}

          {product.availableSizes?.length > 0 && (
            <SizeSelector sizes={product.availableSizes} selected={selectedSize} onChange={setSelectedSize} outOfStockSizes={oosSize} />
          )}

          <div className="flex gap-3 mt-2">
            <button
              disabled={isOos}
              onClick={() => handleAddToCart(product.productId, selectedVariant?.variantId)}
              className={clsx(
                'flex-1 py-4 font-bold text-sm transition-colors flex items-center justify-center gap-2',
                isOos ? 'bg-border text-muted cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'
              )}
            >
              {isOos ? 'OUT OF STOCK' : '🛍 ADD TO BAG'}
            </button>
            <button
              onClick={() => toggleWishlist(product.productId, selectedVariant?.variantId)}
              className={clsx(
                'flex-1 py-4 font-bold text-sm border transition-colors flex items-center justify-center gap-2',
                wishlisted ? 'border-primary text-primary bg-pink-50' : 'border-dark text-dark hover:bg-surface'
              )}
            >
              <Heart size={15} className={wishlisted ? 'fill-primary text-primary' : ''} />
              {wishlisted ? 'WISHLISTED' : 'WISHLIST'}
            </button>
          </div>

          {/* Trust badges */}
          <div className="border border-border rounded-sm p-4 grid grid-cols-3 gap-4 mt-2">
            {[
              { icon: Truck, title: 'Free Delivery', sub: 'On orders above ₹499' },
              { icon: RotateCcw, title: '30 Day Return', sub: 'Easy hassle-free returns' },
              { icon: ShieldCheck, title: '100% Authentic', sub: 'From trusted brands' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center text-center gap-1">
                <Icon size={18} className="text-dark" />
                <p className="text-xs font-bold">{title}</p>
                <p className="text-[10px] text-muted">{sub}</p>
              </div>
            ))}
          </div>

          {/* Product Details */}
          {(product.material || product.fitType || product.gender || product.description) && (
            <div className="border-t border-surface pt-4">
              <h3 className="font-bold text-sm uppercase tracking-wide mb-3">Product Details</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                {product.material && <><span className="text-muted">Material</span><span>{product.material}</span></>}
                {product.fitType && <><span className="text-muted">Fit</span><span>{product.fitType}</span></>}
                {product.gender && <><span className="text-muted">Ideal For</span><span className="capitalize">{product.gender.toLowerCase()}</span></>}
                {selectedVariant?.weight && <><span className="text-muted">Weight</span><span>{selectedVariant.weight}</span></>}
              </div>
              {product.description && <p className="text-sm text-muted leading-relaxed">{product.description}</p>}
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ───────────────────────────────────────────────── */}
      {(relatedLoading || relatedProducts.length > 0) && (
        <section className="mt-14 border-t border-surface pt-10">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-lg font-black text-dark uppercase tracking-wide">
              More From This Products
            </h2>
            {/*{!relatedLoading && relatedProducts.length > 0 && (
              <Link
                to={`/category/${relatedProducts[0]?.slug || ''}`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                View All →
              </Link>
            )}*/}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedLoading
              ? Array.from({ length: 8 }).map((_, i) => <RelatedProductSkeleton key={i} />)
              : relatedProducts.map(rp => (
                  <RelatedProductCard key={rp.productId} product={rp} />
                ))
            }
          </div>
        </section>
      )}
    </div>
  )
}
