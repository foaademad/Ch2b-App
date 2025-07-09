export interface CategoryDto {
  categoryId: string;
  id?: string; // إضافة id للتوافق مع الكود الموجود
  name: string;
  parentId: string | null;
  children: CategoryDto[];
  products?: any[]; // إضافة products للتوافق مع productInterface
  subCategories?: CategoryDto[]; // إضافة subCategories للتوافق مع productInterface
  nameEn: string;
  nameAr: string;
  imageUrl?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdTime?: Date;
  updatedTime?: Date;
  isTitleManuallyTranslated?: boolean;
  originalTitle?: string;
  // حقول إضافية من الواجهة الأخرى
  providerType?: string;
  isHidden?: boolean;
  isInternal?: boolean;
  isVirtual?: boolean;
  externalId?: string;
}

export interface CategoryApiResponse {
  message: string;
  isSuccess: boolean;
  statusCode: number;
  result: CategoryDto[];
}
