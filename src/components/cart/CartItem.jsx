import { Trash2, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../hooks/useCart'
import { useCartStore } from '../../store/cartStore'
import { addToCart } from '../../api/cartApi'
import { formatPrice } from '../../utils/formatPrice'

export default function CartItem({ item }) {
  const { handleRemoveFromCart } = useCart()
  const { setCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  const changeQty = async (delta) => {
    if (loading) return
    if (item.quantity + delta < 1) {
      handleRemoveFromCart(item.productId, item.variantId)
      return
    }
    setLoading(true)
    try {
      const res = await addToCart({ productId: item.productId, variantId: item.variantId, quantity: delta })
      setCart(res.data)
    } catch (_) {}
    finally { setLoading(false) }
  }

  return (
    <div className="flex gap-3 py-4">
      <img
        src={item.image || '/placeholder-product.jpg'}
        alt={item.name || 'Product'}
        className="w-20 h-24 object-cover rounded-sm bg-surface flex-shrink-0"
        onError={(e) => { e.target.src = '/placeholder-product.jpg' }}
      />
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="text-sm font-bold text-dark truncate">{item.brandName || 'Brand'}</p>
          <p className="text-xs text-muted truncate mt-0.5">{item.name || item.productId}</p>
          <div className="flex gap-3 text-xs text-muted mt-1">
            {item.size && <span className="bg-surface px-1.5 py-0.5 rounded">Size: {item.size}</span>}
            {item.color && <span className="bg-surface px-1.5 py-0.5 rounded">{item.color}</span>}
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-bold text-dark">
            {formatPrice((item.priceAtAddition || 0) * item.quantity)}
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-sm">
              <button disabled={loading} onClick={() => changeQty(-1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-surface transition-colors">
                <Minus size={11} />
              </button>
              <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
              <button disabled={loading} onClick={() => changeQty(1)}
                className="w-7 h-7 flex items-center justify-center hover:bg-surface transition-colors">
                <Plus size={11} />
              </button>
            </div>
            <button onClick={() => handleRemoveFromCart(item.productId, item.variantId)}
              className="text-muted hover:text-red-500 transition-colors ml-1">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}