export interface IAddress {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
  street: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface IAddAddressRequest {
  address: string;
  city: string;
  state: string;
  country: string;
  street: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface IAddressResponse {
  success: boolean;
  data?: IAddress[];
  message?: string;
  error?: string;
}

export interface IAddressState {
  addresses: IAddress[];
  loading: boolean;
  error: string | null;
  addLoading: boolean;
  deleteLoading: boolean;
} 