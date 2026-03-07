import { apiGet, apiPost, apiDelete } from './apiHelper'

export const addMapping = (categoryId, productId) =>
  apiPost('/product-category-mapping', null, { params: { categoryId, productId } })

export const removeMapping = (categoryId, productId) =>
  apiDelete('/product-category-mapping', { params: { categoryId, productId } })

export const isProductInCategory = (productId, categoryId) =>
  apiGet('/product-category-mapping/check', { params: { productId, categoryId } })

export const getCategoriesForProduct = (productId) =>
  apiGet(`/product-category-mapping/product/${productId}/categories`)

export const getProductsInCategory = (categoryId) =>
  apiGet(`/product-category-mapping/category/${categoryId}/products`)