import { useEffect, useState } from 'react'
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getOrders } from '../api/orderApi'
import { formatPrice } from '../utils/formatPrice'
import { Skeleton } from '../components/common/Skeleton'

const STATUS_CONFIG = {
  PLACED:     { icon: Clock,        color: 'text-blue-600',   bg: 'bg-blue-50',   label: 'Order Placed' },
  CONFIRMED:  { icon: CheckCircle,  color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Confirmed' },
  PROCESSING: { icon: RefreshCw,    color: 'text-orange-500', bg: 'bg-orange-50', label: 'Processing' },
  SHIPPED:    { icon: Truck,        color: 'text-purple-600', bg: 'bg-purple-50', label: 'Shipped' },
  DELIVERED:  { icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50',  label: 'Delivered' },
  CANCELLED:  { icon: XCircle,      color: 'text-red-500',    bg: 'bg-red-50',    label: 'Cancelled' },
}

function OrderSkeleton() {
  return (
    <div className="border border-border rounded-sm p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-24" />
    </div>
  )
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getOrders()
      .then(r => setOrders(r.data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-dark uppercase tracking-wide mb-6">
        My Orders
        {!loading && orders.length > 0 && (
          <span className="text-muted font-normal text-base ml-2">({orders.length})</span>
        )}
      </h1>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <OrderSkeleton key={i} />)}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="border border-red-200 bg-red-50 rounded-sm p-6 text-center">
          <p className="text-red-600 font-semibold text-sm">{error}</p>
          <button
            onClick={() => { setLoading(true); setError(null); getOrders().then(r => setOrders(r.data || [])).catch(e => setError(e.message)).finally(() => setLoading(false)) }}
            className="mt-3 text-primary font-bold text-sm underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && !orders.length && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Package size={72} className="text-border mb-5" strokeWidth={1} />
          <h2 className="text-lg font-bold text-dark">No orders yet</h2>
          <p className="text-muted text-sm mt-2 mb-6">
            Looks like you haven't placed any orders yet.
          </p>
          <Link
            to="/"
            className="bg-primary text-white px-8 py-3 font-bold text-sm hover:bg-primary-dark transition-colors"
          >
            START SHOPPING
          </Link>
        </div>
      )}

      {/* Orders List */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map(order => {
            const orderId = order.orderId || order.id
            const status = order.status || 'PLACED'
            const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PLACED
            const Icon = cfg.icon
            const total = order.totalAmount || order.totalPrice || 0
            const itemCount = order.items?.length || 0

            return (
              <div
                key={orderId}
                className="border border-border rounded-sm p-5 hover:shadow-card transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm text-dark">{orderId}</p>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.color}`}>
                        <Icon size={11} />
                        {cfg.label}
                      </div>
                    </div>
                    <p className="text-xs text-muted mt-1">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })
                        : '—'
                      }
                      {itemCount > 0 && ` · ${itemCount} item${itemCount > 1 ? 's' : ''}`}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      Payment: <span className="font-semibold text-dark">
                        {order.paymentMethod || 'COD'}
                      </span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-dark">{formatPrice(total)}</p>
                    <Link
                      to={`/orders/${orderId}`}
                      className="inline-flex items-center gap-1 text-xs text-primary font-bold mt-1 hover:underline"
                    >
                      View Details <ChevronRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}