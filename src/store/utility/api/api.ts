import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { router } from 'expo-router';
import Toast from "react-native-toast-message";
import { logout } from '../../slice/authSlice';
import { store } from '../../store';

const api = axios.create({
  baseURL: "http://localhost:5000/api", 
  headers: {
    "Content-Type": "application/json",
    
  },
  
});

// دالة للحصول على اللغة الحالية
const getCurrentLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem('appLanguage');
    return savedLanguage || 'ar'; // افتراضي عربي
  } catch (error) {
    console.error('Error loading language from AsyncStorage:', error);
    return 'ar';
  }
};

// Interceptor للطلبات
api.interceptors.request.use(
  async (config) => {
    try {
      const authModelString = await AsyncStorage.getItem("authModelAdmin");
      const authModel = authModelString ? JSON.parse(authModelString) : null;

      if (authModel?.result?.token) {
        config.headers.Authorization = `Bearer ${authModel.result.token}`;
      }

      // الحصول على اللغة الحالية
      const language = await getCurrentLanguage();
      config.headers["Accept-Language"] = language;
      
      config.headers["X-Client-Type"] = "mobile";

      return config;
    } catch (error) {
      console.error("Interceptor error:", error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// Interceptor للاستجابات
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // الحصول على RefreshToken
        const refreshToken = await AsyncStorage.getItem("RefreshToken");

        if (!refreshToken) {
          console.warn("No refresh token found");
          // تسجيل الخروج من Redux
          store.dispatch(logout());
          await AsyncStorage.removeItem("authModelAdmin");
          await AsyncStorage.removeItem("RefreshToken");
        
          // عرض تنبيه للمستخدم
          Toast.show({
            type: "error",
            text1: "Session expired",
            text2: "Please login again."
          });
          
          // الانتقال إلى صفحة تسجيل الدخول
          setTimeout(() => {
            router.replace("/signin");
          }, 500);
        
          return Promise.reject(error);
        }

        // طلب توكن جديد من الخادم
        const { data } = await axios.get(
          "http://localhost:5000/api/Account/refreshToken",
          {
            headers: {
              Cookie: `RefreshToken=${encodeURIComponent(refreshToken)}`,
            },
            withCredentials: true, // مهم لدعم الكوكيز في السيرفر
          }
        );

        // تحديث البيانات في AsyncStorage
        const authModelString = await AsyncStorage.getItem("authModelAdmin");
        const authModel = authModelString ? JSON.parse(authModelString) : {};
        authModel.result.token = data.token;
        authModel.result.refreshTokenExpiresOn = data.refreshTokenExpiresOn;

        await AsyncStorage.setItem("authModelAdmin", JSON.stringify(authModel));
        await AsyncStorage.setItem("RefreshToken", data.refreshToken);

        // تعديل التوكن في الطلب الأصلي
        originalRequest.headers.Authorization = `Bearer ${data.token}`;

        // إعادة تنفيذ الطلب الأصلي
        return api(originalRequest);
      } catch (refreshError) {
        // حذف البيانات وتوجيه المستخدم لتسجيل الدخول
        store.dispatch(logout());
        await AsyncStorage.removeItem("authModelAdmin");
        await AsyncStorage.removeItem("RefreshToken");

        Toast.show({
          type: "error",
          text1: "Session expired",
          text2: "Please login again."
        });

        // الانتقال إلى صفحة تسجيل الدخول
        setTimeout(() => {
          router.replace("/signin");
        }, 500);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
