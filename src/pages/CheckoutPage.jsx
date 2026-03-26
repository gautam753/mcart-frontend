import { useState, useEffect } from 'react'
import { Lock, CreditCard, Smartphone, Building2, MapPin, CheckCircle, Loader } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import CartSummary from '../components/cart/CartSummary'
import { formatPrice } from '../utils/formatPrice'
import { getAddresses } from '../api/userApi'
import { createOrder } from '../api/orderApi'
import { useAuthStore } from '../store/authStore'
import { Skeleton } from '../components/common/Skeleton'
import CheckoutOrderItem from '../components/checkout/CheckoutOrderItem'
import toast from 'react-hot-toast'

const PAYMENT_METHODS = [
  { icon: CreditCard, label: 'Credit / Debit / ATM Card' },
  { icon: Smartphone, label: 'UPI (GPay, PhonePe, Paytm)' },
  { icon: Building2, label: 'Net Banking' },
]

function AddressSection({ isAuthenticated, onAddressSelect }) {
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
        const defaultAddr = list.find(a => a.isDefault) || list[0] || null
        setSelectedAddress(defaultAddr)
        onAddressSelect(defaultAddr)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  const handleSelect = (addr) => {
    setSelectedAddress(addr)
    onAddressSelect(addr)
  }

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

  if (loading) {
    return (
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

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
      {selectedAddress && (
        <div className="border border-primary rounded-sm p-4 bg-pink-50/30">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <span className="text-[10px] font-bold text-primary border border-primary px-2 py-0.5 rounded uppercase">
                {selectedAddress.type}
              </span>
              {a.name && <p className="font-bold text-dark text-sm mt-2">{a.name}</p>}
              <p className="text-sm text-muted mt-1 leading-relaxed">
                {[a.street, a.area, a.city, a.state, a.pincode].filter(Boolean).join(', ')}
              </p>
              {a.phone && <p className="text-sm text-muted mt-1">Mobile: {a.phone}</p>}
            </div>
            {selectedAddress.isDefault && (
              <span className="text-[10px] font-bold text-green-600 border border-green-400 px-2 py-0.5 rounded uppercase flex-shrink-0">
                Default
              </span>
            )}
          </div>
        </div>
      )}

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
                    onClick={() => handleSelect(addr)}
                    className="w-full text-left border border-border rounded-sm p-3 hover:border-primary transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-muted border border-border px-1.5 py-0.5 rounded uppercase flex-shrink-0">
                        {addr.type}
                      </span>
                      <div className="min-w-0">
                        {ad.name && <p className="text-sm font-semibold text-dark">{ad.name}</p>}
                        <p className="text-xs text-muted truncate">
                          {[ad.street, ad.area, ad.city, ad.state, ad.pincode].filter(Boolean).join(', ')}
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
  const { cart, clearCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [placingOrder, setPlacingOrder] = useState(false)

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address')
      return
    }
    if (!cart?.items?.length) {
      toast.error('Your cart is empty')
      return
    }

    setPlacingOrder(true)
    try {
      const payload = {
        addressId: selectedAddress.addressId,
        paymentMethod: 'COD',
        notes: '',
      }
      const res = await createOrder(payload)
      const order = res.data

      // Clear cart after successful order
      clearCart()

      toast.success('Order placed successfully!')

      // Redirect to order confirmation
      navigate(`/orders/${order.orderId || order.id}`, {
        state: { order },
        replace: true,
      })
    } catch (e) {
      toast.error(e.message || 'Failed to place order. Please try again.')
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Trust bar */}
      <div className="flex items-center gap-2 text-xs text-muted mb-6">
        <Lock size={13} className="text-green-600" />
        <span>100% Secure Checkout — All transactions are encrypted</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-5">

          {/* Step 1 - Delivery Address */}
          <div className="border border-border rounded-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                <span className="font-bold text-sm uppercase tracking-wide">Delivery Address</span>
              </div>
              <Link to="/account" className="text-xs text-primary font-bold hover:underline">CHANGE</Link>
            </div>
            <AddressSection
              isAuthenticated={isAuthenticated}
              onAddressSelect={setSelectedAddress}
            />
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
            <div className="px-5 divide-y divide-surface">
              {cart?.items?.length ? (
                cart.items.map(item => (
                  <CheckoutOrderItem
                    key={`${item.productId}-${item.variantId}`}
                    item={item}
                  />
                ))
              ) : (
                <p className="text-sm text-muted py-6 text-center">No items in cart</p>
              )}
            </div>
          </div>

          {/* Step 3 - Payment */}
          <div className="border border-border rounded-sm">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-surface">
              <span className="w-6 h-6 bg-border text-muted text-xs font-bold rounded-full flex items-center justify-center">3</span>
              <span className="font-bold text-sm uppercase tracking-wide text-muted">
                Payment Options
              </span>
            </div>
            <div className="px-5 py-4 space-y-2">
              {/* COD — Active */}
              <label className="flex items-center gap-3 border-2 border-primary rounded-sm p-3 cursor-pointer bg-pink-50/20">
                <input
                  type="radio"
                  name="payment"
                  defaultChecked
                  className="accent-primary"
                  readOnly
                />
                <span className="text-lg">🚚</span>
                <div className="flex-1">
                  <span className="text-sm font-bold text-dark">Cash on Delivery</span>
                  <p className="text-xs text-muted mt-0.5">Pay when your order arrives</p>
                </div>
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">
                  AVAILABLE
                </span>
              </label>

              {/* Other methods — disabled */}
              {PAYMENT_METHODS.map(({ icon: Icon, label }) => (
                <label
                  key={label}
                  className="flex items-center gap-3 border border-border rounded-sm p-3 opacity-50 cursor-not-allowed"
                >
                  <input type="radio" name="payment" disabled className="accent-primary" />
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

            {/* COD Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddress || !cart?.items?.length}
              className="w-full bg-primary text-white font-bold py-4 mt-5 text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {placingOrder ? (
                <>
                  <Loader size={15} className="animate-spin" />
                  PLACING ORDER...
                </>
              ) : (
                <>
                  🚚 PLACE ORDER — COD
                </>
              )}
            </button>

            {/* Online Payment — disabled */}
            <button
              disabled
              className="w-full border border-border text-muted font-bold py-3 mt-2 text-sm cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Lock size={13} /> ONLINE PAYMENT COMING SOON
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3">
              <Lock size={11} className="text-green-600" />
              <p className="text-[11px] text-muted">100% secure &amp; encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}