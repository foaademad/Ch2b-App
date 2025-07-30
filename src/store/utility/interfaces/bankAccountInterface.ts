// Interface for bank account item
export interface BankAccount {
  id: string;
  nameOfBank: string; // Changed from bankName to match API response
  numberOfAccount: string; // Changed from accountNumber to match API response
  nameofAccount: string; // Changed from accountName to match API response
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for bank account response
export interface BankAccountResponse {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  result?: BankAccount[];
}

// Interface for bank account state
export interface BankAccountState {
  bankAccounts: BankAccount[];
  loading: boolean;
  error: string | null;
  success: boolean;
} 