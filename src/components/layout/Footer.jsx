import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const COL = [
  { title: 'Online Shopping', links: ['Men', 'Women', 'Kids', 'Home & Living', 'Beauty', 'Gift Cards'] },
  { title: 'Customer Policies', links: ['Contact Us', 'FAQ', 'T&C', 'Terms Of Use', 'Privacy Policy', 'Grievance Redressal'] },
  { title: 'Useful Links', links: ['Blog', 'Careers', 'Press', 'API'] },
]

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {COL.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-4">{col.title}</p>
              {col.links.map((l) => (
                <Link key={l} to="/" className="block text-sm text-dark hover:text-primary py-1">{l}</Link>
              ))}
            </div>
          ))}
          <div>
            <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-4">Keep in Touch</p>
            <div className="flex gap-3 mb-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <Icon key={i} size={20} className="text-dark hover:text-primary cursor-pointer transition-colors" />
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-bold text-muted uppercase tracking-wider mb-4">Experience MCart App</p>
            <div className="space-y-2">
              <div className="bg-dark text-white rounded px-4 py-2 text-xs text-center font-semibold cursor-pointer hover:bg-gray-800">
                ▶ Google Play
              </div>
              <div className="bg-dark text-white rounded px-4 py-2 text-xs text-center font-semibold cursor-pointer hover:bg-gray-800">
                🍎 App Store
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4 text-xs text-muted">
            {['100% Original', '30-Day Returns', 'Free Delivery over ₹499'].map((t) => (
              <span key={t} className="flex items-center gap-1">✓ {t}</span>
            ))}
          </div>
          <p className="text-xs text-muted">© {new Date().getFullYear()} MCart Commerce Pvt. Ltd.</p>
        </div>
      </div>
    </footer>
  )
}