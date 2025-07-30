import { addOrderSuccess, clearCurrentOrder, paidByPaypal as paidByPaypalAction, setError, setLoading, setOrders, updateOrderInList } from "../slice/orderSlice";
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

// تحديث حالة الطلب
export const updateOrderStatus = (orderId: string, orderStatus: number) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    console.log('🔄 Updating order status:', { orderId, orderStatus });
    
    const response = await api.patch(`/Order/update-order-status/${orderId}?orderStatus=${orderStatus}`);
    const data = response.data as OrderResponse;
    
    console.log('📦 Update order status response:', data);
    
    if (data.isSuccess) {
      // تحديث الطلب في القائمة
      dispatch(updateOrderInList({ orderId, orderStatus }));
      return { success: true, data: data.result, message: data.message };
    } else {
      dispatch(setError(data.message || "Failed to update order status"));
      return { success: false, message: data.message || "Failed to update order status" };
    }
    
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while updating order status';
    console.error('❌ Error updating order status:', error);
    dispatch(setError(errorMessage));
    return { success: false, message: errorMessage };
  }
}; 

// create paypal payment
export const createPayPalPayment = (orderId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const response = await api.get(`/PayMent/create/${orderId}`);
    const data = response.data as OrderResponse;
    
    if (data.isSuccess) {
      // لا نغير حالة الطلب هنا - ستتغير فقط بعد إتمام الدفع الفعلي
      // dispatch(paidByPaypalAction({ orderId }));
      return { success: true, data: data.result, message: data.message };
    } else {
      dispatch(setError(data.message || "Failed to create payment"));
      return { success: false, message: data.message || "Failed to create payment" };
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while creating payment';
    dispatch(setError(errorMessage));
    return { success: false, message: errorMessage };
  }
};

// التحقق من حالة الدفع وتحديث حالة الطلب عند إتمام الدفع
export const checkPaymentStatus = (orderId: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    const response = await api.get(`/PayMent/check-status/${orderId}`);
    const data = response.data as OrderResponse;
    
    if (data.isSuccess && data.result?.paymentCompleted) {
      // تحديث حالة الطلب إلى 2 (مكتمل الدفع) فقط عند إتمام الدفع الفعلي
      dispatch(paidByPaypalAction({ orderId }));
      return { success: true, data: data.result, message: data.message };
    } else {
      return { success: false, message: data.message || "Payment not completed yet" };
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while checking payment status';
    dispatch(setError(errorMessage));
    return { success: false, message: errorMessage };
  }
};



// pay by account bank
export const payByAccountBank = (userId: string, bankTransferData: any) => async (dispatch: any) => {
  try {
    console.log('🏦 payByAccountBank API called with:', { userId, bankTransferData });
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    // إنشاء FormData لإرسال البيانات مع الملف
    const formData = new FormData();
    
    // إضافة البيانات الأساسية
    formData.append('userId', userId);
    formData.append('bankAccountToTransferTo', bankTransferData.bankAccountToTransferTo);
    formData.append('senderAccountName', bankTransferData.senderAccountName);
    formData.append('amount', bankTransferData.amount.toString());
    formData.append('senderBankName', bankTransferData.senderBankName);
    formData.append('senderAccountNumber', bankTransferData.senderAccountNumber);
    
    // إضافة الملف إذا كان موجوداً
    if (bankTransferData.transferReceiptImage) {
      console.log('📎 Adding image to FormData:', bankTransferData.transferReceiptImage);
      formData.append('transferReceiptImage', {
        uri: bankTransferData.transferReceiptImage.uri,
        type: bankTransferData.transferReceiptImage.type || 'image/jpeg',
        name: bankTransferData.transferReceiptImage.name || 'receipt.jpg'
      } as any);
    } else {
      console.log('⚠️ No image provided for bank transfer');
    }
    
    console.log('📤 Sending FormData to API...');
    console.log('🔗 API URL:', `/PayMent/create-bankTransfer/${userId}`);
    
    const response = await api.post(`/PayMent/create-bankTransfer/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('📥 API Response received:', response);
    console.log('📊 Response status:', response.status);
    console.log('📋 Response data:', response.data);
    
    const data = response.data as OrderResponse;

    if (data.isSuccess) {
      console.log('✅ Bank transfer API call successful');
      return { success: true, data: data.result, message: data.message };
    } else {
      console.error('❌ Bank transfer API call failed:', data.message);
      dispatch(setError(data.message || "Failed to pay by account bank"));
      return { success: false, message: data.message || "Failed to pay by account bank" };
    }
  } catch (error: any) {
    console.error('❌ Bank transfer API error:', error);
    console.error('❌ Error response:', error?.response);
    console.error('❌ Error message:', error?.message);
    
    const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while paying by account bank';  
    dispatch(setError(errorMessage));
    return { success: false, message: errorMessage };
  }
};




