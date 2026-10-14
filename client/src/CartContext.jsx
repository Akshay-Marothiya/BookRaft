
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("cart")) || [];
        } catch {
            return [];
        }
    });

    function updateCart(updatedCart) {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    }

    function addToCart(book) {
        const existing = cart.find(item => item._id === book._id);

        if (existing) {
            updateCart(cart.map(item =>
                item._id === book._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            updateCart([...cart, { ...book, quantity: 1 }]);
        }
    }

    function removeFromCart(bookId) {
        updateCart(cart.filter(item => item._id !== bookId));
    }

    function changeQuantity(bookId, quantity) {
        if (quantity < 1) {
            removeFromCart(bookId);
            return;
        }

        updateCart(cart.map(item =>
            item._id === bookId ? { ...item, quantity } : item
        ));
    }

    function clearCart() {
        updateCart([]);
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            changeQuantity,
            clearCart,
            total
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
