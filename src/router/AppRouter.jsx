import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageLayout from '../components/layout/PageLayout'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/HomePage'
import PLPPage from '../pages/PLPPage'
import PDPPage from '../pages/PDPPage'
import CartPage from '../pages/CartPage'
import WishlistPage from '../pages/WishlistPage'
import AccountPage from '../pages/AccountPage'
import SkuSearchPage from '../pages/SkuSearchPage'
import OrdersPage from '../pages/OrdersPage'
import OrderDetailPage from '../pages/OrderDetailPage'
import OrderConfirmationPage from '../pages/OrderConfirmationPage'
import CheckoutPage from '../pages/CheckoutPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:slug" element={<PLPPage />} />
          <Route path="/product/:slug" element={<PDPPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/sku/:sku" element={<SkuSearchPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:orderId" element={<OrderDetailPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}