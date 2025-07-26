import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IShippingTax from "../utility/interfaces/shippingTaxInterface";

interface IShippingTaxState {
    shippingTax: IShippingTax | null;
    loading: boolean;
    error: string | null;
}

const initialState: IShippingTaxState = {
    shippingTax: null,
    loading: false,
    error: null as string | null,
}

const shippingTaxSlice = createSlice({
    name: 'shippingTax',
    initialState,
    reducers: {
        setShippingTax: (state, action: PayloadAction<IShippingTax>) => {
            state.shippingTax = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
})

export const { setShippingTax, setLoading, setError } = shippingTaxSlice.actions;
export default shippingTaxSlice.reducer;
