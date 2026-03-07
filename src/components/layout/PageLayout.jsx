import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '../cart/CartDrawer'
import { useCartStore } from '../../store/cartStore'

export default function PageLayout() {
  const { isOpen, closeCart } = useCartStore()
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 mt-[56px]">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer isOpen={isOpen} onClose={closeCart} />
    </div>
  )
}