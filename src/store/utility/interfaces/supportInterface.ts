export interface ImageDto {
  id?: string;
  fileName?: string;
  fileType?: string;
  url?: string;
  fileSize?: string;
  publicId?: string;
}

export interface ProblemInterface {
  id?: number;
  name: string;
  description: string;
  type: number; // integer(int32) حسب الـ API
  phoneNumber: string;
  email: string;
  image?: string; // string(binary) - optional
  imageId?: string; // string(Guid) - optional
  imageDto?: ImageDto; // كائن الصورة - optional
}

export enum ProblemType {
  TechSupport = 0,
  Account = 1,
  Other = 2,
  Suggestion = 3,
  Bug = 4,
}