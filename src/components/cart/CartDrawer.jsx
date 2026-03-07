import { X, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useCartStore } from '../../store/cartStore'
import { useCart } from '../../hooks/useCart'
import CartItem from './CartItem'
import CartSummary from './CartSummary'

export default function CartDrawer({ isOpen, onClose }) {
  const { cart } = useCartStore()
  const { refreshCart } = useCart()

  useEffect(() => {
    if (isOpen) refreshCart()
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} />
            <span className="font-bold uppercase text-sm tracking-wide">My Bag</span>
            {(cart?.totalItems || 0) > 0 && (
              <span className="text-xs bg-surface text-muted px-2 py-0.5 rounded-full font-medium">
                {cart.totalItems} items
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-muted hover:text-dark transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!cart?.items?.length ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={72} className="text-border" />
              <div>
                <p className="font-bold text-dark text-lg">Your bag is empty!</p>
                <p className="text-muted text-sm mt-1">Add items you like to your bag.</p>
              </div>
              <button onClick={onClose} className="bg-primary text-white px-8 py-3 font-bold text-sm hover:bg-primary-dark mt-2">
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {cart.items.map(item => (
                <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart?.items?.length > 0 && (
          <div className="border-t border-border p-5 bg-white">
            <CartSummary cart={cart} />
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full bg-primary text-white text-center font-bold py-4 mt-4 hover:bg-primary-dark transition-colors text-sm tracking-wide"
            >
              PLACE ORDER
            </Link>
          </div>
        )}
      </div>
    </>
  )
}