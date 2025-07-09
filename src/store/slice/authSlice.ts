import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IRegisterUser, UserRole } from "../utility/interfaces/authInterface";

interface IAuthModel {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    phoneNumber?: string;
    isCompany?: boolean;
    isMarketer?: boolean;
    createdAt?: string;
    updatedAt?: string;
  } | null;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  authModel: IAuthModel | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  authModel: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<IAuthModel>) => {
      state.authModel = action.payload;
      state.loading = false;
      state.error = null;

      // حفظ في AsyncStorage
      AsyncStorage.setItem("authModelAdmin", JSON.stringify(action.payload)).catch(console.error);
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    logout: (state) => {
      state.authModel = null;
      state.loading = false;
      state.error = null;

      // إزالة من AsyncStorage
      AsyncStorage.removeItem("authModelAdmin").catch(console.error);
    },

    login: (state, action: PayloadAction<{ email: string; password: string }>) => {
      state.loading = true;
      state.error = null;
    },

    register: (state, action: PayloadAction<IRegisterUser>) => {
      state.loading = true;
      state.error = null;
    },

    // لجلب البيانات من التخزين عند تشغيل التطبيق
    loadAuthFromStorage: (state, action: PayloadAction<IAuthModel | null>) => {
      state.authModel = action.payload;
    }
  },
});

export const {
  setAuthState,
  setLoading,
  setError,
  logout,
  login,
  register,
  loadAuthFromStorage
} = authSlice.actions;

export default authSlice.reducer;
