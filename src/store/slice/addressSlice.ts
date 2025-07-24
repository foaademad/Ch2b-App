import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAddress, IAddressState } from "../utility/interfaces/addressInterface";

const initialState: IAddressState = {
  addresses: [],
  loading: false,
  error: null,
  addLoading: false,
  deleteLoading: false,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    // جلب العناوين
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setAddresses: (state, action: PayloadAction<IAddress[]>) => {
      state.addresses = action.payload;
      state.loading = false;
      state.error = null;
    },

    // إضافة عنوان جديد
    setAddLoading: (state, action: PayloadAction<boolean>) => {
      state.addLoading = action.payload;
    },

    addAddress: (state, action: PayloadAction<IAddress>) => {
      state.addresses.push(action.payload);
      state.addLoading = false;
      state.error = null;
    },

    // حذف عنوان
    setDeleteLoading: (state, action: PayloadAction<boolean>) => {
      state.deleteLoading = action.payload;
    },

    deleteAddress: (state, action: PayloadAction<number>) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      state.deleteLoading = false;
      state.error = null;
    },

    // إدارة الأخطاء
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
      state.addLoading = false;
      state.deleteLoading = false;
    },

    // إعادة تعيين الحالة
    resetAddressState: (state) => {
      state.addresses = [];
      state.loading = false;
      state.error = null;
      state.addLoading = false;
      state.deleteLoading = false;
    },
  },
});

export const {
  setLoading,
  setAddresses,
  setAddLoading,
  addAddress,
  setDeleteLoading,
  deleteAddress,
  setError,
  resetAddressState,
} = addressSlice.actions;

export default addressSlice.reducer; 