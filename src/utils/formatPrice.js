export const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price ?? 0)

export const calcDiscount = (mrp, price) =>
  mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0