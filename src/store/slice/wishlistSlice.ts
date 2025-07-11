import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FavoriteDto, WishlistSallierDto } from "../utility/interfaces/whishlistInterface";


const initialState = {
    wishlist: [] as FavoriteDto[],
    loading: false,
    error: null as string | null,
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlist: (state, action: PayloadAction<FavoriteDto[]>) => {
            state.wishlist = action.payload;
        },
        addToWishlist: (state, action: PayloadAction<FavoriteDto[]>) => {
            state.wishlist = [...state.wishlist, ...action.payload];
        },
        addToSallerWishlist: (state, action: PayloadAction<WishlistSallierDto[]>) => {
            state.wishlist = state.wishlist.map((item: FavoriteDto) => ({
                ...item,
                favoriteSallers: [...item.favoriteSallers, ...action.payload]
            }));
        },
        removeFromWishlist: (state, action: PayloadAction<string>) => {
            state.wishlist = state.wishlist.filter((item: FavoriteDto) => item.id !== action.payload);
        },
        removeSallerFromWishlist: (state, action: PayloadAction<number>) => {
            state.wishlist = state.wishlist.map((item: FavoriteDto) => ({
                ...item,
                favoriteSallers: item.favoriteSallers.filter((saller: WishlistSallierDto) => saller.id !== action.payload)
            }));
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        }
    }
})  

export const { setWishlist, addToWishlist, removeFromWishlist, setLoading, setError, addToSallerWishlist, removeSallerFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;