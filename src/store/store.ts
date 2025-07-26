import { configureStore } from '@reduxjs/toolkit';
import addressReducer from './slice/addressSlice';
import authReducer from './slice/authSlice';
import cartReducer from './slice/cartSlice';
import categoryReducer from './slice/categorySlice';
import commitionReducer from './slice/commitionScimaSlice';
import couponReducer from './slice/couponSlice';
import imageSearchReducer from './slice/imageSearchSlice';
import orderReducer from './slice/orderSlice';
import productReducer from './slice/productSlice';
import profileReducer from './slice/profileSlice';
import shippingTaxReducer from './slice/shippingTaxSlice';
import problemReducer from './slice/supportSlice';
import wishlistReducer from './slice/wishlistSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
    coupon: couponReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    imageSearch: imageSearchReducer,
    profile: profileReducer,
    commition: commitionReducer,
    problem: problemReducer,
    address: addressReducer,
    shippingTax: shippingTaxReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 