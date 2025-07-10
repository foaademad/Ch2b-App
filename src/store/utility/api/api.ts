import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { store } from '../../../store/store';
import { logout } from '../../slice/authSlice';

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// دمج كل الإعدادات في Interceptor واحد
api.interceptors.request.use(
  async (config) => {
    try {
      const authModelString = await AsyncStorage.getItem("authModel");
      const authModel = authModelString ? JSON.parse(authModelString) : null;

      if (authModel?.result?.refreshTokenExpiresOn) {
        const now = new Date();
        const refreshTokenExpiresOn = new Date(authModel.result.refreshTokenExpiresOn);
        if (refreshTokenExpiresOn <= now) {
          // انتهت صلاحية الريفريش توكن: سجل خروج
          const dispatch = store.dispatch;
          await dispatch(logout());
          throw new Error('انتهت الجلسة، يرجى تسجيل الدخول من جديد');
        }
      }

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
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
