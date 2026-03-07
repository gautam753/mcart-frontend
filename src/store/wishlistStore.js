import { create } from 'zustand'

export const useWishlistStore = create((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
  removeItem: (productId) =>
    set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
  isInWishlist: (productId) =>
    get().items.some((i) => i.productId === productId),
}))