import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { getCategoryBySlug, getSubcategories } from '../api/categoryApi'
import { filterProducts, getFilterOptions } from '../api/productApi'
import { getProductsInCategory } from '../api/mappingApi'
import FilterSidebar from '../components/filters/FilterSidebar'
import ActiveFilterChips from '../components/filters/ActiveFilterChips'
import ProductGrid from '../components/product/ProductGrid'
import Breadcrumb from '../components/common/Breadcrumb'
import { Link } from 'react-router-dom'

const SORT_OPTIONS = [
  { label: 'Recommended', value: '' },
  { label: "What's New", value: 'newest' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Better Discount', value: 'discount_desc' },
]

export default function PLPPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [products, setProducts] = useState([])
  const [filterOptions, setFilterOptions] = useState(null)
  const [filters, setFilters] = useState({})
  const [sortBy, setSortBy] = useState('')
  const [loading, setLoading] = useState(true)
  const [showMobileFilter, setShowMobileFilter] = useState(false)

  // Load category on slug change
  useEffect(() => {
    setLoading(true)
    setProducts([])
    setFilters({})
    getCategoryBySlug(slug)
      .then(async (r) => {
        const cat = r.data
        setCategory(cat)
        const base = { categoryId: cat.categoryId }
        setFilters(base)
        await Promise.allSettled([
          getFilterOptions(cat.categoryId).then(r2 => setFilterOptions(r2.data)),
          getSubcategories(cat.categoryId).then(r3 => setSubcategories(r3.data || [])),
        ])
      })
      .catch(() => setLoading(false))
  }, [slug])

  // Fetch products on filters/sort change
  useEffect(() => {
    if (!filters.categoryId) return
    setLoading(true)
    filterProducts({ ...filters, sortBy, page: 0, size: 40 })
      .then(async (r) => {
        const data = r.data || []
        if (!data.length) {
          // fallback: use category-product mapping
          try {
            await getProductsInCategory(filters.categoryId)
            // If we have product IDs but no products from filter, keep empty (API mismatch)
          } catch (_) {}
        }
        setProducts(data)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [filters, sortBy])

  const handleFilterChange = (newFilters) => {
    setFilters(f => ({ ...newFilters, categoryId: f.categoryId }))
  }

  const crumbs = [
    { label: 'Home', href: '/' },
    ...(category ? [{ label: category.name }] : []),
  ]

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-3">
      <Breadcrumb items={crumbs} />

      {/* Subcategory Tabs */}
      {subcategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-3 border-b border-surface mb-3">
          {subcategories.map(sub => (
            <Link key={sub.categoryId} to={`/category/${sub.slug}`}
              className="flex-shrink-0 px-4 py-1.5 border border-border rounded-full text-xs font-semibold text-dark hover:border-primary hover:text-primary transition-all whitespace-nowrap">
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between py-3 mb-3">
        <div>
          <h1 className="text-base font-bold text-dark uppercase tracking-wide">
            {category?.name} {filterOptions?.productCount ? <span className="text-muted font-normal text-sm">({filterOptions.productCount} items)</span> : ''}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-muted font-medium">Sort by:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="font-bold text-dark border-b border-dark outline-none bg-transparent cursor-pointer text-sm">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <button onClick={() => setShowMobileFilter(true)}
            className="md:hidden flex items-center gap-1.5 text-xs font-bold border border-border px-3 py-2">
            <SlidersHorizontal size={13} /> FILTER
          </button>
        </div>
      </div>

      <ActiveFilterChips filters={filters} onChange={handleFilterChange} />

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <FilterSidebar options={filterOptions} filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Mobile Sidebar Drawer */}
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

        {/* Products */}
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} isLoading={loading} />
        </div>
      </div>
    </div>
  )
}