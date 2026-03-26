import { useState, useEffect } from 'react'
import { getProductById } from '../../api/productApi'
import { formatPrice } from '../../utils/formatPrice'
import { Skeleton } from '../common/Skeleton'

export default function CheckoutOrderItem({ item }) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!item.productId) return
    getProductById(item.productId)
      .then(r => setProduct(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [item.productId])

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-3">
        <Skeleton className="w-14 h-16 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-4 w-16 flex-shrink-0" />
      </div>
    )
  }

  const image     = product?.primaryImage || '/placeholder-product.jpg'
  const name      = product?.name         || item.productId
  const brandName = product?.brandName    || null
  const slug      = product?.slug         || null

  return (
    <div className="flex items-center gap-3 py-3">
      <img
        src={image}
        alt={name}
        className="w-14 h-16 object-cover bg-surface rounded-sm flex-shrink-0"
        onError={e => { e.target.src = '/placeholder-product.jpg' }}
      />
      <div className="flex-1 min-w-0">
        {brandName && (
          <p className="text-sm font-bold text-dark truncate">{brandName}</p>
        )}
        <p className="text-xs text-muted truncate">{name}</p>
        <div className="flex gap-2 mt-0.5">
          {item.size && (
            <span className="text-[10px] bg-surface px-1.5 py-0.5 rounded text-muted">
              Size: {item.size}
            </span>
          )}
          {item.color && (
            <span className="text-[10px] bg-surface px-1.5 py-0.5 rounded text-muted">
              {item.color}
            </span>
          )}
        </div>
        <p className="text-xs text-muted mt-0.5">Qty: {item.quantity}</p>
      </div>
      <span className="text-sm font-bold text-dark flex-shrink-0">
        {formatPrice((item.priceAtAddition || 0) * item.quantity)}
      </span>
    </div>
  )
}