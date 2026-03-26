import { apiGet, apiPost, apiPatch } from './apiHelper'

export const createOrder = (payload) =>
  apiPost('/orders', payload)

export const getOrders = () =>
  apiGet('/orders')

export const getOrderById = (orderId) =>
  apiGet(`/orders/${orderId}`)

export const cancelOrder = (orderId) =>
  apiPatch(`/orders/${orderId}/cancel`)

export const updateOrderStatus = (orderId, status) =>
  apiPatch(`/orders/${orderId}/status`, { status })