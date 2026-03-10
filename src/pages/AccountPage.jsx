import { useState } from 'react'
import { User, MapPin, Package, Heart, LogOut, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { signOut } from 'aws-amplify/auth'
import { useAuthStore } from '../store/authStore'
import ProfileForm from '../components/account/ProfileForm'
import AddressBook from '../components/account/AddressBook'
import clsx from 'clsx'

const NAV = [
  { id: 'profile', label: 'My Profile', icon: User, component: 'inline' },
  { id: 'addresses', label: 'Saved Addresses', icon: MapPin, component: 'inline' },
  { id: 'orders', label: 'My Orders', icon: Package, href: '/orders' },
  { id: 'wishlist', label: 'My Wishlist', icon: Heart, href: '/wishlist' },
]

export default function AccountPage() {
  const [active, setActive] = useState('profile')
  const { user } = useAuthStore()
  const username = user?.session?.tokens?.idToken?.payload?.name || user?.username?.split('@')[0] || user?.signInDetails?.loginId?.split('@')[0] || 'User'

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex gap-6 items-start">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          {/* User Card */}
          <div className="flex items-center gap-3 bg-surface border border-border rounded-sm p-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-xl flex-shrink-0">
              {username[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted uppercase tracking-wide">Hello,</p>
              <p className="font-bold text-dark truncate text-sm">{username}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="border border-border rounded-sm overflow-hidden">
            {NAV.map((item, i) => (
              item.href ? (
                <Link key={item.id} to={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-dark hover:bg-surface hover:text-primary transition-colors border-b border-surface last:border-0">
                  <item.icon size={15} />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight size={13} className="text-muted" />
                </Link>
              ) : (
                <button key={item.id} onClick={() => setActive(item.id)}
                  className={clsx(
                    'flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors border-b border-surface last:border-0',
                    active === item.id ? 'bg-primary text-white font-bold' : 'text-dark hover:bg-surface hover:text-primary'
                  )}>
                  <item.icon size={15} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {active !== item.id && <ChevronRight size={13} className="text-muted" />}
                </button>
              )
            ))}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} /> Logout
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {active === 'profile' && <ProfileForm />}
          {active === 'addresses' && <AddressBook />}
        </div>
      </div>
    </div>
  )
}