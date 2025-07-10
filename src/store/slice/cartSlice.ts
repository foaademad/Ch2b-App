import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItemDto } from "../utility/interfaces/cartInterface";

interface ICartState {
  items: CartItemDto[];
  isLoading: boolean;
  error: string | null;
  totalItems: number;
    
  totalPrice: number;

}

const initialState: ICartState = {
  items: [],
  isLoading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0,
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCartItems: (state, action: PayloadAction<CartItemDto[] | any>) => {
      // Handle case where payload might not be an array
      const items = Array.isArray(action.payload) ? action.payload : [];
      state.items = items;
      state.totalItems = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      state.totalPrice = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    },
    addToCart: (state, action: PayloadAction<CartItemDto>) => {
      const existingItem = state.items.find(item => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + (action.payload.quantity || 1);
        existingItem.totalPrice =
          (existingItem.totalPrice || 0) + (action.payload.totalPrice || 0);
      } else {
        state.items.push(action.payload);
      }
      state.totalItems = state.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + (item.totalPrice || 0),
        0
      );
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id?.toString() !== action.payload);
      state.totalItems = state.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      state.totalPrice = state.items.reduce(
        (sum, item) => sum + (item.totalPrice || 0),
        0
      );
    },
    updateCartItem: (state, action: PayloadAction<CartItemDto>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        state.totalItems = state.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        state.totalPrice = state.items.reduce(
          (sum, item) => sum + (item.totalPrice || 0),
          0
        );
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
    },
  },
});

export const { setLoading, setError, setCartItems, addToCart, removeFromCart, updateCartItem, clearCart } = CartSlice.actions;

export default CartSlice.reducer;
