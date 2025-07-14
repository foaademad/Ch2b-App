import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductDto } from "../utility/interfaces/productInterface";

const initialState = {
    imageSearchResults: [] as ProductDto[],
    searchTextResults: [] as ProductDto[],
    loading: false,
    loadingMore: false,
    error: null as string | null,
    currentPage: 1,
    hasMore: true,
}

const imageSearchSlice = createSlice({
    name: "imageSearch",
    initialState,
    reducers: {
        setImageSearchResults: (state, action: PayloadAction<ProductDto[]>) => {
            state.imageSearchResults = action.payload;
        },
        appendImageSearchResults: (state, action: PayloadAction<ProductDto[]>) => {
            state.imageSearchResults = [...state.imageSearchResults, ...action.payload];
        },
        setSearchTextResults: (state, action: PayloadAction<ProductDto[]>) => {
            state.searchTextResults = action.payload;
        },
        appendSearchTextResults: (state, action: PayloadAction<ProductDto[]>) => {
            state.searchTextResults = [...state.searchTextResults, ...action.payload];
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setLoadingMore: (state, action: PayloadAction<boolean>) => {
            state.loadingMore = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload || null;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setHasMore: (state, action: PayloadAction<boolean>) => {
            state.hasMore = action.payload;
        },
        resetSearch: (state) => {
            state.imageSearchResults = [];
            state.searchTextResults = [];
            state.currentPage = 1;
            state.hasMore = true;
            state.error = null;
        },
    },
});

export const { 
    setImageSearchResults, 
    appendImageSearchResults,
    setSearchTextResults, 
    appendSearchTextResults,
    setLoading, 
    setLoadingMore,
    setError, 
    setCurrentPage,
    setHasMore,
    resetSearch
} = imageSearchSlice.actions;
export default imageSearchSlice.reducer;