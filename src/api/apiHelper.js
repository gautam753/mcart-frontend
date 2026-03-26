import axiosClient, { getAuthToken } from './axiosClient'
import { getGuestToken } from '../utils/guestToken'

// All protected routes — same base URL for everything
const PROTECTED_ROUTES = ['/users', '/wishlist', '/cart', '/orders']

const isProtected = (url) =>
  PROTECTED_ROUTES.some((route) => url.startsWith(route))

const buildHeaders = async (url) => {
  if (!isProtected(url)) return {}
  const token = await getAuthToken()
  if (token) return { Authorization: `Bearer ${token}` }
  return { 'X-Guest-Token': getGuestToken() }
}

export const apiGet = async (url, config = {}) => {
  const headers = await buildHeaders(url)
  return axiosClient.get(url, {
    ...config,
    headers: { ...config.headers, ...headers },
  })
}

export const apiPost = async (url, data = null, config = {}) => {
  const headers = await buildHeaders(url)
  return axiosClient.post(url, data, {
    ...config,
    headers: { ...config.headers, ...headers },
  })
}

export const apiPut = async (url, data = null, config = {}) => {
  const headers = await buildHeaders(url)
  return axiosClient.put(url, data, {
    ...config,
    headers: { ...config.headers, ...headers },
  })
}

export const apiDelete = async (url, config = {}) => {
  const headers = await buildHeaders(url)
  return axiosClient.delete(url, {
    ...config,
    headers: { ...config.headers, ...headers },
  })
}

export const apiPatch = async (url, data = null, config = {}) => {
  const headers = await buildHeaders(url)
  return axiosClient.patch(url, data, {
    ...config,
    headers: { ...config.headers, ...headers },
  })
}