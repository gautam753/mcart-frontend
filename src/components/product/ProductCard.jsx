import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import clsx from 'clsx'
import { useWishlist } from '../../hooks/useWishlist'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatPrice'
import Badge from '../common/Badge'

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { handleAddToCart } = useCart()
  const wishlisted = isInWishlist(product.productId)

  return (
    <div className="group relative flex flex-col cursor-pointer">
      <Link to={`/product/${product.slug}`} className="relative overflow-hidden bg-surface block"
        style={{ paddingBottom: '133%' }}>
        <img
          src={product.primaryImage || '/placeholder-product.jpg'}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { e.target.src = '/placeholder-product.jpg' }}
        />
        {/* Wishlist */}
        <button
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.productId) }}
        >
          <Heart size={14} className={clsx(wishlisted ? 'fill-primary text-primary' : 'text-muted')} />
        </button>
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discountPercentage > 0 && <Badge variant="discount">{product.discountPercentage}% OFF</Badge>}
          {product.availableStock > 0 && product.availableStock <= 5 && <Badge variant="low-stock">Only {product.availableStock} left</Badge>}
          {product.availableStock === 0 && <Badge variant="out-of-stock">Sold Out</Badge>}
        </div>
        {/* Quick Add */}
        {product.availableStock !== 0 && (
          <button
            className="absolute bottom-0 left-0 right-0 bg-dark/90 text-white text-xs font-bold py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
            onClick={(e) => { e.preventDefault(); handleAddToCart(product.productId, null) }}
          >
            ADD TO BAG
          </button>
        )}
      </Link>

      <Link to={`/product/${product.slug}`} className="mt-2 flex flex-col gap-0.5">
        <p className="text-sm font-bold text-dark truncate">{product.brandName}</p>
        <p className="text-xs text-muted line-clamp-1">{product.name}</p>
        <div className="flex items-baseline gap-1.5 mt-0.5 flex-wrap">
          <span className="text-sm font-bold text-dark">
            {formatPrice(product.salePrice || product.basePrice)}
          </span>
          {product.salePrice && product.basePrice > product.salePrice && (
            <span className="text-xs text-muted line-through">{formatPrice(product.basePrice)}</span>
          )}
          {product.discountPercentage > 0 && (
            <span className="text-xs font-bold text-[#14958F]">({product.discountPercentage}% off)</span>
          )}
        </div>
        {product.ratingAverage > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className="bg-[#14958F] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
              ★ {product.ratingAverage.toFixed(1)}
            </span>
            <span className="text-[10px] text-muted">({(product.ratingCount || 0).toLocaleString()})</span>
          </div>
        )}
      </Link>
    </div>
  )
}