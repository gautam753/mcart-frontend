import { useState, useEffect } from 'react'
import { Trash2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice'
import { useCart } from '../../hooks/useCart'
import { removeFromWishlist } from '../../api/wishlistApi'
import { useWishlistStore } from '../../store/wishlistStore'
import { getProductById } from '../../api/productApi'
import toast from 'react-hot-toast'

export default function WishlistCard({ item }) {
  const { handleAddToCart } = useCart()
  const { removeItem } = useWishlistStore()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    if (!item.productId) return
    getProductById(item.productId)
      .then(r => setProduct(r.data))
      .catch(() => {})
  }, [item.productId])

  const handleRemove = async () => {
    try {
      await removeFromWishlist(item.productId, item.variantId)
      removeItem(item.productId)
      toast.success('Removed from wishlist')
    } catch (e) { toast.error(e.message) }
  }

  const handleMoveToBag = async () => {
    await handleAddToCart(item.productId, item.variantId)
    handleRemove()
  }

  const image     = product?.primaryImage || '/placeholder-product.jpg'
  const name      = product?.name         || item.productId
  const brandName = product?.brandName    || ''
  const slug      = product?.slug         || null
  const price     = product?.salePrice    || product?.basePrice || null

  const priorityColors = {
    HIGH: 'bg-primary',
    MEDIUM: 'bg-orange-500',
    LOW: 'bg-muted',
  }

  return (
    <div className="group flex flex-col">
      <div
        className="relative overflow-hidden bg-surface rounded-sm"
        style={{ paddingBottom: '133%' }}
      >
        <Link to={slug ? `/product/${slug}` : '#'}>
          <img
            src={image}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.src = '/placeholder-product.jpg' }}
          />
        </Link>

        {item.priority && (
          <span className={`absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 text-white rounded ${priorityColors[item.priority] || 'bg-muted'}`}>
            {item.priority}
          </span>
        )}

        <button
          onClick={handleRemove}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={13} className="text-red-500" />
        </button>
      </div>

      <div className="mt-2 flex flex-col gap-0.5">
        {brandName && (
          <p className="text-sm font-bold text-dark truncate">{brandName}</p>
        )}
        <p className="text-xs text-muted line-clamp-1">{name}</p>
        {item.notes && (
          <p className="text-xs text-muted italic">"{item.notes}"</p>
        )}
        {price && (
          <p className="text-sm font-bold text-dark">{formatPrice(price)}</p>
        )}
      </div>

      <button
        onClick={handleMoveToBag}
        className="mt-2 w-full border border-dark text-dark text-xs font-bold py-2 hover:bg-dark hover:text-white transition-all flex items-center justify-center gap-1.5"
      >
        <ShoppingBag size={12} /> MOVE TO BAG
      </button>
    </div>
  )
}