import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrderById, cancelOrder } from '../api/orderApi'
import { getProductById } from '../api/productApi'
import { formatPrice } from '../utils/formatPrice'
import { Skeleton } from '../components/common/Skeleton'
import { Package, ArrowLeft, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function OrderDetailPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [enrichedItems, setEnrichedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    getOrderById(orderId)
      .then(async (r) => {
        const o = r.data
        setOrder(o)
        // Enrich items with product details
        const items = await Promise.allSettled(
          (o.items || []).map(async item => {
            try {
              const p = await getProductById(item.productId)
              return {
                ...item,
                image: p.data?.primaryImage || null,
                name: p.data?.name || item.productId,
                brandName: p.data?.brandName || '',
                slug: p.data?.slug || null,
              }
            } catch (_) {
              return { ...item, name: item.productId }
            }
          })
        )
        setEnrichedItems(items.map(r => r.status === 'fulfilled' ? r.value : r.reason))
      })
      .catch(() => toast.error('Failed to load order'))
      .finally(() => setLoading(false))
  }, [orderId])

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    setCancelling(true)
    try {
      await cancelOrder(orderId)
      setOrder(o => ({ ...o, status: 'CANCELLED' }))
      toast.success('Order cancelled successfully')
    } catch (e) {
      toast.error(e.message || 'Failed to cancel order')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-24">
        <p className="text-muted">Order not found</p>
        <Link to="/orders" className="text-primary font-bold text-sm mt-3 inline-block underline">
          Back to Orders
        </Link>
      </div>
    )
  }

  const total = order.totalAmount || order.totalPrice || 0
  const canCancel = ['PLACED', 'CONFIRMED'].includes(order.status)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to="/orders"
        className="flex items-center gap-2 text-sm text-muted hover:text-dark mb-6"
      >
        <ArrowLeft size={15} /> Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-bold text-dark">Order Details</h1>
          <p className="text-xs text-muted mt-0.5">{order.orderId || order.id}</p>
        </div>
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex items-center gap-1.5 text-xs font-bold text-red-500 border border-red-300 px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <XCircle size={13} />
            {cancelling ? 'CANCELLING...' : 'CANCEL ORDER'}
          </button>
        )}
      </div>

      {/* Status */}
      <div className="border border-border rounded-sm p-4 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted uppercase tracking-wide">Status</p>
          <p className="font-bold text-dark mt-0.5">{order.status}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted uppercase tracking-wide">Payment</p>
          <p className="font-bold text-dark mt-0.5">{order.paymentMethod || 'COD'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted uppercase tracking-wide">Date</p>
          <p className="font-bold text-dark mt-0.5">
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })
              : '—'
            }
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="border border-border rounded-sm mb-4">
        <p className="font-bold text-sm uppercase tracking-wide px-5 py-3 border-b border-surface">
          Items ({enrichedItems.length})
        </p>
        <div className="divide-y divide-surface px-5">
          {enrichedItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-4">
              {item.slug ? (
                <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                  <img
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.name}
                    className="w-14 h-16 object-cover rounded-sm bg-surface"
                    onError={e => { e.target.src = '/placeholder-product.jpg' }}
                  />
                </Link>
              ) : (
                <img
                  src={item.image || '/placeholder-product.jpg'}
                  alt={item.name}
                  className="w-14 h-16 object-cover rounded-sm bg-surface flex-shrink-0"
                  onError={e => { e.target.src = '/placeholder-product.jpg' }}
                />
              )}
              <div className="flex-1 min-w-0">
                {item.brandName && (
                  <p className="text-sm font-bold text-dark">{item.brandName}</p>
                )}
                <p className="text-xs text-muted truncate">{item.name}</p>
                <p className="text-xs text-muted mt-0.5">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-bold text-dark flex-shrink-0">
                {formatPrice((item.priceAtOrder || item.priceAtAddition || 0) * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-5 py-4 border-t border-border bg-surface">
          <span className="font-bold text-sm">Total</span>
          <span className="font-black text-dark">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}