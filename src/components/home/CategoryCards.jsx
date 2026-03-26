import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRootCategories } from '../../api/categoryApi'
import { Skeleton } from '../common/Skeleton'

const FALLBACK_IMAGES = {
  men: '/images/categories/men.jpg',
  women: '/images/categories/women.jpg',
  kids: '/images/categories/Kids.jpg',
  accessories: '/images/categories/accessories.jpg',
  footwear: '/images/categories/Footwear.jpg',
}

export default function CategoryCards() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRootCategories()
      .then(r => setCategories(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-8">
      <h2 className="text-lg font-bold text-dark uppercase tracking-wide mb-5">Shop by Category</h2>
      <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center gap-2">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))
          : categories.map((cat) => (
            <Link
              key={cat.categoryId}
              to={`/category/${cat.slug}`}
              className="flex-shrink-0 flex flex-col items-center group"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all bg-surface mb-2">
                <img
                  src={cat.image || FALLBACK_IMAGES[cat.slug] || '/images/categories/accessories.jpg'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => { e.target.src = '/images/categories/accessories.jpg' }}
                />
              </div>
              <span className="text-xs font-bold text-dark group-hover:text-primary uppercase tracking-wide whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))
        }
      </div>
    </section>
  )
}