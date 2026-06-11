import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCart } from './useCart'
import { db } from '../data/db'

const firstProduct = db[0]
const secondProduct = db[1]

describe('useCart', () => {
  it('starts with an empty cart and exposes the product catalog', () => {
    const { result } = renderHook(() => useCart())

    expect(result.current.cart).toEqual([])
    expect(result.current.data).toHaveLength(db.length)
  })

  it('adds a new product with quantity 1', () => {
    const { result } = renderHook(() => useCart())

    act(() => result.current.addToCart(firstProduct))

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0]).toMatchObject({
      id: firstProduct.id,
      name: firstProduct.name,
      quantity: 1,
    })
  })

  it('increments the quantity instead of duplicating an existing product', () => {
    const { result } = renderHook(() => useCart())

    act(() => result.current.addToCart(firstProduct))
    act(() => result.current.addToCart(firstProduct))

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].quantity).toBe(2)
  })

  it('does not mutate the original product object in the catalog', () => {
    const { result } = renderHook(() => useCart())

    act(() => result.current.addToCart(firstProduct))

    // El item del catálogo nunca debería recibir la propiedad `quantity`.
    expect(firstProduct).not.toHaveProperty('quantity')
  })

  it('removes a product from the cart', () => {
    const { result } = renderHook(() => useCart())

    act(() => result.current.addToCart(firstProduct))
    act(() => result.current.addToCart(secondProduct))
    act(() => result.current.removeFromCart(firstProduct.id))

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].id).toBe(secondProduct.id)
  })

  it('increases the quantity of a product', () => {
    const { result } = renderHook(() => useCart())

    act(() => result.current.addToCart(firstProduct))
    act(() => result.current.increaseQuantity(firstProduct.id))

    expect(result.current.cart[0].quantity).toBe(2)
  })

  it('decreases the quantity but never below 1', () => {
    const { result } = renderHook(() => useCart())

    act(() => result.current.addToCart(firstProduct))
    act(() => result.current.increaseQuantity(firstProduct.id)) // qty = 2
    act(() => result.current.decreaseQuantity(firstProduct.id)) // qty = 1
    act(() => result.current.decreaseQuantity(firstProduct.id)) // stays at 1

    expect(result.current.cart[0].quantity).toBe(1)
  })

  it('empties the whole cart', () => {
    const { result } = renderHook(() => useCart())

    act(() => result.current.addToCart(firstProduct))
    act(() => result.current.addToCart(secondProduct))
    act(() => result.current.removeAllCart())

    expect(result.current.cart).toEqual([])
  })

  it('persists the cart to localStorage', () => {
    const { result } = renderHook(() => useCart())

    act(() => result.current.addToCart(firstProduct))

    const stored = JSON.parse(localStorage.getItem('cart'))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(firstProduct.id)
  })

  it('restores the cart from localStorage on mount', () => {
    localStorage.setItem(
      'cart',
      JSON.stringify([{ ...secondProduct, quantity: 3 }]),
    )

    const { result } = renderHook(() => useCart())

    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0]).toMatchObject({
      id: secondProduct.id,
      quantity: 3,
    })
  })
})
