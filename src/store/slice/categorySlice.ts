import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryDto } from "../utility/interfaces/categoryInterface";

const initialState = {
    categories: [] as CategoryDto[],
    loading: false,
    error: null as string | null,
}

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        getCategories: (state, action: PayloadAction<CategoryDto[]>) => {
            state.categories = action.payload;
        },
        addCategories: (state, action: PayloadAction<CategoryDto[]>) => {
            // دمج النتائج الجديدة مع القديمة بدون تكرار حسب id
            const existingIds = new Set(state.categories.map(cat => cat.id));
            const newOnes = action.payload.filter(cat => !existingIds.has(cat.id));
            state.categories = [...state.categories, ...newOnes];
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload || null;
        },
    },
});

export const { getCategories, addCategories, setLoading, setError } = categorySlice.actions;
export default categorySlice.reducer;
