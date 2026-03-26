import { Trash2, Minus, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { getProductById } from '../../api/productApi'
import { formatPrice } from '../../utils/formatPrice'

export default function CartItem({ item }) {
  const { handleRemoveFromCart, handleAddToCart, refreshCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch product details for image/name/brand
  useEffect(() => {
    if (!item.productId) return
    getProductById(item.productId)
      .then(r => setProduct(r.data))
      .catch(() => {})
  }, [item.productId])

  const changeQty = async (delta) => {
    if (loading) return
    if (item.quantity + delta < 1) {
      await handleRemoveFromCart(item.productId, item.variantId)
      return
    }
    setLoading(true)
    try {
      // Use handleAddToCart from useCart hook — it calls refreshCart internally
      // which re-enriches items and updates the store correctly
      await handleAddToCart(item.productId, item.variantId, delta)
    } finally {
      setLoading(false)
    }
  }

  const image     = product?.primaryImage || '/placeholder-product.jpg'
  const name      = product?.name         || item.productId
  const brandName = product?.brandName    || ''
  const slug      = product?.slug         || null

  return (
    <div className="flex gap-3 py-4">
      {/* Image */}
      {slug ? (
        <Link to={`/product/${slug}`} className="flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-20 h-24 object-cover rounded-sm bg-surface"
            onError={e => { e.target.src = '/placeholder-product.jpg' }}
          />
        </Link>
      ) : (
        <img
          src={image}
          alt={name}
          className="w-20 h-24 object-cover rounded-sm bg-surface flex-shrink-0"
          onError={e => { e.target.src = '/placeholder-product.jpg' }}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {brandName && (
            <p className="text-sm font-bold text-dark truncate">{brandName}</p>
          )}
          <p className="text-xs text-muted truncate mt-0.5">{name}</p>
          <div className="flex gap-2 mt-1">
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
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-dark">
            {formatPrice((item.priceAtAddition || 0) * item.quantity)}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-sm">
              <button
                disabled={loading}
                onClick={() => changeQty(-1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-50"
              >
                <Minus size={11} />
              </button>
              <span className="w-6 text-center text-sm font-bold">
                {item.quantity}
              </span>
              <button
                disabled={loading}
                onClick={() => changeQty(1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-surface transition-colors disabled:opacity-50"
              >
                <Plus size={11} />
              </button>
            </div>
            <button
              onClick={() => handleRemoveFromCart(item.productId, item.variantId)}
              className="text-muted hover:text-red-500 transition-colors ml-1"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}