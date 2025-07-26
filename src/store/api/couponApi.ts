import { setCoupons, setError, setLoading } from "../slice/couponSlice";
import api from "../utility/api/api";
import { CouponsResponse } from "../utility/interfaces/couponInterface";

export const getAllActiveCoupons = () => async (dispatch: any) => {
    try {
        dispatch(setLoading(true));
        const response = await api.get("/CouponCode/get-all-active");
        const data = response.data as CouponsResponse;
        
        if (data.isSuccess) {
            dispatch(setCoupons(data.result));
        } else {
            dispatch(setError(data.message || "Failed to fetch coupons"));
        }
        
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
        dispatch(setError(errorMessage));
    } finally {
        dispatch(setLoading(false));
    }
};

export const checkCouponCode = (code: string, totalPrice: number) => async (dispatch: any) => {
    try {
        const response = await api.get(`/CouponCode/check-active/${encodeURIComponent(code)}?TotalPrice=${totalPrice}`);
        const data = response.data;
        
        if (data.isSuccess) {
            return { success: true, data: data.result };
        } else {
            return { success: false, message: data.message || "Invalid coupon code" };
        }
        
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
        return { success: false, message: errorMessage };
    }
}; 