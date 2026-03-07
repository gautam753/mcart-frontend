import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'
import AppRouter from './router/AppRouter'
import { useAuthStore } from './store/authStore'
import { useCartStore } from './store/cartStore'
import { useWishlistStore } from './store/wishlistStore'
import { mergeGuestCart, getCart } from './api/cartApi'
import { getWishlist } from './api/wishlistApi'
import { getGuestToken, clearGuestToken } from './utils/guestToken'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
})

function AuthInitializer() {
  const { setUser, logout } = useAuthStore()
  const { setCart } = useCartStore()
  const { setItems } = useWishlistStore()
  const [authChecked, setAuthChecked] = useState(false)

  const loadUserData = async () => {
    try {
      const user = await getCurrentUser()
      const session = await fetchAuthSession()
      const userId = session?.tokens?.idToken?.payload?.sub

      if (!userId) throw new Error('No user id in session')

      setUser({ ...user, session })

      // merge guest cart on login
      const guestToken = getGuestToken()
      if (guestToken) {
        try {
          const res = await mergeGuestCart(guestToken)
          setCart(res.data)
          clearGuestToken()
        } catch (_) {
          try {
            const cartRes = await getCart()
            setCart(cartRes.data)
          } catch (_) {}
        }
      } else {
        try {
          const cartRes = await getCart()
          setCart(cartRes.data)
        } catch (_) {}
      }

      // load wishlist
      try {
        const wlRes = await getWishlist()
        setItems(wlRes.data || [])
      } catch (_) {}

    } catch (_) {
      logout()
      // still load guest cart
      try {
        const cartRes = await getCart()
        setCart(cartRes.data)
      } catch (_) {}
    } finally {
      setAuthChecked(true)
    }
  }

  useEffect(() => {
    // Listen FIRST before checking current user
    // This catches the signedIn event from the ?code= exchange
    const unsub = Hub.listen('auth', ({ payload }) => {
      console.log('Auth event:', payload.event)
      if (payload.event === 'signedIn') {
        loadUserData()
      }
      if (payload.event === 'signedOut') {
        logout()
        setItems([])
        setCart(null)
      }
      if (payload.event === 'tokenRefresh') {
        loadUserData()
      }
    })

    // Also check if already logged in (page refresh case)
    loadUserData()

    return unsub
  }, [])

  // Show nothing until auth state is determined
  if (!authChecked) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: '13px', fontFamily: 'Assistant, sans-serif', borderRadius: '2px' },
          success: { style: { borderLeft: '4px solid #FF3F6C' } },
          error: { style: { borderLeft: '4px solid #e53e3e' } },
        }}
      />
    </QueryClientProvider>
  )
}