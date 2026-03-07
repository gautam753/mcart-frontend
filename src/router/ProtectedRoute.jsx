import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { signInWithRedirect } from 'aws-amplify/auth'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) signInWithRedirect()
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-64 text-muted text-sm">
        Redirecting to login...
      </div>
    )
  }
  return <Outlet />
}