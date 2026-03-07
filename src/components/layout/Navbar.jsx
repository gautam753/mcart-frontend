import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Heart, ShoppingBag, User, LogOut, Package, ChevronDown } from 'lucide-react'
import { signInWithRedirect, signOut } from 'aws-amplify/auth'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { getCategoryTree } from '../../api/categoryApi'
import { searchProducts } from '../../api/productApi'
import { useDebounce } from '../../hooks/useDebounce'
import MegaMenu from './MegaMenu'
import clsx from 'clsx'

export default function Navbar() {
  const { isAuthenticated, user } = useAuthStore()
  const { cart, openCart } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuTimeout = useRef(null)
  const debouncedSearch = useDebounce(searchQuery, 350)

  useEffect(() => {
    getCategoryTree().then(r => setCategories(r.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (debouncedSearch.length > 1) {
      searchProducts(debouncedSearch)
        .then(r => setSearchResults((r.data || []).slice(0, 7)))
        .catch(() => setSearchResults([]))
    } else {
      setSearchResults([])
    }
  }, [debouncedSearch])

  const cartCount = cart?.totalItems || 0
  const wishlistCount = wishlistItems.length
  //const username = user?.username?.split('@')[0] || user?.signInDetails?.loginId?.split('@')[0] || 'Profile'
  const username = user?.signInDetails?.loginId?.split('@')[0] || user?.username?.split('@')[0] || 'Profile'

  const handleMouseEnter = (cat) => {
    clearTimeout(menuTimeout.current)
    setActiveCategory(cat)
  }
  const handleMouseLeave = () => {
    menuTimeout.current = setTimeout(() => setActiveCategory(null), 120)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-nav">
      <div className="max-w-screen-xl mx-auto px-4 flex items-center gap-4 h-14">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 mr-2">
          <span className="text-2xl font-black text-primary tracking-tight">MCart</span>
        </Link>

        {/* Category Nav */}
        <nav className="hidden lg:flex items-stretch h-14">
          {categories.map((cat) => (
            <div
              key={cat.categoryId}
              className="relative flex items-stretch"
              onMouseEnter={() => handleMouseEnter(cat)}
              onMouseLeave={handleMouseLeave}
            >
              <button className={clsx(
                'px-4 text-sm font-semibold uppercase tracking-wide flex items-center gap-1 border-b-2 transition-colors h-full',
                activeCategory?.categoryId === cat.categoryId
                  ? 'border-primary text-primary'
                  : 'border-transparent text-dark hover:text-primary'
              )}>
                {cat.name}
              </button>
              {activeCategory?.categoryId === cat.categoryId && (
                <MegaMenu
                  category={cat}
                  onMouseEnter={() => handleMouseEnter(cat)}
                  onMouseLeave={handleMouseLeave}
                />
              )}
            </div>
          ))}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-lg relative">
          <div className="flex items-center bg-surface rounded px-3 py-2 gap-2 border border-transparent focus-within:border-border">
            <Search size={15} className="text-muted flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for products, brands and more"
              className="bg-transparent text-sm w-full outline-none text-dark placeholder-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              onBlur={() => setTimeout(() => setShowSearch(false), 180)}
            />
          </div>
          {showSearch && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white shadow-xl border border-border z-50 rounded-b overflow-hidden">
              {searchResults.map((p) => (
                <button
                  key={p.productId}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface text-left"
                  onMouseDown={() => navigate(`/product/${p.slug}`)}
                >
                  <img
                    src={p.primaryImage || '/placeholder-product.jpg'}
                    alt={p.name}
                    className="w-9 h-11 object-cover rounded bg-surface flex-shrink-0"
                    onError={(e) => { e.target.src = '/placeholder-product.jpg' }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">{p.name}</p>
                    <p className="text-xs text-muted">{p.brandName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-0.5 ml-2">
          {/* Profile */}
          <div className="relative">
            <button
              className="flex flex-col items-center px-3 py-1.5 hover:text-primary transition-colors min-w-[52px]"
              onClick={() => isAuthenticated ? setShowUserMenu(!showUserMenu) : signInWithRedirect()}
            >
              <User size={20} />
              <span className="text-[11px] mt-0.5 font-semibold truncate max-w-[52px]">
                {isAuthenticated ? username : 'Login'}
              </span>
            </button>
            {showUserMenu && isAuthenticated && (
              <div className="absolute right-0 top-full mt-0 bg-white shadow-xl border border-border rounded w-52 z-50 py-1">
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-xs text-muted">Hello,</p>
                  <p className="text-sm font-bold text-dark truncate">{username}</p>
                </div>
                <Link to="/account" onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface hover:text-primary">
                  <User size={14} /> My Profile
                </Link>
                <Link to="/orders" onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface hover:text-primary">
                  <Package size={14} /> My Orders
                </Link>
                <Link to="/wishlist" onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface hover:text-primary">
                  <Heart size={14} /> My Wishlist
                </Link>
                <div className="border-t border-border mt-1">
                  <button
                    onClick={() => { signOut(); setShowUserMenu(false) }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className="flex flex-col items-center px-3 py-1.5 hover:text-primary transition-colors relative min-w-[52px]">
            <Heart size={20} />
            <span className="text-[11px] mt-0.5 font-semibold">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute top-0.5 right-2 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Bag */}
          <button
            onClick={openCart}
            className="flex flex-col items-center px-3 py-1.5 hover:text-primary transition-colors relative min-w-[52px]"
          >
            <ShoppingBag size={20} />
            <span className="text-[11px] mt-0.5 font-semibold">Bag</span>
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-2 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}