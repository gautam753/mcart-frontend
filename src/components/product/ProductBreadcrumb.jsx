import { useState, useEffect } from 'react'
import Breadcrumb from '../common/Breadcrumb'
import { getCategoriesForProduct } from '../../api/mappingApi'
import { getCategoryById } from '../../api/categoryApi'

export default function ProductBreadcrumb({ productId, productName }) {
  const [crumbs, setCrumbs] = useState([{ label: 'Home', href: '/' }])

  useEffect(() => {
    if (!productId) return
    getCategoriesForProduct(productId)
      .then(async (r) => {
        const ids = r.data || []
        if (!ids.length) return
        const catRes = await getCategoryById(ids[0])
        const cat = catRes.data
        const items = [{ label: 'Home', href: '/' }]
        if (cat.parentCategoryId) {
          try {
            const parentRes = await getCategoryById(cat.parentCategoryId)
            items.push({ label: parentRes.data.name, href: `/category/${parentRes.data.slug}` })
          } catch (_) {}
        }
        items.push({ label: cat.name, href: `/category/${cat.slug}` })
        items.push({ label: productName })
        setCrumbs(items)
      })
      .catch(() => {})
  }, [productId, productName])

  return <Breadcrumb items={crumbs} />
}