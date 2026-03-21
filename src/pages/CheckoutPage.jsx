import { useState, useEffect } from 'react'
import { Lock, CreditCard, Smartphone, Building2, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import CartSummary from '../components/cart/CartSummary'
import { formatPrice } from '../utils/formatPrice'
import { getAddresses } from '../api/userApi'
import { useAuthStore } from '../store/authStore'
import { Skeleton } from '../components/common/Skeleton'

const PAYMENT_METHODS = [
  { icon: CreditCard, label: 'Credit / Debit / ATM Card' },
  { icon: Smartphone, label: 'UPI (GPay, PhonePe, Paytm)' },
  { icon: Building2, label: 'Net Banking' },
]

function AddressSection({ isAuthenticated }) {
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    setLoading(true)
    getAddresses()
      .then(r => {
        const list = r.data || []
        setAddresses(list)
        // Pick default address first, fallback to first address
        const defaultAddr = list.find(a => a.isDefault) || list[0] || null
        setSelectedAddress(defaultAddr)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="px-5 py-6 flex flex-col items-center gap-3 text-center">
        <MapPin size={32} className="text-border" />
        <p className="text-sm text-muted">Please login to select a delivery address</p>
        <Link to="/account" className="text-primary font-bold text-sm underline">
          Login / Sign Up
        </Link>
      </div>
    )
  }

  // Loading
  if (loading) {
    return (
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  // No addresses saved
  if (!addresses.length) {
    return (
      <div className="px-5 py-6 flex flex-col items-center gap-3 text-center">
        <MapPin size={32} className="text-border" />
        <p className="text-sm text-muted">No saved addresses found</p>
        <Link
          to="/account"
          className="bg-primary text-white text-xs font-bold px-5 py-2 hover:bg-primary-dark transition-colors"
        >
          ADD ADDRESS
        </Link>
      </div>
    )
  }

  const a = selectedAddress?.addressJson || {}

  return (
    <div className="px-5 py-4 space-y-4">
      {/* Selected Address Display */}
      {selectedAddress && (
        <div className="border border-primary rounded-sm p-4 bg-pink-50/30">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-primary border border-primary px-2 py-0.5 rounded uppercase">
                {selectedAddress.type}
              </span>
              {a.name && (
                <p className="font-bold text-dark text-sm mt-2">{a.name}</p>
              )}
              <p className="text-sm text-muted mt-1 leading-relaxed">
                {[a.street, a.area, a.city, a.state, a.pincode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              {a.phone && (
                <p className="text-sm text-muted mt-1">Mobile: {a.phone}</p>
              )}
            </div>
            {selectedAddress.isDefault && (
              <span className="text-[10px] font-bold text-green-600 border border-green-400 px-2 py-0.5 rounded uppercase flex-shrink-0">
                Default
              </span>
            )}
          </div>
        </div>
      )}

      {/* Other Addresses — show if more than 1 */}
      {addresses.length > 1 && (
        <div>
          <p className="text-xs font-bold text-muted uppercase tracking-wide mb-2">
            Other Saved Addresses
          </p>
          <div className="space-y-2">
            {addresses
              .filter(addr => addr.addressId !== selectedAddress?.addressId)
              .map(addr => {
                const ad = addr.addressJson || {}
                return (
                  <button
                    key={addr.addressId}
                    onClick={() => setSelectedAddress(addr)}
                    className="w-full text-left border border-border rounded-sm p-3 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-muted border border-border px-1.5 py-0.5 rounded uppercase flex-shrink-0">
                        {addr.type}
                      </span>
                      <div className="min-w-0">
                        {ad.name && (
                          <p className="text-sm font-semibold text-dark">{ad.name}</p>
                        )}
                        <p className="text-xs text-muted truncate">
                          {[ad.street, ad.area, ad.city, ad.state, ad.pincode]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
          </div>
        </div>
      )}

      <Link
        to="/account"
        className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
      >
        <MapPin size={11} /> MANAGE ADDRESSES
      </Link>
    </div>
  )
}

export default function CheckoutPage() {
  const { cart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

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

          {/* Step 1 - Delivery Address */}
          <div className="border border-border rounded-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  1
                </span>
                <span className="font-bold text-sm uppercase tracking-wide">
                  Delivery Address
                </span>
              </div>
              <Link to="/account" className="text-xs text-primary font-bold hover:underline">
                CHANGE
              </Link>
            </div>
            <AddressSection isAuthenticated={isAuthenticated} />
          </div>

          {/* Step 2 - Order Summary */}
          <div className="border border-border rounded-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-surface">
              <span className="w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                2
              </span>
              <span className="font-bold text-sm uppercase tracking-wide">
                Order Summary{cart?.totalItems ? ` (${cart.totalItems} items)` : ''}
              </span>
            </div>
            <div className="px-5 py-4 divide-y divide-surface">
              {cart?.items?.length ? (
                cart.items.map(item => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="flex items-center gap-3 py-3"
                  >
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      className="w-14 h-16 object-cover bg-surface rounded-sm flex-shrink-0"
                      alt={item.name || 'Product'}
                      onError={e => { e.target.src = '/placeholder-product.jpg' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-dark truncate">
                        {item.brandName || 'Brand'}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {item.name || item.productId}
                      </p>
                      <div className="flex gap-2 mt-0.5">
                        {item.size && (
                          <span className="text-[10px] bg-surface px-1.5 py-0.5 rounded text-muted">
                            Size: {item.size}
                          </span>
                        )}
                        {item.color && (
                          <span className="text-[10px] bg-surface px-1.5 py-0.5 rounded text-muted">
                            {item.color}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-dark flex-shrink-0">
                      {formatPrice((item.priceAtAddition || 0) * item.quantity)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted py-6 text-center">No items in cart</p>
              )}
            </div>
          </div>

          {/* Step 3 - Payment */}
          <div className="border border-border rounded-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-surface">
              <span className="w-6 h-6 bg-border text-muted text-xs font-bold rounded-full flex items-center justify-center">
                3
              </span>
              <span className="font-bold text-sm uppercase tracking-wide text-muted">
                Payment Options
              </span>
            </div>
            <div className="px-5 py-4 space-y-2">
              {PAYMENT_METHODS.map(({ icon: Icon, label }) => (
                <label
                  key={label}
                  className="flex items-center gap-3 border border-border rounded-sm p-3 opacity-60 cursor-not-allowed"
                >
                  <input
                    type="radio"
                    name="payment"
                    disabled
                    className="accent-primary"
                  />
                  <Icon size={16} className="text-muted flex-shrink-0" />
                  <span className="text-sm text-dark flex-1">{label}</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                    COMING SOON
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Price Summary */}
        <div>
          <div className="border border-border rounded-sm p-5 sticky top-20">
            <h3 className="font-bold text-sm uppercase tracking-wide mb-4 pb-3 border-b border-surface">
              Price Details
            </h3>
            {cart
              ? <CartSummary cart={cart} />
              : <p className="text-sm text-muted">No items in cart</p>
            }
            <button
              disabled
              className="w-full bg-border text-muted font-bold py-4 mt-5 text-sm cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock size={14} /> PAYMENT COMING SOON
            </button>
            <p className="text-center text-[11px] text-muted mt-2">
              Payment gateway integration pending
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}