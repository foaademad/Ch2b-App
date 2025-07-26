import { addOrderSuccess, clearCurrentOrder, setError, setLoading, setOrders } from "../slice/orderSlice";
import api from "../utility/api/api";
import { OrderRequest, OrderResponse } from "../utility/interfaces/orderInterface";

export const addOrder = (orderData: OrderRequest) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const response = await api.post("/Order/addOrder", orderData);
    const data = response.data as OrderResponse;
    
    if (data.isSuccess) {
      dispatch(addOrderSuccess(data.result));
      return { success: true, data: data.result, message: data.message };
    } else {
      dispatch(setError(data.message || "Failed to place order"));
      return { success: false, message: data.message || "Failed to place order" };
    }
    
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while placing order';
    dispatch(setError(errorMessage));
    return { success: false, message: errorMessage };
  }
};

// جلب جميع طلبات المستخدم
export const getAllOrdersToUser = (userId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const response = await api.get(`/Order/getAllOrdersToUser/${userId}`);
    const data = response.data as OrderResponse;
    
    if (data.isSuccess) {
      dispatch(setOrders(data.result));
      return { success: true, data: data.result };
    } else {
      dispatch(setError(data.message || "Failed to fetch orders"));
      return { success: false, message: data.message || "Failed to fetch orders" };
    }
    
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while fetching orders';
    dispatch(setError(errorMessage));
    return { success: false, message: errorMessage };
  }
};

// جلب جميع الطلبات للمستخدم (الاسم القديم للتوافق)
export const getUserOrders = (userId: string) => async (dispatch: any) => {
  return getAllOrdersToUser(userId)(dispatch);
};

// جلب تفاصيل طلب معين
export const getOrderDetails = (orderId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const response = await api.get(`/Order/get-order-details/${orderId}`);
    const data = response.data as OrderResponse;
    
    if (data.isSuccess) {
      dispatch(clearCurrentOrder());
      return { success: true, data: data.result };
    } else {
      dispatch(setError(data.message || "Failed to fetch order details"));
      return { success: false, message: data.message || "Failed to fetch order details" };
    }
    
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while fetching order details';
    dispatch(setError(errorMessage));
    return { success: false, message: errorMessage };
  }
}; 