import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

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
  // استخدام Redux store بدلاً من state محلي
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.wishlist);
  
  // تحويل البيانات من Redux إلى التنسيق المطلوب
  const cart: Product[] = Array.isArray(cartItems) ? cartItems.map(item => ({
    id: typeof item.productId === 'string' ? parseInt(item.productId) || 0 : (item.productId || 0),
    name: item.title || '',
    price: item.totalPrice || 0,
    image: item.image || '',
    rating: 0,
    reviews: 0,
    quantity: item.quntity || 1
  })) : [];

  const wishlist: Product[] = Array.isArray(wishlistItems) ? wishlistItems.flatMap(favorite => {
    console.log("Processing favorite:", favorite);
    if (favorite && favorite.favoriteItems && Array.isArray(favorite.favoriteItems)) {
      return favorite.favoriteItems.map(item => ({
        id: typeof item.productId === 'string' ? parseInt(item.productId) || 0 : (item.productId || 0),
        name: item.title || '',
        price: item.totalPrice || 0,
        image: item.image || '',
        rating: 0,
        reviews: 0,
        quantity: 1
      }));
    }
    return [];
  }) : [];

  const cartCount = cart.length;
  const wishlistCount = wishlist.length;

  // هذه الدوال ستكون فارغة لأن Redux يتعامل مع العمليات
  const addToCart = (product: Product, quantity?: number) => {
    // سيتم التعامل معها من خلال Redux actions
  };

  const removeFromCart = (productId: string) => {
    // سيتم التعامل معها من خلال Redux actions
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    // سيتم التعامل معها من خلال Redux actions
  };

  const addToWishlist = (product: Product) => {
    // سيتم التعامل معها من خلال Redux actions
  };

  const removeFromWishlist = (productId: number) => {
    // سيتم التعامل معها من خلال Redux actions
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    // سيتم التعامل معها من خلال Redux actions
  };

  const clearCart = () => {
    // سيتم التعامل معها من خلال Redux actions
  };

  const addToOrderHistory = (order: Order) => {
    // سيتم التعامل معها من خلال Redux actions
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
        orderHistory: [],
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