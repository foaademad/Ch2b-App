import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductDto } from "../utility/interfaces/productInterface";

const initialState = {
    imageSearchResults: [] as ProductDto[],
    loading: false,
    error: null as string | null,
    searchTextResults: [] as ProductDto[],
}

    const imageSearchSlice = createSlice({
    name: "imageSearch",
    initialState,
    reducers: {
        setImageSearchResults: (state, action: PayloadAction<ProductDto[]>) => {
            state.imageSearchResults = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload || null;
        },
        setSearchTextResults: (state, action: PayloadAction<ProductDto[]>) => {
            state.searchTextResults = action.payload;
        },
    },
});

export const { setImageSearchResults, setLoading, setError, setSearchTextResults } = imageSearchSlice.actions;
export default imageSearchSlice.reducer;