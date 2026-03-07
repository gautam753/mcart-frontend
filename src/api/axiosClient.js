import axios from 'axios'
import { fetchAuthSession } from 'aws-amplify/auth'
import { getGuestToken } from '../utils/guestToken'

// Token cache
let cachedToken = null
let tokenExpiry = null

export const clearTokenCache = () => {
  cachedToken = null
  tokenExpiry = null
}

export const getAuthToken = async () => {
  const now = Date.now()

  // Return cached token if still valid
  if (cachedToken && tokenExpiry && now < tokenExpiry - 60000) {
    return cachedToken
  }

  try {
    const session = await fetchAuthSession()
    const idToken = session?.tokens?.idToken
    if (!idToken) {
      cachedToken = null
      tokenExpiry = null
      return null
    }
    const exp = idToken?.payload?.exp
    cachedToken = idToken.toString()
    tokenExpiry = exp ? exp * 1000 : now + 3600000
    return cachedToken
  } catch (_) {
    cachedToken = null
    tokenExpiry = null
    return null
  }
}

// Completely plain axios — zero interceptors
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Only response interceptor for error messages
axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const msg =
      error.response?.data?.message || error.message || 'Something went wrong'
    return Promise.reject(new Error(msg))
  }
)

export default axiosClient