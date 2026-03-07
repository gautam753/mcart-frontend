import { apiGet } from './apiHelper'

export const getVariantsByProduct = (productId) =>
  apiGet(`/variants/product/${productId}`)

export const getVariantById = (productId, variantId) =>
  apiGet(`/variants/${productId}/${variantId}`)

export const getVariantBySku = (sku) =>
  apiGet(`/variants/sku/${sku}`)

export const getLowStockVariants = (threshold = 5) =>
  apiGet('/variants/low-stock', { params: { threshold } })