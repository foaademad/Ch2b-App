import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderState } from '../utility/interfaces/orderInterface';

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Set success state
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
      state.loading = false;
    },
    
    // Add new order
    addOrderSuccess: (state, action: PayloadAction<any>) => {
      state.currentOrder = action.payload;
      state.orders.unshift(action.payload); // Add to beginning of array
      state.success = true;
      state.loading = false;
      state.error = null;
    },
    
    // Set orders list
    setOrders: (state, action: PayloadAction<any[]>) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Clear current order
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    
    // Clear success state
    clearSuccess: (state) => {
      state.success = false;
    },
    
    // Clear error state
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset order state
    resetOrderState: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  setLoading,
  setError,
  setSuccess,
  addOrderSuccess,
  setOrders,
  clearCurrentOrder,
  clearSuccess,
  clearError,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer; 