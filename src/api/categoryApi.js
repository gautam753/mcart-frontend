import { apiGet } from './apiHelper'

export const getAllCategories = () => apiGet('/categories')
export const getCategoryTree = () => apiGet('/categories/tree')
export const getRootCategories = () => apiGet('/categories/root')
export const getCategoryById = (id) => apiGet(`/categories/${id}`)
export const getCategoryBySlug = (slug) => apiGet(`/categories/slug/${slug}`)
export const getSubcategories = (id) => apiGet(`/categories/${id}/subcategories`)