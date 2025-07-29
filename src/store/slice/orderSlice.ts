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
    
    // تحديث حالة طلب في القائمة
    updateOrderInList: (state, action: PayloadAction<{ orderId: string; orderStatus: number }>) => {
      const { orderId, orderStatus } = action.payload;
      const orderIndex = state.orders.findIndex(order => 
        order.id === orderId || order.orderId === orderId
      );
      
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = orderStatus;
        console.log('✅ Order status updated in list:', { orderId, orderStatus });
      } else {
        console.warn('⚠️ Order not found in list for update:', orderId);
      }
    },

    // paid by paypal
    paidByPaypal: (state, action: PayloadAction<{ orderId: string }>) => {
      const { orderId } = action.payload;
      const orderIndex = state.orders.findIndex(order => 
        order.id === orderId || order.orderId === orderId
      );
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = 2;
        console.log('✅ Order status updated in list:', { orderId });
      } else {
        console.warn('⚠️ Order not found in list for update:', orderId);
      }
    },

    // pay by account bank
    payByAccountBank: (state, action: PayloadAction<{ orderId: string }>) => {
      const { orderId } = action.payload;
      const orderIndex = state.orders.findIndex(order => 
        order.id === orderId || order.orderId === orderId
      );
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
  updateOrderInList,
  paidByPaypal,
} = orderSlice.actions;

export default orderSlice.reducer; 