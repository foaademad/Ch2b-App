import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import cartReducer from './slice/cartSlice';
import categoryReducer from './slice/categorySlice';
import imageSearchReducer from './slice/imageSearchSlice';
import productReducer from './slice/productSlice';
import wishlistReducer from './slice/wishlistSlice';
import profileReducer from './slice/profileSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    imageSearch: imageSearchReducer,
    profile: profileReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 