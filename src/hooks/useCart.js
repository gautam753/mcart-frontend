import toast from 'react-hot-toast'
import { useCartStore } from '../store/cartStore'
import { addToCart, removeFromCart, getCart } from '../api/cartApi'
import { getProductById } from '../api/productApi'

// Enrich cart items with product details
export const enrichItems = async (items = []) => {
  const results = await Promise.allSettled(
    items.map(async (item) => {
      try {
        const res = await getProductById(item.productId)
        const p = res.data
        return {
          ...item,
          image:     p?.primaryImage || null,
          name:      p?.name         || item.productId,
          brandName: p?.brandName    || null,
          slug:      p?.slug         || null,
          mrp:       p?.basePrice    || item.priceAtAddition,
        }
      } catch (_) {
        return { ...item, name: item.productId }
      }
    })
  )
  return results.map(r => r.status === 'fulfilled' ? r.value : r.reason)
}

export const useCart = () => {
  const { cart, setCart, openCart } = useCartStore()

  const refreshCart = async () => {
    try {
      const res = await getCart()
      // Re-enrich on every refresh so images are always present
      const enriched = await enrichItems(res.data?.items || [])
      setCart({ ...res.data, items: enriched })
    } catch (_) {}
  }

  const handleAddToCart = async (productId, variantId, quantity = 1) => {
    try {
      await addToCart({ productId, variantId, quantity })
      // Always refresh after add — gets updated quantities AND re-enriches images
      await refreshCart()
      // Only open drawer when adding new item (quantity=1), not on +/- changes
      if (quantity === 1) openCart()
      if (quantity > 0) toast.success('Added to bag!')
    } catch (e) {
      toast.error(e.message || 'Failed to add to bag')
    }
  }

  const handleRemoveFromCart = async (productId, variantId) => {
    try {
      await removeFromCart(productId, variantId)
      await refreshCart()
      toast.success('Removed from bag')
    } catch (e) {
      toast.error(e.message || 'Failed to remove')
    }
  }

  return { cart, handleAddToCart, handleRemoveFromCart, refreshCart }
}