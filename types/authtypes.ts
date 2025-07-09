export type UserRole = "user" | "marketer" | "company" ;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
}
