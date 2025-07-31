import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageDynamicState {
    image: ImageDynamicItem[] | null;
    loading: boolean;
    error: string | null;
}

interface ImageDynamicItem {
    id: number;
    createdAt: string;
    updatedAt: string;
    typeImageUpload: number;
    isActive: boolean;
    image: string | null;
    imageDto: {
        id: number;
        fileName: string;
        fileType: string;
        url: string;
        publicId: string;
    };
}
const initialState: ImageDynamicState = {
    image: null,
    loading: false,
    error: null,
};

const imageDynamicSlice = createSlice({
    name: "imageDynamic",
    initialState,
    reducers: {
        setImage: (state, action: PayloadAction<ImageDynamicItem[] | null>) => {
            state.image = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setImage, setLoading, setError } = imageDynamicSlice.actions;
export default imageDynamicSlice.reducer;