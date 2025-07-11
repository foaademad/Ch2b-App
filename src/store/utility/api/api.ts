// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // دمج كل الإعدادات في Interceptor واحد
// api.interceptors.request.use(
//   async (config) => {
//     try {
//       const authModelString = await AsyncStorage.getItem("authModel");
//       const authModel = authModelString ? JSON.parse(authModelString) : null;

//       // تم حذف التحقق من صلاحية الريفريش توكن بناءً على طلب المستخدم
//       if (authModel?.result?.token) {
//         config.headers.Authorization = `Bearer ${authModel.result.token}`;
//       }
//       config.headers["X-Client-Type"] = "mobile";
//       config.headers["Accept-Language"] = "ar";
//       return config;
//     } catch (error) {
//       console.error("Interceptor error:", error);
//       return Promise.reject(error);
//     }
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default api;




import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { router } from 'expo-router';
import Toast from "react-native-toast-message";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // تأكد أنها عنوان السيرفر الصحيح
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor للطلبات
api.interceptors.request.use(
  async (config) => {
    try {
      const authModelString = await AsyncStorage.getItem("authModel");
      const authModel = authModelString ? JSON.parse(authModelString) : null;

      if (authModel?.result?.token) {
        config.headers.Authorization = `Bearer ${authModel.result.token}`;
      }

      config.headers["X-Client-Type"] = "mobile";
      config.headers["Accept-Language"] = "ar";

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
          // throw new Error("No refresh token found");
          console.warn("No refresh token found");
          await AsyncStorage.removeItem("authModel");
          await AsyncStorage.removeItem("RefreshToken");
        
          // عرض تنبيه للمستخدم
          Toast.show({
            type: "error",
            text1: "Session expired",
            text2: "Please login again."
          });
          router.push("/signin");
        
          return Promise.reject(error); // لا ترمي Error، فقط ارفض الـ Promise
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
        const authModelString = await AsyncStorage.getItem("authModel");
        const authModel = authModelString ? JSON.parse(authModelString) : {};
        authModel.result.token = data.token;
        authModel.result.refreshTokenExpiresOn = data.refreshTokenExpiresOn;

        await AsyncStorage.setItem("authModel", JSON.stringify(authModel));
        await AsyncStorage.setItem("RefreshToken", data.refreshToken);

        // تعديل التوكن في الطلب الأصلي
        originalRequest.headers.Authorization = `Bearer ${data.token}`;

        // إعادة تنفيذ الطلب الأصلي
        return api(originalRequest);
      } catch (refreshError) {
        // حذف البيانات وتوجيه المستخدم لتسجيل الدخول
        await AsyncStorage.removeItem("authModel");
        await AsyncStorage.removeItem("RefreshToken");

        Toast.show({
          type: "error",
          text1: "Session expired",
          text2: "Please login again."
        });

        // من الأفضل توجيه المستخدم لشاشة تسجيل الدخول
        router.push("/signin");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
