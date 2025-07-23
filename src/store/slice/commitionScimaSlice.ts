import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import  ICommition  from "../utility/interfaces/commitionInterface";

interface ICommitionState {
    commition: ICommition | null;
    loading: boolean;
    error: string | null;

}


const initialState: ICommitionState = {
    commition: null,
    loading: false,
    error: null as string | null,
}


const commitionSlice = createSlice({
    name: 'commition',
    initialState,
    reducers: {
        setCommition: (state, action: PayloadAction<ICommition>) => {
            state.commition = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>  ) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
})  

export const { setCommition, setLoading, setError } = commitionSlice.actions;
export default commitionSlice.reducer;