import { useState, useEffect } from "react"
import { toast } from 'react-toastify'
import { db } from "../data/db"

export const useCart = () => {
    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
    
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)
    
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    },[cart])
    
    function addToCart(item) {
        const itemExists = cart.findIndex((cartItem)=> cartItem.id === item.id)
    
        if (itemExists === -1) {
            // Copia el item para no mutar el objeto original de la "base de datos"
            setCart([...cart, { ...item, quantity: 1 }])
            toast.success('Producto agregado al carrito')
        } else {
            const newCart = [...cart]
            newCart[itemExists].quantity = (newCart[itemExists].quantity || 1) + 1
            setCart(newCart)
            toast.info('Cantidad actualizada')
        }
    }
    
    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(cartItem => cartItem.id !== id))
        toast.error('Producto eliminado del carrito')
    }
    
    function increaseQuantity(id) {
        const updateCart = cart.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updateCart)
        toast.info('Cantidad incrementada')
    }
    
    function decreaseQuantity(id) {
        const updateCart = cart.map(item => {
            if ((item.id === id) && (item.quantity > 1)) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updateCart)
        toast.info('Cantidad reducida')
    }
    
    function removeAllCart() {
        setCart([])
        toast.error('Carrito vaciado')
    }

    return {
        data,
        cart,
        addToCart,
        removeAllCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
    }
}