import { Trash2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../../utils/formatPrice'
import { useCart } from '../../hooks/useCart'
import { removeFromWishlist } from '../../api/wishlistApi'
import { useWishlistStore } from '../../store/wishlistStore'
import toast from 'react-hot-toast'

export default function WishlistCard({ item }) {
  const { handleAddToCart } = useCart()
  const { removeItem } = useWishlistStore()

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

  const priorityColors = { HIGH: 'bg-primary', MEDIUM: 'bg-orange-500', LOW: 'bg-muted' }

  return (
    <div className="group flex flex-col">
      <div className="relative overflow-hidden bg-surface rounded-sm" style={{ paddingBottom: '133%' }}>
        <Link to={item.slug ? `/product/${item.slug}` : '#'}>
          <img
            src={item.primaryImage || '/placeholder-product.jpg'}
            alt={item.name || 'Product'}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.target.src = '/placeholder-product.jpg' }}
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
        <p className="text-sm font-bold text-dark truncate">{item.brandName || 'Brand'}</p>
        <p className="text-xs text-muted line-clamp-1">{item.name || item.productId}</p>
        {item.notes && <p className="text-xs text-muted italic">"{item.notes}"</p>}
        {item.price && <p className="text-sm font-bold text-dark">{formatPrice(item.price)}</p>}
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