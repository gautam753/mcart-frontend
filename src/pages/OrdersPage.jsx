import { Package, ChevronRight, Clock, CheckCircle, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '../utils/formatPrice'

const MOCK_ORDERS = [
  { id: 'ORD-2024-8821', date: 'Jan 15, 2024', items: 3, total: 2499, status: 'Delivered', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'ORD-2024-7712', date: 'Feb 28, 2024', items: 1, total: 1299, status: 'Out for Delivery', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'ORD-2024-6603', date: 'Mar 10, 2024', items: 2, total: 3198, status: 'Processing', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
]

export default function OrdersPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-dark uppercase tracking-wide mb-2">My Orders</h1>

      <div className="bg-amber-50 border border-amber-200 rounded-sm p-3 mb-6 flex items-start gap-2 text-sm text-amber-800">
        <span>🚧</span>
        <span>Order management API coming soon. Showing sample orders for UI preview.</span>
      </div>

      <div className="space-y-3">
        {MOCK_ORDERS.map(order => (
          <div key={order.id} className="border border-border rounded-sm p-5 hover:shadow-card transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-sm text-dark">{order.id}</p>
                <p className="text-xs text-muted mt-0.5">{order.date} · {order.items} item(s)</p>
                <div className={`inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-full text-xs font-bold ${order.bg} ${order.color}`}>
                  <order.icon size={11} />
                  {order.status}
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-dark">{formatPrice(order.total)}</p>
                <button className="flex items-center gap-1 text-xs text-primary font-bold mt-2 ml-auto">
                  View Details <ChevronRight size={11} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border border-dashed border-border rounded-sm p-8 text-center">
        <Package size={48} className="text-border mx-auto mb-3" strokeWidth={1} />
        <p className="font-bold text-dark">Order Service Not Connected</p>
        <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
          Connect your orders microservice and replace mock data to show real order history.
        </p>
        <Link to="/" className="inline-block mt-5 bg-primary text-white px-8 py-3 font-bold text-sm hover:bg-primary-dark transition-colors">
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  )
}