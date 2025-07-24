import { addAddress, deleteAddress, setAddLoading, setAddresses, setDeleteLoading, setError, setLoading } from '../slice/addressSlice';
import { RootState } from '../store';
import api from '../utility/api/api';
import { IAddAddressRequest, IAddress } from '../utility/interfaces/addressInterface';

// جلب جميع العناوين للمستخدم
export const fetchAddresses = (userId: string) => {
  return async (dispatch: any, getState: () => RootState) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(`ShippingLocation/get-all-user/${userId}`,{
        headers: {
          "Authorization": `Bearer ${getState().auth.authModel?.token}`
        }
      });
      
      if (response.data.isSuccess) {
        dispatch(setAddresses(response.data.result || []));
        return { success: true, data: response.data.result };
      } else {
        dispatch(setError(response.data.message || 'Failed to fetch addresses'));
        return { success: false, error: response.data.message };
      }
    } catch (error: any) {
      let errorMsg = 'Failed to fetch addresses';
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (error.response.data.title) {
          errorMsg = error.response.data.title;
        } else if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      dispatch(setLoading(false));
    }
  };
};

// إضافة عنوان جديد
export const addNewAddress = (data: IAddAddressRequest, userId: string) => {
  return async (dispatch: any, getState: () => RootState) => {
    try {
      dispatch(setAddLoading(true));
      console.log('API Request - Adding address:', { data, userId });
      
      const response = await api.post(`ShippingLocation/add-shipping-location/${userId}`, data, {
        headers: {
          "Authorization": `Bearer ${getState().auth.authModel?.token}`
        }
      });
      console.log('API Response:', response.data);
      
      if (response.data.isSuccess) {
        const newAddress: IAddress = {
          id: response.data.result.id,
          address: response.data.result.address,
          city: response.data.result.city,
          state: response.data.result.state,
          country: response.data.result.country,
          street: response.data.result.street,
          createdAt: response.data.result.createdAt,
          updatedAt: response.data.result.updatedAt,
          userId: response.data.result.userId,
        };
        
        console.log('Processed new address:', newAddress);
        dispatch(addAddress(newAddress));
        return { success: true, data: newAddress };
      } else {
        console.log('API returned error:', response.data.message);
        dispatch(setError(response.data.message || 'Failed to add address'));
        return { success: false, error: response.data.message };
      }
    } catch (error: any) {
      console.log('API Error:', error);
      let errorMsg = 'Failed to add address';
      if (error.response && error.response.data) {
        console.log('Error response data:', error.response.data);
        if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (error.response.data.title) {
          errorMsg = error.response.data.title;
        } else if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      dispatch(setAddLoading(false));
    }
  };
};

// حذف عنوان
export const deleteExistingAddress = (addressId: number) => {
  return async (dispatch: any, getState: () => RootState) => {
    try {
      dispatch(setDeleteLoading(true));
      const response = await api.delete(`ShippingLocation/delete-shipping-location/${addressId}`, {
        headers: {
          "Authorization": `Bearer ${getState().auth.authModel?.token}`
        }
      });
      
      if (response.data.isSuccess) {
        dispatch(deleteAddress(addressId));
        return { success: true };
      } else {
        dispatch(setError(response.data.message || 'Failed to delete address'));
        return { success: false, error: response.data.message };
      }
    } catch (error: any) {
      let errorMsg = 'Failed to delete address';
      if (error.response && error.response.data) {
        if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (error.response.data.title) {
          errorMsg = error.response.data.title;
        } else if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      dispatch(setError(errorMsg));
      return { success: false, error: errorMsg };
    } finally {
      dispatch(setDeleteLoading(false));
    }
  };
}; 