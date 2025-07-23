// البيانات المحلية في النموذج
export interface CreateProblemRequest {
  name: string;
  email: string;
  phone?: string;
  category: string;
  description: string;
  image?: string; // base64 string if image is provided
}

// البيانات المرسلة للـ API (بأسماء الحقول الصحيحة)
export interface CreateProblemApiData {
  Name: string;
  Email: string;
  PhoneNumber?: string;
  Category: string;
  Description: string;
  Image?: string;
}

// بيانات المشكلة المُنشأة من الخادم
export interface ProblemResult {
  id: number;
  name: string;
  description: string;
  type: number; // 0 = مستخدم عادي
  phoneNumber: string;
  email: string;
  image: string | null;
  imageId: string | null;
}

// استجابة الخادم الكاملة
export interface CreateProblemApiResponse {
  message: string;
  isSuccess: boolean;
  statusCode: number;
  result: ProblemResult;
}

// استجابة محلية مبسطة
export interface CreateProblemResponse {
  success: boolean;
  message: string;
  problemId?: number;
  result?: ProblemResult;
}

export interface SupportState {
  loading: boolean;
  error: string | null;
  success: boolean;
  lastSubmittedProblem?: CreateProblemResponse;
} 