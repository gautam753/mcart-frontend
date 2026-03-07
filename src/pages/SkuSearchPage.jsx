import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getVariantBySku } from '../api/variantApi'
import { getProductById } from '../api/productApi'
import { formatPrice } from '../utils/formatPrice'
import { useCart } from '../hooks/useCart'
import { Skeleton } from '../components/common/Skeleton'
import Badge from '../components/common/Badge'

export default function SkuSearchPage() {
  const { sku } = useParams()
  const [variant, setVariant] = useState(null)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { handleAddToCart } = useCart()

  useEffect(() => {
    setLoading(true)
    setError(null)
    getVariantBySku(sku)
      .then(async (r) => {
        setVariant(r.data)
        const pRes = await getProductById(r.data.productId)
        setProduct(pRes.data)
      })
      .catch(() => setError(`No variant found for SKU: ${sku}`))
      .finally(() => setLoading(false))
  }, [sku])

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <p className="text-xs text-muted uppercase tracking-wide mb-1">SKU Lookup</p>
      <h1 className="text-xl font-bold text-dark mb-6">
        <span className="font-normal">Searching for:</span> <span className="text-primary">{sku}</span>
      </h1>

      {loading && (
        <div className="flex gap-4 border border-border rounded-sm p-5">
          <Skeleton className="w-32 h-40" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-10 w-36 mt-4" />
          </div>
        </div>
      )}

      {error && (
        <div className="border border-red-200 bg-red-50 rounded-sm p-6 text-center">
          <p className="text-red-600 font-semibold">{error}</p>
          <Link to="/" className="mt-4 inline-block text-primary font-bold text-sm underline">Back to Shopping</Link>
        </div>
      )}

      {variant && product && (
        <div className="border border-border rounded-sm p-5 flex gap-5">
          <img
            src={product.primaryImage || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-32 h-40 object-cover rounded-sm bg-surface flex-shrink-0"
            onError={(e) => { e.target.src = '/placeholder-product.jpg' }}
          />
          <div className="flex-1">
            <p className="font-black text-dark text-lg">{product.brandName}</p>
            <p className="text-muted text-sm mt-0.5">{product.name}</p>

            <div className="mt-3 space-y-1.5">
              {variant.color && <p className="text-sm"><span className="text-muted w-16 inline-block">Color</span>{variant.color}</p>}
              {variant.size && <p className="text-sm"><span className="text-muted w-16 inline-block">Size</span>{variant.size}</p>}
              {variant.barcode && <p className="text-sm"><span className="text-muted w-16 inline-block">Barcode</span>{variant.barcode}</p>}
              <p className="text-sm flex items-center gap-2">
                <span className="text-muted w-16 inline-block">Stock</span>
                {variant.availableStock === 0
                  ? <Badge variant="out-of-stock">Out of Stock</Badge>
                  : variant.availableStock <= 5
                    ? <Badge variant="low-stock">Only {variant.availableStock} left</Badge>
                    : <span className="text-green-600 font-semibold text-xs">In Stock ({variant.availableStock})</span>
                }
              </p>
              <p className="text-sm"><span className="text-muted w-16 inline-block">Price</span>
                <strong className="text-dark">{formatPrice(variant.price)}</strong>
                {variant.mrp > variant.price && <span className="text-xs text-muted line-through ml-2">{formatPrice(variant.mrp)}</span>}
              </p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                disabled={variant.availableStock === 0}
                onClick={() => handleAddToCart(product.productId, variant.variantId)}
                className="bg-primary text-white px-6 py-2.5 text-sm font-bold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ADD TO BAG
              </button>
              <Link to={`/product/${product.slug}`}
                className="border border-dark text-dark px-6 py-2.5 text-sm font-bold hover:bg-surface transition-colors">
                VIEW PRODUCT
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}