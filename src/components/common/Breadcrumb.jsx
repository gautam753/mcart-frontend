import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center flex-wrap gap-1 text-xs text-muted py-2">
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1">
          {idx > 0 && <ChevronRight size={11} className="text-border" />}
          {item.href
            ? <Link to={item.href} className="hover:text-primary transition-colors">{item.label}</Link>
            : <span className="text-dark font-semibold">{item.label}</span>
          }
        </span>
      ))}
    </nav>
  )
}