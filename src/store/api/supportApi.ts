import { setError, setLoading, setSuccess } from '../slice/supportSlice';
import api from '../utility/api/api';
import { CreateProblemApiResponse, CreateProblemRequest } from '../utility/interfaces/supportInterface';

export const createProblem = (problemData: CreateProblemRequest) => async (dispatch: any) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  
  try {
    console.log('Sending support request:', problemData);
    
    // تحويل أسماء الحقول لتتطابق مع ما يتوقعه الخادم
    const apiData = {
      Name: problemData.name,
      Email: problemData.email,
      PhoneNumber: problemData.phone || '',
      Category: problemData.category,
      Description: problemData.description,
      Image: problemData.image || ''
    };
    
    console.log('API formatted data:', apiData);
    
    const response = await api.post('/Problem/create-problem', apiData);
    
    console.log('Support API response:', response.data);
    
    // التحقق من نجاح العملية باستخدام البيانات الحقيقية
    const apiResponse: CreateProblemApiResponse = response.data;
    
    if (apiResponse.isSuccess && (apiResponse.statusCode === 200 || apiResponse.statusCode === 201)) {
      const successData = {
        success: true,
        message: apiResponse.message,
        problemId: apiResponse.result.id,
        result: apiResponse.result
      };
      
      console.log('Problem created successfully:', successData);
      dispatch(setSuccess(successData));
      return { success: true, data: successData };
    } else {
      throw new Error(apiResponse.message || 'Failed to submit problem');
    }
  } catch (error: any) {
    console.error('Support API error:', error);
    
    let errorMessage = 'Failed to submit support request';
    
    // التعامل مع أنواع مختلفة من الأخطاء
    if (error.response) {
      const responseData = error.response.data;
      
      // إذا كان الخادم يرد بنفس الشكل حتى للأخطاء
      if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      } else if (responseData?.title) {
        errorMessage = responseData.title;
      } else if (responseData?.errors) {
        // معالجة validation errors
        const validationErrors = responseData.errors;
        const errorMessages = [];
        
        for (const field in validationErrors) {
          if (validationErrors[field] && Array.isArray(validationErrors[field])) {
            errorMessages.push(...validationErrors[field]);
          }
        }
        
        errorMessage = errorMessages.join('\n') || 'Validation failed';
      } else if (typeof responseData === 'string') {
        errorMessage = responseData;
      } else {
        errorMessage = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      // الطلب تم إرساله لكن لم يتم الحصول على رد
      errorMessage = 'Network error: Unable to connect to server';
    } else if (error.message) {
      // خطأ في إعداد الطلب
      errorMessage = error.message;
    }
    
    dispatch(setError(errorMessage));
    return { success: false, error: errorMessage };
  } finally {
    dispatch(setLoading(false));
  }
};

// يمكن إضافة APIs أخرى هنا مستقبلاً مثل:
// - جلب قائمة المشاكل المرسلة
// - جلب تفاصيل مشكلة معينة
// - إرسال رسالة متابعة

export const supportApi = {
  createProblem
}; 