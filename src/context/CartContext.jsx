import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('amp3d_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem('amp3d_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, customizationData = null) => {
    setCartItems(prev => {
      // If no customization, try to stack with existing non-customized product
      if (!customizationData) {
        const existing = prev.find(i => i._id === product._id && !i.customizationData);
        if (existing) {
          return prev.map(i =>
            i.cartItemId === existing.cartItemId ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
      }
      
      // Parse numeric price
      const numericPrice = typeof product.price === 'string'
        ? parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0
        : product.price;

      // Create a unique cart item ID so multiple custom versions of the same product don't merge
      const cartItemId = `${product._id}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

      return [...prev, { 
        ...product, 
        cartItemId,
        quantity: 1, 
        priceNum: numericPrice,
        customizationData 
      }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(i => i.cartItemId !== cartItemId && i._id !== cartItemId)); // Fallback for old items
  };

  const updateQty = (cartItemId, qty) => {
    if (qty < 1) { removeFromCart(cartItemId); return; }
    setCartItems(prev =>
      prev.map(i => (i.cartItemId === cartItemId || i._id === cartItemId) ? { ...i, quantity: qty } : i)
    );
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + (i.priceNum || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal,
      addToCart, removeFromCart, updateQty, clearCart,
      isCartOpen, setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
