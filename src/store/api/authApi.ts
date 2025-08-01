import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout, setAuthState, setError, setForgotPassword, setLoading } from '../slice/authSlice';
import { RootState } from '../store';
import api from '../utility/api/api';
import { IRegisterUser } from '../utility/interfaces/authInterface';


export const registerUser =  (data: IRegisterUser ) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const formData = new FormData();
      formData.append("Email", data.email);
      formData.append("Password", data.password);
      formData.append("ConfirmPassword", data.confirmPassword);
      formData.append("IsComanyOrShop", data.isComanyOrShop.toString());
      formData.append("CommercialRegister", data.CommercialRegister);
      formData.append("IsMarketer", data.isMarketer.toString());
      formData.append("IsComapny", data.isComapny.toString());
      formData.append("Location", data.location);
      formData.append("FullName", data.fullName);
      formData.append("PhoneNumber", data.phoneNumber);
      const response = await api.post("Account/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      // حفظ البيانات في AsyncStorage
      await AsyncStorage.setItem("authModelAdmin", JSON.stringify(response.data));
      if (response.data.result?.refreshToken) {
        await AsyncStorage.setItem("RefreshToken", response.data.result.refreshToken);
      }
      
      dispatch(setAuthState(response.data));
      return { success: true, data: response.data };
    } catch (error: any) {
      let errorMsg = 'Registration failed';
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          // جمع كل رسائل الأخطاء في نص واحد
          errorMsg = Object.values(error.response.data.errors).flat().join(' \n ');
        } else if (error.response.data.title) {
          errorMsg = error.response.data.title;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    }
    finally {
      dispatch(setLoading(false));
    }
  }
}


  export const loginUser = (data: any) => {
  return async (dispatch: any) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post("Account/login", data);
      
      // حفظ البيانات في AsyncStorage
      await AsyncStorage.setItem("authModelAdmin", JSON.stringify(response.data));
      if (response.data.result?.refreshToken) {
        await AsyncStorage.setItem("RefreshToken", response.data.result.refreshToken);
      }
      
      dispatch(setAuthState(response.data));
      return { success: true, data: response.data };
    } catch (error: any) {
      let errorMsg = 'Login failed';
      let errorType = 'general';
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          errorMsg = Object.values(error.response.data.errors).flat().join(' \n ');
        } else if (error.response.data.title) {
          errorMsg = error.response.data.title;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      // تخصيص نوع الخطأ
      if (
        errorMsg.toLowerCase().includes("confirm") ||
        errorMsg.toLowerCase().includes("confirmation")
      ) {
        errorType = "email_confirmation";
      } else if (
        errorMsg.toLowerCase().includes("invalid") ||
        errorMsg.toLowerCase().includes("incorrect") ||
        errorMsg.toLowerCase().includes("not found")
      ) {
        errorType = "invalid_credentials";
      }
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg, errorType };
    }
    finally {
      dispatch(setLoading(false));
    }
  }
}


export const getUserById = async (userId: string) => {
  return async (dispatch: any , getState: () => RootState) => {
    try {
      const token = getState().auth.authModel?.result?.token;
      const response = await api.get(`/User/getuserbyid/${userId}`  , {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      dispatch(setAuthState(response.data));
      return { success: true, data: response.data };
    } catch (error: any) {
      throw error;
    }
  }
}


export const loginWithGoogle = async () => {
  return async (dispatch: any, getState: () => RootState) => {
    try {
      dispatch(setLoading(true));
      const token = getState().auth.authModel?.result?.token;
      const response = await api.post("/Account/google/signin", { token });
      console.log("response from google", response.data);
      dispatch(setAuthState(response.data));
      return { success: true, data: response.data };
    } catch (error: any) {
      throw error;
    }
    finally {
      dispatch(setLoading(false));
    }
  }
}


export const logoutApi = async (dispatch: any) => {
  await AsyncStorage.removeItem("authModelAdmin");
  await AsyncStorage.removeItem("RefreshToken");
  await AsyncStorage.removeItem("authModel");
  return dispatch(logout());
}



export const forgotPassword = (email: string) => {
  return async (dispatch: any) => {
    try {
      console.log("forgotPassword API called with email:", email);
      dispatch(setLoading(true));
      const response = await api.post("/Account/sendresetpassword", { email });
      dispatch(setForgotPassword(response.data));  
      console.log("response from forgot password", response.data);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Error in forgotPassword API:", error);
      let errorMsg = 'Failed to send reset email';
      if (error.response && error.response.data) {
        if (error.response.data.errors) {
          errorMsg = Object.values(error.response.data.errors).flat().join(' \n ');
        } else if (error.response.data.title) {
          errorMsg = error.response.data.title;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      console.log("Error message:", errorMsg);
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    }
    finally {
      dispatch(setLoading(false));
    }
  }
}
