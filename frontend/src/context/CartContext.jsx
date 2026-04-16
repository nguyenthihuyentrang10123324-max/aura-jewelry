import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [], total: 0, itemCount: 0 });
      return;
    }
    try {
      const res = await cartAPI.getCart();
      if (res.data.success) {
        setCart({
          items: res.data.data.items || [],
          total: res.data.data.subtotal || 0,
          itemCount: res.data.data.itemCount || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1, options = {}) => {
    try {
      const res = await cartAPI.addToCart({ 
        product_id: productId, 
        quantity,
        material: options.material,
        size: options.size
      });
      if (res.data.success) {
        setCart({
          items: res.data.data.items || [],
          total: res.data.data.subtotal || 0,
          itemCount: res.data.data.itemCount || 0,
        });
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi' };
    }
  };

  const updateCart = async (productId, quantity) => {
    try {
      const res = await cartAPI.updateCart(productId, { quantity });
      if (res.data.success) {
        setCart({
          items: res.data.data.items || [],
          total: res.data.data.subtotal || 0,
          itemCount: res.data.data.itemCount || 0,
        });
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Lỗi' };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await cartAPI.removeFromCart(productId);
      if (res.data.success) {
        setCart({
          items: res.data.data.items || [],
          total: res.data.data.subtotal || 0,
          itemCount: res.data.data.itemCount || 0,
        });
        return { success: true };
      }
    } catch (error) {
      return { success: false };
    }
  };

  const clearCart = () => {
    setCart({ items: [], total: 0, itemCount: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCart, removeFromCart, clearCart, refetch: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
