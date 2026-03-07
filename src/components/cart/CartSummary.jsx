import { formatPrice } from '../../utils/formatPrice'

export default function CartSummary({ cart }) {
  const originalTotal = cart.items?.reduce(
    (sum, i) => sum + (i.mrp || i.priceAtAddition || 0) * i.quantity, 0
  ) || 0
  const finalTotal = cart.totalPrice || 0
  const discount = originalTotal - finalTotal

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-dark">
        <span>Total MRP</span>
        <span>{formatPrice(originalTotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex justify-between text-[#14958F] font-medium">
          <span>Discount on MRP</span>
          <span>–{formatPrice(discount)}</span>
        </div>
      )}
      <div className="flex justify-between text-[#14958F] font-medium">
        <span>Delivery Charge</span>
        <span className="font-bold">FREE</span>
      </div>
      <div className="flex justify-between font-bold text-dark text-base border-t border-border pt-2 mt-1">
        <span>Total Amount</span>
        <span>{formatPrice(finalTotal)}</span>
      </div>
      {discount > 0 && (
        <p className="text-[#14958F] text-xs font-semibold bg-green-50 px-3 py-2 rounded text-center">
          🎉 You are saving {formatPrice(discount)} on this order!
        </p>
      )}
    </div>
  )
}