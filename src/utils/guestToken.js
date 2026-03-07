import { v4 as uuidv4 } from 'uuid'

const KEY = 'mcart_guest_token'

export const getGuestToken = () => {
  let token = sessionStorage.getItem(KEY)
  if (!token) {
    token = uuidv4()
    sessionStorage.setItem(KEY, token)
  }
  return token
}

export const clearGuestToken = () => sessionStorage.removeItem(KEY)