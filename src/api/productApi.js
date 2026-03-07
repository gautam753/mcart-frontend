import { apiGet } from './apiHelper'

export const getAllProducts = () =>
  apiGet('/products')

export const getProductById = (id) =>
  apiGet(`/products/${id}`)

export const getProductBySlug = (slug) =>
  apiGet(`/products/slug/${slug}`)

export const searchProducts = (q) =>
  apiGet('/products/search', { params: { q } })

export const filterProducts = (filter) =>
  apiGet('/products/filter', { params: filter })

export const getFilterOptions = (categoryId) =>
  apiGet('/products/filter-options', { params: { categoryId } })

export const getProductsByBrand = (brandId) =>
  apiGet(`/products/brand/${brandId}`)