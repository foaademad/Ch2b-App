import { setBankAccounts, setBankAccountsError, setBankAccountsLoading } from "../slice/bankAccountSlice";
import { addOrderSuccess, clearCurrentOrder, paidByPaypal as paidByPaypalAction, setError, setLoading, setOrders, updateOrderInList } from "../slice/orderSlice";
import api from "../utility/api/api";
import { BankAccountResponse } from "../utility/interfaces/bankAccountInterface";
import { OrderRequest, OrderResponse, TransferFormValues } from "../utility/interfaces/orderInterface";

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



// =============================================

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
export const payByAccountBank = (userId: string, bankTransferData: TransferFormValues) => async (dispatch: any) => {
  try {
    console.log('🏦 payByAccountBank API called with:', { userId, bankTransferData });
    dispatch(setLoading(true));
    dispatch(setError(null));
    
    // إنشاء FormData لإرسال البيانات مع الملف
    const { fromBankName, fromAccountNumber, fromAccountName, orderId, amount, transferImage, accountId } = bankTransferData;
      const payObj = {
        bankName: fromBankName,
        accountNumber: fromAccountNumber,
        accounName: fromAccountName,
        orderId: orderId,
        userId: userId,
        amount: Number(amount),
        imageTransferFile: transferImage,
        accountId: accountId,
      };
      const formData = new FormData();
      formData.append("bankName", payObj.bankName);
      formData.append("accountNumber", payObj.accountNumber);
      formData.append("accounName", payObj.accounName);
      formData.append("orderId", payObj.orderId || "");
      formData.append("userId", payObj.userId || "");
      formData.append("amount", payObj.amount.toString());
      formData.append("accountId", payObj.accountId);
      formData.append(
        "imageTransferFile",
        payObj.imageTransferFile || new Blob()
      );

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
   
    const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while paying by account bank';  
    dispatch(setError(errorMessage));
    return { success: false, message: errorMessage };
  }
};


//fetch all bank accounts
export const fetchAllBankAccounts = () => async (dispatch: any) => {
  try {
    dispatch(setBankAccountsLoading(true));
    dispatch(setBankAccountsError(null));
    
    const response = await api.get(`/AccountBank/get-all`);
    const data = response.data as BankAccountResponse;
    
    if (data.isSuccess) {
      dispatch(setBankAccounts(data.result || []));
      return { success: true, data: data.result };
    } else {
      dispatch(setBankAccountsError(data.message || "Failed to fetch bank accounts"));
      return { success: false, message: data.message || "Failed to fetch bank accounts" };
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred while fetching bank accounts';
    dispatch(setBankAccountsError(errorMessage));
    return { success: false, message: errorMessage };
  }
};


