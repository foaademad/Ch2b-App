// Interface for order item
export interface OrderItem {
  productId: string;
  totalPrice: number;
  quntity: number;
  linkItemUrl: string;
  cartItemId: number;
}

// Interface for coupon data in order
export interface OrderCoupon {
  code: string;
  discount: number;
  createAt: string;
  endData: string;
  description: string;
  minimumPrice: number;
  maximumPrice: number;
  isActived: boolean;
}

// Interface for order request
export interface OrderRequest {
  totalPrice: number;
  totalPriceSAR: number;
  shippingPrice: number;
  tax: number;
  totalTaxWithOutMarkerDiscount: number;
  userId: string;
  orderItems: OrderItem[];
  couponeCode?: OrderCoupon;
  shippingLocationId: number;
}

// Interface for order response
export interface OrderResponse {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  result?: any;
}

// Interface for order state
export interface OrderState {
  orders: any[];
  currentOrder: any | null;
  loading: boolean;
  error: string | null;
  success: boolean;
} 