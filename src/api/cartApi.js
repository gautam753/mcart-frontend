import { apiGet, apiPost, apiDelete } from './apiHelper'
import axiosClient, { getAuthToken } from './axiosClient'
import { getGuestToken } from '../utils/guestToken'

export const getCart = () =>
  apiGet('/cart')

export const addToCart = (item) =>
  apiPost('/cart/add', item)

export const removeFromCart = (productId, variantId) =>
  apiDelete('/cart/remove', { params: { productId, variantId } })

export const mergeGuestCart = async (guestToken) => {
  // Needs BOTH auth token AND guest token
  const authToken = await getAuthToken()
  const headers = {
    'X-Guest-Token': guestToken,
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  }
  return axiosClient.post('/cart/merge', null, { headers })
}

export const debugCart = () =>
  apiGet('/cart/debug')