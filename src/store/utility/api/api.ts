import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";

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

      if (authModel?.token) {
        config.headers.Authorization = `Bearer ${authModel.token}`;
      }

      config.headers["X-Client-Type"] = "mobile";
      config.headers["Accept-Language"] = "ar";

      return config;
    } catch (error) {
      console.error("Interceptor error:", error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
