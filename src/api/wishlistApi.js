import { apiGet, apiPost, apiDelete } from './apiHelper'

export const getWishlist = () =>
  apiGet('/wishlist')

export const addToWishlist = (item) =>
  apiPost('/wishlist/add', item)

export const removeFromWishlist = (productId, variantId) =>
  apiDelete('/wishlist/remove', { params: { productId, variantId } })