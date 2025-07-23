import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreateProblemResponse, SupportState } from '../utility/interfaces/supportInterface';

const initialState: SupportState = {
  loading: false,
  error: null,
  success: false,
  lastSubmittedProblem: undefined
};

const supportSlice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    // تعيين حالة التحميل
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // تعيين رسالة خطأ
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
      state.success = false;
    },
    // تعيين حالة النجاح
    setSuccess: (state, action: PayloadAction<CreateProblemResponse>) => {
      state.loading = false;
      state.error = null;
      state.success = true;
      state.lastSubmittedProblem = action.payload;
    },
    // إعادة تعيين حالة الدعم
    resetSupportState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.lastSubmittedProblem = undefined;
    },
    // مسح رسالة الخطأ
    clearError: (state) => {
      state.error = null;
    },
    // مسح حالة النجاح
    clearSuccess: (state) => {
      state.success = false;
    }
  }
});

export const { 
  setLoading,
  setError,
  setSuccess,
  resetSupportState, 
  clearError, 
  clearSuccess 
} = supportSlice.actions;

export default supportSlice.reducer; 