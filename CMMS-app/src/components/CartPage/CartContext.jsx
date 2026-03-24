import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../Api';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartChanges, setCartChanges] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCartSync = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/cart/check/');
            if (res.data) {
                const mapped = (res.data.cart || []).map(c => ({
                    id: c.id,
                    itemId: c.item?.id || c.item_id || c.item,
                    name: c.item?.name || c.item_name || 'Extra Item',
                    price: c.item?.cost || c.item_cost || c.cost || c.price || 0,
                    quantity: c.quantity || 1,
                    availableCount: c.available_count || 0,
                    hall: c.item?.hall?.name || c.item?.hall_name || 'Hall'
                }));
                setCartItems(mapped);
                setCartChanges(res.data.changes || []);
            }
        } catch (err) {
            console.error("Cart sync failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // Initial sync
    useEffect(() => {
        fetchCartSync();
    }, []);

    const addToCart = async (item) => {
        try {
            await api.post('/api/cart/add/', { item_id: item.itemId || item.id, quantity: 1 });
            await fetchCartSync();
        } catch (err) {
            console.error("Failed to add to cart:", err);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await api.post('/api/cart/delete/', { item_id: itemId });
            await fetchCartSync();
        } catch (err) {
            console.error("Failed to remove from cart:", err);
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartTotal = cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            cartChanges,
            addToCart,
            removeFromCart,
            clearCart,
            cartTotal,
            cartCount,
            fetchCartSync,
            loading
        }}>
            {children}
        </CartContext.Provider>
    );
};
