export default interface IShippingTax {
  id: number;
  userType: number;
  lowerLimit: number;
  upperLimit: number;
  shippingPrice: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
} 