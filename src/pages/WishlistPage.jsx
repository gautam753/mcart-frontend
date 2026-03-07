import { useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWishlist } from '../hooks/useWishlist'
import { useWishlistStore } from '../store/wishlistStore'
import WishlistCard from '../components/wishlist/WishlistCard'

export default function WishlistPage() {
  const { refreshWishlist } = useWishlist()
  const { items } = useWishlistStore()

  useEffect(() => { refreshWishlist() }, [])

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-dark uppercase tracking-wide mb-6">
        My Wishlist <span className="text-muted font-normal text-base">({items.length} items)</span>
      </h1>
      {!items.length ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <Heart size={80} className="text-border mb-6" strokeWidth={1} />
          <h2 className="text-xl font-bold text-dark">Your wishlist is empty!</h2>
          <p className="text-muted mt-2 mb-8 text-sm">Save items that you like here. Review them anytime.</p>
          <Link to="/" className="bg-primary text-white px-10 py-4 font-bold text-sm hover:bg-primary-dark transition-colors">
            EXPLORE NOW
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map(item => <WishlistCard key={item.productId} item={item} />)}
        </div>
      )}
    </div>
  )
}