import { setAuthState, setError, setLoading } from '../slice/authSlice';
import api from '../utility/api/api';
import { IRegisterUser } from '../utility/interfaces/authInterface';

// Password (string)
  // ConfirmPassword (string)
  // IsComanyOrShop (boolean)
  // CommercialRegister (choose file)
  // IsMarketer (boolean) 
  // IsComapny (boolean)
  // Location (string)
  // Email (string)
  // FullName (string)
  // PhoneNumber (string)


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


