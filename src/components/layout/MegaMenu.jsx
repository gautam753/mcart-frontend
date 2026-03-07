import { Link } from 'react-router-dom'

export default function MegaMenu({ category, onMouseEnter, onMouseLeave }) {
  const subs = category.subcategories || []
  if (!subs.length) return null

  return (
    <div
      className="absolute top-full left-0 bg-white shadow-xl border-t-2 border-primary z-50 p-6 min-w-[480px]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${Math.min(subs.length, 4)}, minmax(110px, 1fr))` }}
      >
        {subs.map((sub) => (
          <div key={sub.categoryId}>
            <Link
              to={`/category/${sub.slug}`}
              className="block text-sm font-bold text-dark uppercase mb-3 hover:text-primary tracking-wide"
            >
              {sub.name}
            </Link>
            {(sub.subcategories || []).map((child) => (
              <Link
                key={child.categoryId}
                to={`/category/${child.slug}`}
                className="block text-sm text-muted hover:text-primary py-0.5"
              >
                {child.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}