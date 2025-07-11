import { setError, setLoading } from "../slice/authSlice";
import { addToSallerWishlist, addToWishlist, removeFromWishlist, removeSallerFromWishlist, setWishlist } from "../slice/wishlistSlice";
import { AppDispatch, RootState } from "../store";
import api from "../utility/api/api";
import { ProductDto } from "../utility/interfaces/productInterface";

export const getWishlist = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const userId = getState().auth.authModel?.result?.userId;
        const token = getState().auth.authModel?.result?.token;
        try {
            dispatch(setLoading(true));
            const response = await api.get(`/Favourit/getfavourit/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            dispatch(setWishlist(response.data.result));
        } catch (error: any) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }
}

export const addToWishlistApi = (product: ProductDto) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const userId = getState().auth.authModel?.result?.userId;
        const token = getState().auth.authModel?.result?.token;
        try {
            dispatch(setLoading(true));
            const wishlistItem = {
                productId: product.id,
                // "Name must not exceed 100 characters."]
                name: product.title?.slice(0, 100) || product.name?.slice(0, 100),
                title: product.title,
                categoryId: product.categoryId,
                vendorId: product.vendorId,
                vendorName: product.vendorName,
                image: product.mainPictureUrl,
                price: product.price?.convertedPriceList?.internal?.price || 0,
                totalPrice: product.price?.convertedPriceList?.internal?.price || 0,
                brandName: product.brandName || '',
                vendorRating: product.vendorScore || 0
            };
            
            const response = await api.post(`/Favourit/additem/${userId}`, wishlistItem, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            dispatch(addToWishlist(response.data));
            return response.data.result;
        } catch (error: any) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
        }
}

export const addToSallerWishlistApi = (saller: any) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const userId = getState().auth.authModel?.result?.userId;
        const token = getState().auth.authModel?.result?.token;
        try {
            dispatch(setLoading(true));
            const sallerWishlistItem = {
                // "name": "string",
                // "providerType": "string",
                // "displayName": "string",
                // "shopName": "string",
                // "displayPictureUrl": "string",
                // "deliveryScore": 0,
                // "itemScore": 0,
                // "vendorId": "string",
                // "serviceScore": 0,
                // "stars": 0,
                // "numberOfYear": 0
                sallerId: saller.id,
                name: saller.name,
                providerType: saller.providerType,
                displayName: saller.displayName,
                shopName: saller.shopName,
                displayPictureUrl: saller.displayPictureUrl,
                deliveryScore: saller.deliveryScore,
                itemScore: saller.itemScore,
                vendorId: saller.vendorId,
                serviceScore: saller.serviceScore,
                stars: saller.stars,
                numberOfYear: saller.numberOfYear
            }
            const response = await api.post(`/Favourit/addfavourit/${saller.id}`, sallerWishlistItem, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            dispatch(addToSallerWishlist(response.data) );
            return response.data.result;
        } catch (error: any) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }
}

export const removeFromSallerWishlistApi = (sallerId: string) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const userId = getState().auth.authModel?.result?.userId;
        const token = getState().auth.authModel?.result?.token;
        try {
            dispatch(setLoading(true));
            const response = await api.delete(`/Favourit/removefavourit/${userId}/${sallerId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            dispatch(removeSallerFromWishlist(response.data.result));
            return response.data.result;
        } catch (error: any) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }
}

export const removeFromWishlistApi = (productId: string) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const userId = getState().auth.authModel?.result?.userId;
        const token = getState().auth.authModel?.result?.token;
        try {
            dispatch(setLoading(true));
            const response = await api.delete(`/Favourit/removefavourit/${userId}/${productId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            dispatch(removeFromWishlist(response.data.result));
            return response.data.result;
        } catch (error: any) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }
}