export interface CouponDto {
  id: number;
  code: string;
  discount: number;
  createAt: string;
  endData: string;
  description: string;
  minimumPrice: number;
  maximumPrice: number;
  isActived: boolean;
  isExpired: boolean;
}

export interface CouponsResponse {
  message: string;
  isSuccess: boolean;
  statusCode: number;
  result: CouponDto[];
}

export interface AppliedCoupon {
  id: number;
  code: string;
  discount: number;
  discountAmount: number;
  minimumPrice: number;
  maximumPrice: number;
  description: string;
} 