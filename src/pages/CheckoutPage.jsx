import { Lock, CreditCard, Smartphone, Building2, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import CartSummary from '../components/cart/CartSummary'
import { formatPrice } from '../utils/formatPrice'

const PAYMENT_METHODS = [
  { icon: CreditCard, label: 'Credit / Debit / ATM Card' },
  { icon: Smartphone, label: 'UPI (GPay, PhonePe, Paytm)' },
  { icon: Building2, label: 'Net Banking' },
]

export default function CheckoutPage() {
  const { cart } = useCartStore()

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Trust bar */}
      <div className="flex items-center gap-2 text-xs text-muted mb-6">
        <Lock size={13} className="text-green-600" />
        <span>100% Secure Checkout — All transactions are encrypted</span>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 mb-6 text-sm text-amber-800 flex items-start gap-2">
        <span>🚧</span>
        <span>Payment integration is coming soon. This is a static checkout preview.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">
          {/* Step 1 - Address */}
          <div className="border border-border rounded-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                <span className="font-bold text-sm uppercase tracking-wide">Delivery Address</span>
              </div>
              <Link to="/account" className="text-xs text-primary font-bold">CHANGE</Link>
            </div>
            <div className="px-5 py-4">
              <div className="border border-primary rounded-sm p-4 bg-pink-50/30">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-primary border border-primary px-2 py-0.5 rounded uppercase">Home</span>
                    <p className="font-bold text-dark text-sm mt-2">John Doe</p>
                    <p className="text-sm text-muted mt-1">123 Main Street, MG Road, Bengaluru - 560001, Karnataka</p>
                    <p className="text-sm text-muted">Mobile: +91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 - Order Summary */}
          <div className="border border-border rounded-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-surface">
              <span className="w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
              <span className="font-bold text-sm uppercase tracking-wide">
                Order Summary {cart?.totalItems ? `(${cart.totalItems} items)` : ''}
              </span>
            </div>
            <div className="px-5 py-4 divide-y divide-surface">
              {cart?.items?.map(item => (
                <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3 py-3">
                  <img src="/placeholder-product.jpg" className="w-14 h-16 object-cover bg-surface rounded-sm flex-shrink-0" alt="" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">{item.productId}</p>
                    <p className="text-xs text-muted">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-dark flex-shrink-0">{formatPrice((item.priceAtAddition || 0) * item.quantity)}</span>
                </div>
              )) || <p className="text-sm text-muted py-4 text-center">No items in cart</p>}
            </div>
          </div>

          {/* Step 3 - Payment */}
          <div className="border border-border rounded-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-surface">
              <span className="w-6 h-6 bg-border text-muted text-xs font-bold rounded-full flex items-center justify-center">3</span>
              <span className="font-bold text-sm uppercase tracking-wide text-muted">Payment Options</span>
            </div>
            <div className="px-5 py-4 space-y-2">
              {PAYMENT_METHODS.map(({ icon: Icon, label }) => (
                <label key={label} className="flex items-center gap-3 border border-border rounded-sm p-3 cursor-pointer hover:border-dark transition-colors opacity-60">
                  <input type="radio" name="payment" disabled className="accent-primary" />
                  <Icon size={16} className="text-muted flex-shrink-0" />
                  <span className="text-sm text-dark flex-1">{label}</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">COMING SOON</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div>
          <div className="border border-border rounded-sm p-5 sticky top-20">
            <h3 className="font-bold text-sm uppercase tracking-wide mb-4 pb-3 border-b border-surface">Price Details</h3>
            {cart ? <CartSummary cart={cart} /> : <p className="text-sm text-muted">No items in cart</p>}
            <button disabled
              className="w-full bg-border text-muted font-bold py-4 mt-5 text-sm cursor-not-allowed flex items-center justify-center gap-2">
              <Lock size={14} /> PAYMENT COMING SOON
            </button>
            <p className="text-center text-[11px] text-muted mt-2">Payment gateway integration pending</p>
          </div>
        </div>
      </div>
    </div>
  )
}