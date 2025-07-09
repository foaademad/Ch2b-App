import React, { createContext, useContext, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  description?: string;
  category?: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: Product[];
  total: number;
  status: 'Processing' | 'Delivered' | 'Cancelled';
  shippingInfo?: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod?: 'credit' | 'paypal';
  paymentStatus?: 'Paid' | 'Pending' | 'Failed';
}

interface ShopContextType {
  cart: Product[];
  wishlist: Product[];
  cartCount: number;
  wishlistCount: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: () => void;
  orderHistory: Order[];
  addToOrderHistory: (order: Order) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  const addToCart = (product: Product, quantity?: number) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        // If item exists, update its quantity
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: quantity || 1 }
            : item
        );
      }
      // If item doesn't exist, add it with the specified quantity
      return [...prev, { ...product, quantity: quantity || 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id.toString() !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.id.toString() === productId ? { ...item, quantity } : item
    ));
  };

  const addToWishlist = (product: Product) => {
    setWishlist(prev => [...prev, product]);
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist(prev => prev.filter(item => item.id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const addToOrderHistory = (order: Order) => {
    setOrderHistory(prev => [...prev, order]);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        wishlistCount,
        addToCart,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        updateCartItemQuantity,
        toggleWishlist,
        clearCart,
        orderHistory,
        addToOrderHistory
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}; 