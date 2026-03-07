import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useCart } from '../hooks/useCart'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'

export default function CartPage() {
  const { cart } = useCartStore()
  const { refreshCart } = useCart()
  useEffect(() => { refreshCart() }, [])

  if (!cart?.items?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <ShoppingBag size={80} className="text-border mb-6" strokeWidth={1} />
        <h2 className="text-2xl font-black text-dark">Your bag is empty!</h2>
        <p className="text-muted mt-2 mb-8 text-sm">Add items you like to your bag. Review them before buying.</p>
        <Link to="/" className="bg-primary text-white px-10 py-4 font-bold text-sm hover:bg-primary-dark transition-colors">
          CONTINUE SHOPPING
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="text-muted hover:text-dark"><ArrowLeft size={18} /></Link>
        <h1 className="text-xl font-bold text-dark uppercase">
          MY BAG <span className="text-muted font-normal text-base">({cart.totalItems} items)</span>
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 divide-y divide-border border border-border rounded-sm px-4">
          {cart.items.map(item => (
            <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
          ))}
        </div>
        <div>
          <div className="border border-border rounded-sm p-5 sticky top-20">
            <h3 className="font-bold text-sm uppercase tracking-wide mb-4 pb-3 border-b border-surface">Price Details</h3>
            <CartSummary cart={cart} />
            <Link to="/checkout"
              className="block w-full bg-primary text-white text-center font-bold py-4 mt-5 hover:bg-primary-dark transition-colors text-sm tracking-wide">
              PLACE ORDER
            </Link>
            <p className="text-center text-xs text-muted mt-3">
              🔒 Safe and Secure Payments
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}