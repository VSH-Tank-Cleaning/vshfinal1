'use client'

import { createContext, useContext, useMemo, useState } from 'react'

type CartItem = { id: string; name: string; price: number; qty: number }
type CartApi = { items: CartItem[]; count: number; total: number; add: (item: Omit<CartItem, 'qty'>) => void; decrement: (id: string) => void; remove: (id: string) => void; clear: () => void }
const CartContext = createContext<CartApi | null>(null)
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const api = useMemo<CartApi>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.qty, 0),
    total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
    add: (item) => setItems((current) => current.some((entry) => entry.id === item.id) ? current.map((entry) => entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry) : [...current, { ...item, qty: 1 }]),
    decrement: (id) => setItems((current) => current.flatMap((item) => item.id !== id ? [item] : item.qty > 1 ? [{ ...item, qty: item.qty - 1 }] : [])),
    remove: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clear: () => setItems([]),
  }), [items])
  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
