import toast from 'react-hot-toast'
import { useCartStore } from '../store/cartStore'
import { addToCart, removeFromCart, getCart } from '../api/cartApi'

export const useCart = () => {
  const { cart, setCart, openCart } = useCartStore()

  const handleAddToCart = async (productId, variantId, quantity = 1) => {
    try {
      const res = await addToCart({ productId, variantId, quantity })
      setCart(res.data)
      openCart()
      toast.success('Added to bag!')
    } catch (e) {
      toast.error(e.message || 'Failed to add to bag')
    }
  }

  const handleRemoveFromCart = async (productId, variantId) => {
    try {
      await removeFromCart(productId, variantId)
      const res = await getCart()
      setCart(res.data)
      toast.success('Removed from bag')
    } catch (e) {
      toast.error(e.message || 'Failed to remove')
    }
  }

  const refreshCart = async () => {
    try {
      const res = await getCart()
      setCart(res.data)
    } catch (_) {}
  }

  return { cart, handleAddToCart, handleRemoveFromCart, refreshCart }
}