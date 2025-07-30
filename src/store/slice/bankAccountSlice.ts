import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BankAccount, BankAccountState } from '../utility/interfaces/bankAccountInterface';

const initialState: BankAccountState = {
  bankAccounts: [],
  loading: false,
  error: null,
  success: false,
};

const bankAccountSlice = createSlice({
  name: 'bankAccount',
  initialState,
  reducers: {
    // Set loading state
    setBankAccountsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setBankAccountsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Set success state
    setBankAccountsSuccess: (state, action: PayloadAction<boolean>) => {
      state.success = action.payload;
      state.loading = false;
    },
    
    // Set bank accounts list
    setBankAccounts: (state, action: PayloadAction<BankAccount[]>) => {
      state.bankAccounts = action.payload;
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    
    // Add new bank account
    addBankAccount: (state, action: PayloadAction<BankAccount>) => {
      state.bankAccounts.push(action.payload);
      state.success = true;
      state.loading = false;
      state.error = null;
    },
    
    // Clear success state
    clearBankAccountsSuccess: (state) => {
      state.success = false;
    },
    
    // Clear error state
    clearBankAccountsError: (state) => {
      state.error = null;
    },
    
    // Reset bank account state
    resetBankAccountState: (state) => {
      state.bankAccounts = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  setBankAccountsLoading,
  setBankAccountsError,
  setBankAccountsSuccess,
  setBankAccounts,
  addBankAccount,
  clearBankAccountsSuccess,
  clearBankAccountsError,
  resetBankAccountState,
} = bankAccountSlice.actions;

export default bankAccountSlice.reducer; 