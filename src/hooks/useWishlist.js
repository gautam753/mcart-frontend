import toast from 'react-hot-toast'
import { signInWithRedirect } from 'aws-amplify/auth'
import { useWishlistStore } from '../store/wishlistStore'
import { useAuthStore } from '../store/authStore'
import { addToWishlist, removeFromWishlist, getWishlist } from '../api/wishlistApi'

export const useWishlist = () => {
  const { items, addItem, removeItem, setItems, isInWishlist } = useWishlistStore()
  const { isAuthenticated } = useAuthStore()

  const toggleWishlist = async (productId, variantId) => {
    if (!isAuthenticated) {
      toast.error('Please login to save items to wishlist')
      signInWithRedirect()
      return
    }
    if (isInWishlist(productId)) {
      try {
        await removeFromWishlist(productId, variantId)
        removeItem(productId)
        toast.success('Removed from wishlist')
      } catch (e) {
        toast.error(e.message)
      }
    } else {
      try {
        await addToWishlist({ productId, variantId })
        addItem({ productId, variantId })
        toast.success('Saved to wishlist!')
      } catch (e) {
        toast.error(e.message)
      }
    }
  }

  const refreshWishlist = async () => {
    if (!isAuthenticated) return
    try {
      const res = await getWishlist()
      setItems(res.data || [])
    } catch (_) {}
  }

  return { items, isInWishlist, toggleWishlist, refreshWishlist }
}