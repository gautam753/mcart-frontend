import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronRight } from 'lucide-react'
import { getCategoryBySlug, getSubcategories } from '../api/categoryApi'
import { filterProducts, getFilterOptions } from '../api/productApi'
import { getProductsInCategory } from '../api/mappingApi'
import FilterSidebar from '../components/filters/FilterSidebar'
import ActiveFilterChips from '../components/filters/ActiveFilterChips'
import ProductGrid from '../components/product/ProductGrid'
import Breadcrumb from '../components/common/Breadcrumb'
import { getCategoryImage } from '../utils/categoryImages'

const SORT_OPTIONS = [
  { label: 'Recommended',        value: '' },
  { label: "What's New",         value: 'newest' },
  { label: 'Popularity',         value: 'popularity' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Better Discount',    value: 'discount_desc' },
]

const extractProducts = (data) => {
  if (!data) return []
  if (Array.isArray(data)) return data
  return data?.content ?? data?.items ?? data?.data ?? data?.products ?? []
}

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
]

// ── Subcategory Banner Grid ───────────────────────────────────────────────────
function SubcategoryBanners({ category, subcategories }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="mb-6 pb-4 border-b border-surface">
        <h2 className="text-xl font-black text-dark uppercase tracking-wide">
          Shop {category?.name}
        </h2>
        <p className="text-sm text-muted mt-1">Select a category to explore</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {subcategories.map((sub, idx) => {
          const mappedImage = getCategoryImage(sub.slug)
          const imageUrl    = sub.image || mappedImage || null
          const gradient    = FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length]

          return (
            <Link
              key={sub.categoryId}
              to={`/category/${sub.slug}`}
              className="group relative overflow-hidden rounded-sm border border-border hover:border-primary hover:shadow-card transition-all duration-200"
            >
              {/* Image / Gradient */}
              <div className="relative overflow-hidden" style={{ paddingBottom: '70%' }}>
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={sub.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => {
                        e.target.style.display = 'none'
                        e.target.parentElement.style.background = gradient
                      }}
                    />
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    {/* Name on image */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                      <p className="text-white font-bold text-sm leading-tight drop-shadow-md">
                        {sub.name}
                      </p>
                      {sub.productCount > 0 && (
                        <p className="text-white/75 text-xs mt-0.5">
                          {sub.productCount} items
                        </p>
                      )}
                    </div>
                    {/* Arrow on hover */}
                    <div className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow">
                      <ChevronRight size={13} className="text-dark" />
                    </div>
                  </>
                ) : (
                  /* Gradient fallback */
                  <div className="absolute inset-0 flex items-end" style={{ background: gradient }}>
                    <div className="w-full px-4 py-3 bg-gradient-to-t from-black/40 to-transparent">
                      <p className="text-white font-bold text-sm leading-tight drop-shadow">
                        {sub.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom label row — gradient cards only */}
              {!imageUrl && (
                <div className="flex items-center justify-between px-4 py-2.5 bg-white border-t border-surface">
                  <span className="text-xs text-muted">Explore</span>
                  <ChevronRight
                    size={14}
                    className="text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ── Main PLPPage ──────────────────────────────────────────────────────────────
export default function PLPPage() {
  const { slug } = useParams()

  const [category,         setCategory]         = useState(null)
  const [subcategories,    setSubcategories]    = useState([])
  const [products,         setProducts]         = useState([])
  const [filterOptions,    setFilterOptions]    = useState(null)
  const [filters,          setFilters]          = useState({})
  const [sortBy,           setSortBy]           = useState('')
  const [loading,          setLoading]          = useState(true)
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const [view,             setView]             = useState('loading') // 'loading' | 'banners' | 'products'

  useEffect(() => {
    setLoading(true)
    setView('loading')
    setProducts([])
    setFilters({})
    setFilterOptions(null)
    setSubcategories([])

    getCategoryBySlug(slug)
      .then(async (r) => {
        const cat = r.data
        setCategory(cat)

        const [subsRes, optionsRes] = await Promise.allSettled([
          getSubcategories(cat.categoryId),
          getFilterOptions(cat.categoryId),
        ])

        const subs = subsRes.status === 'fulfilled'
          ? Array.isArray(subsRes.value.data)
            ? subsRes.value.data
            : subsRes.value.data?.subcategories || []
          : []
        setSubcategories(subs)

        if (optionsRes.status === 'fulfilled') {
          setFilterOptions(optionsRes.value.data)
        }

        setFilters({ categoryId: cat.categoryId })
      })
      .catch(() => { setLoading(false); setView('products') })
  }, [slug])

  useEffect(() => {
    if (!filters.categoryId) return
    setLoading(true)

    filterProducts({ ...filters, sortBy, page: 0, size: 40 })
      .then(async (r) => {
        const direct = extractProducts(r.data)

        if (direct.length > 0) {
          setProducts(direct)
          setView('products')
          return
        }

        if (subcategories.length > 0) {
          const hasActiveFilters = Object.keys(filters).some(
            k => k !== 'categoryId' && filters[k] !== undefined
          )

          if (hasActiveFilters) {
            // Filters applied — aggregate from subcategories
            const subResults = await Promise.allSettled(
              subcategories.map(sub =>
                filterProducts({ ...filters, categoryId: sub.categoryId, sortBy, page: 0, size: 20 })
                  .then(res => extractProducts(res.data))
              )
            )
            const unique = Array.from(
              new Map(
                subResults
                  .filter(r => r.status === 'fulfilled')
                  .flatMap(r => r.value)
                  .map(p => [p.productId, p])
              ).values()
            )
            setProducts(unique)
            setView('products')
          } else {
            // No filters — show subcategory banners
            setView('banners')
          }
        } else {
          // Leaf with no products
          setProducts([])
          setView('products')
        }
      })
      .catch(() => { setProducts([]); setView('products') })
      .finally(() => setLoading(false))
  }, [filters, sortBy])

  const handleFilterChange = (newFilters) => {
    setFilters(f => ({ ...newFilters, categoryId: f.categoryId }))
  }

  const hasActiveFilters = Object.keys(filters).some(
    k => k !== 'categoryId' && filters[k] !== undefined
  )

  const crumbs = [
    { label: 'Home', href: '/' },
    ...(category ? [{ label: category.name }] : []),
  ]

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-3">
      <Breadcrumb items={crumbs} />

      {/* Subcategory pill tabs — only in product view */}
      {subcategories.length > 0 && view === 'products' && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-3 border-b border-surface mb-3">
          {subcategories.map(sub => (
            <Link
              key={sub.categoryId}
              to={`/category/${sub.slug}`}
              className="flex-shrink-0 px-4 py-1.5 border border-border rounded-full text-xs font-semibold text-dark hover:border-primary hover:text-primary transition-all whitespace-nowrap"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between py-3 mb-3">
        <div>
          <h1 className="text-base font-bold text-dark uppercase tracking-wide">
            {category?.name}
            {!loading && view === 'products' && products.length > 0 && (
              <span className="text-muted font-normal text-sm ml-2">({products.length} items)</span>
            )}
          </h1>
        </div>

        {view === 'products' && (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="text-muted font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="font-bold text-dark border-b border-dark outline-none bg-transparent cursor-pointer text-sm"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <button
              onClick={() => setShowMobileFilter(true)}
              className="md:hidden flex items-center gap-1.5 text-xs font-bold border border-border px-3 py-2"
            >
              <SlidersHorizontal size={13} /> FILTER
            </button>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <ActiveFilterChips filters={filters} onChange={handleFilterChange} />
      )}

      <div className="flex gap-6">
        {view === 'products' && (
          <div className="hidden md:block">
            <FilterSidebar options={filterOptions} filters={filters} onChange={handleFilterChange} />
          </div>
        )}

        {showMobileFilter && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="bg-black/40 flex-1" onClick={() => setShowMobileFilter(false)} />
            <div className="bg-white w-72 h-full overflow-y-auto p-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-sm uppercase">Filters</p>
                <button onClick={() => setShowMobileFilter(false)} className="text-muted hover:text-dark">
                  <X size={18} />
                </button>
              </div>
              <FilterSidebar options={filterOptions} filters={filters} onChange={handleFilterChange} />
            </div>
          </div>
        )}

        {view === 'loading' && (
          <div className="flex-1 min-w-0">
            <ProductGrid products={[]} isLoading={true} />
          </div>
        )}

        {view === 'banners' && !loading && (
          <SubcategoryBanners category={category} subcategories={subcategories} />
        )}

        {view === 'products' && (
          <div className="flex-1 min-w-0">
            <ProductGrid products={products} isLoading={loading} />
          </div>
        )}
      </div>
    </div>
  )
}
