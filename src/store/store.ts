import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import categoryReducer from './slice/categorySlice';
import productReducer from './slice/productSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 