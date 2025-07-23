export default interface ICommition {
  id: number;
  userType: number;
  lowerLimit: number;
  upperLimit: number;
  commissionRate: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
} 