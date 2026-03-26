import { useLocation, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, Package, MapPin, ArrowRight } from 'lucide-react'
import { formatPrice } from '../utils/formatPrice'

export default function OrderConfirmationPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const order = state?.order

  // If accessed directly without order state
  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center px-4">
        <Package size={64} className="text-border mb-4" strokeWidth={1} />
        <p className="font-bold text-dark text-lg">No order details found</p>
        <Link to="/orders" className="mt-4 text-primary font-bold text-sm underline">
          View My Orders
        </Link>
      </div>
    )
  }

  const orderId = order.orderId || order.id
  const total = order.totalAmount || order.totalPrice || 0
  const status = order.status || 'PLACED'
  const items = order.items || []

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Success Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={36} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-black text-dark">Order Placed Successfully!</h1>
        <p className="text-muted text-sm mt-2">
          Thank you! Your order has been confirmed.
        </p>
        <div className="mt-3 bg-surface border border-border rounded-sm px-4 py-2 text-sm">
          Order ID: <span className="font-bold text-dark">{orderId}</span>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="border border-border rounded-sm overflow-hidden mb-5">
        {/* Status */}
        <div className="flex items-center justify-between px-5 py-4 bg-green-50 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-bold text-green-700">{status}</span>
          </div>
          <span className="text-xs text-muted">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })
              : new Date().toLocaleDateString('en-IN')
            }
          </span>
        </div>

        {/* Items */}
        {items.length > 0 && (
          <div className="divide-y divide-surface px-5">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="w-12 h-14 bg-surface rounded-sm flex-shrink-0 flex items-center justify-center">
                  <Package size={16} className="text-muted" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-dark truncate">
                    {item.productId}
                  </p>
                  <p className="text-xs text-muted">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-bold text-dark flex-shrink-0">
                  {formatPrice((item.priceAtOrder || item.priceAtAddition || 0) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-surface">
          <span className="font-bold text-sm text-dark">Total Amount</span>
          <span className="font-black text-dark text-base">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Payment & Delivery */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-border rounded-sm p-4">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-1">
            Payment
          </p>
          <p className="text-sm font-bold text-dark">🚚 Cash on Delivery</p>
          <p className="text-xs text-muted mt-0.5">Pay when order arrives</p>
        </div>
        <div className="border border-border rounded-sm p-4">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wide mb-1">
            Estimated Delivery
          </p>
          <p className="text-sm font-bold text-dark">
            {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short',
            })} –{' '}
            {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short',
            })}
          </p>
          <p className="text-xs text-muted mt-0.5">5–7 business days</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          to="/orders"
          className="flex-1 bg-primary text-white text-center font-bold py-3 text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
        >
          <Package size={14} /> VIEW MY ORDERS
        </Link>
        <Link
          to="/"
          className="flex-1 border border-dark text-dark text-center font-bold py-3 text-sm hover:bg-surface transition-colors flex items-center justify-center gap-2"
        >
          CONTINUE SHOPPING <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}