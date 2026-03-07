import { apiGet, apiPost, apiPut, apiDelete } from './apiHelper'

export const getMyAccount = () => apiGet('/users/me')
export const updateMyAccount = (data) => apiPut('/users/me', data)
export const getProfile = () => apiGet('/users/me/profile')
export const saveProfile = (data) => apiPut('/users/me/profile', data)
export const deleteProfile = () => apiDelete('/users/me/profile')
export const getAddresses = () => apiGet('/users/me/addresses')
export const addAddress = (data) => apiPost('/users/me/addresses', data)
export const updateAddress = (id, data) => apiPut(`/users/me/addresses/${id}`, data)
export const deleteAddress = (id) => apiDelete(`/users/me/addresses/${id}`)
export const setDefaultAddress = (id) => apiPut(`/users/me/addresses/${id}/default`)