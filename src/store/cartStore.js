import { create } from 'zustand'

export const useCartStore = create((set) => ({
  cart: null,
  isOpen: false,
  setCart: (cart) => set({ cart }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  clearCart: () => set({ cart: null }),
}))