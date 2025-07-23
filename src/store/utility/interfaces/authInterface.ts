export type UserRole = "user" | "marketer" | "company" ;
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
 
  
}
export interface FileData {
  uri?: string; 
  name: string;
  type?: string;
}
export interface CompanyDetails {
  address: string;
  businessRegNumber: string;
  companyImage?: {
    uri: string;
    name: string;
    type: string;
  };
}

// =-===============================================


export interface IAuthModel {
  isAuthenticated: boolean;
  user: {
    
  } | null;
  result?: {
    isAuthenticated: boolean;
    userId: string;
    token: string;
    refreshToken?: string;
    refreshTokenExpiresOn?: string;
    userType: number; // 0=user, 1=marketer, 2=admin
  };
}

export interface IAuthState {
  authModel: IAuthModel | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRegistered: boolean;
  error: string | null;
  forgetPasswordSend: boolean | null;
  resetPassword: boolean | null;
  resendConfirmationEmail: boolean | null;
  emailConfirmed: boolean;
  checkAccess: boolean;
}

export interface IBasicDataUser {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  isComapny: boolean;
  isMarketer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterUser extends IBasicDataUser {
  password: string;
  confirmPassword: string;
  isComanyOrShop: boolean;
  CommercialRegister: File;
  location: string;
}

export interface IResetPassword {
  email: string;
  token: string;
  newPassword: string;
  confirmPassword: string;
}