import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductDetailsDto, ProductDto } from "../utility/interfaces/productInterface";

interface CategoryProductsState {
    products: ProductDto[];
    hasMore: boolean;
    currentPage: number;
    categoryId: string;
    name?: string;
    nameEn?: string;
}

const initialState = {
    productsBest: [] as ProductDto[],
    productsNew: [] as ProductDto[],
    currentProduct: null as ProductDetailsDto | null,
    currentCategory: null as CategoryProductsState | null,
    loading: false,
    loadingMore: false,
    error: null as string | null,
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        getProductsBest: (state, action: PayloadAction<ProductDto[]>) => {
            state.productsBest = action.payload;
        },
        getProductsNew: (state, action: PayloadAction<ProductDto[]>) => {
            state.productsNew = action.payload;
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
        setCurrentProduct: (state, action: PayloadAction<ProductDetailsDto | null>) => {
            state.currentProduct = action.payload;
        },
        setCurrentCategory: (state, action: PayloadAction<CategoryProductsState | null>) => {
            state.currentCategory = action.payload;
        },
        addMoreProducts: (state, action: PayloadAction<{ products: ProductDto[], hasMore: boolean }>) => {
            if (state.currentCategory) {
                state.currentCategory.products = [...(state.currentCategory.products || []), ...action.payload.products];
                state.currentCategory.hasMore = action.payload.hasMore;
                // تحديث الصفحة الحالية
                state.currentCategory.currentPage = (state.currentCategory.currentPage || 1) + 1;
            }
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
            state.currentCategory = null;
        },
    },
});

export const { getProductsBest, getProductsNew, setLoading, setLoadingMore, setError, setCurrentProduct, setCurrentCategory, addMoreProducts, clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;