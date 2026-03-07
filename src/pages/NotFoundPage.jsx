import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 py-16">
      <p className="text-[120px] font-black text-surface leading-none select-none">404</p>
      <h1 className="text-2xl font-bold text-dark mt-2">Oops! Page Not Found</h1>
      <p className="text-muted mt-2 mb-8 text-sm max-w-sm">
        The page you were looking for doesn't exist or may have moved.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="bg-primary text-white px-8 py-3 font-bold text-sm hover:bg-primary-dark transition-colors">
          GO TO HOMEPAGE
        </Link>
        <Link to="/category/new-arrivals" className="border border-dark text-dark px-8 py-3 font-bold text-sm hover:bg-surface transition-colors">
          EXPLORE PRODUCTS
        </Link>
      </div>
    </div>
  )
}