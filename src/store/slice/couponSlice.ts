import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CouponDto } from "../utility/interfaces/couponInterface";

const initialState = {
    coupons: [] as CouponDto[],
    loading: false,
    error: null as string | null,
}

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        setCoupons: (state, action: PayloadAction<CouponDto[]>) => {
            state.coupons = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload || null;
        },
    },
});

export const { setCoupons, setLoading, setError } = couponSlice.actions;
export default couponSlice.reducer; 