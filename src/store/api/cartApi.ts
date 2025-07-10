import Toast from "react-native-toast-message";
import { setCartItems, setError, setLoading } from "../slice/cartSlice";
import { AppDispatch, RootState } from "../store";
import api from "../utility/api/api";
import { CartItemDto } from "../utility/interfaces/cartInterface";

export const addToCart = (userId: string, cartItem: CartItemDto) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const token = getState().auth.authModel?.result?.token;
    console.log("token", token);
    try {
      dispatch(setLoading(true));
      const response = await api.post(`/Cart/addtocart/${userId}`, cartItem, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          
        },
    });
    console.log(token);
   
      // Instead of adding single item, refresh the entire cart
      const cartResponse = await api.get(`/Cart/getcart/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      const cartItems = Array.isArray(cartResponse.data) ? cartResponse.data : [];
      dispatch(setCartItems(cartItems));
      dispatch(setLoading(false));
      console.log("response", response.data);
      Toast.show({
        type: "success",
        text1: "Item added to cart successfully"
      });
      return response.data;
    } catch (error: any) {
      console.log("error", error);
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  };
};

export const updateCartItem = (userId: string, cartItemId: string, quantity: number, cartItem: CartItemDto) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const token = getState().auth.authModel?.result?.token;
        try {
            dispatch(setLoading(true));
            const response = await api.put(`/Cart/updatecartitem/${userId}/${cartItemId}`, { quantity, cartItem }, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            
            // Refresh the entire cart after updating item
            const cartResponse = await api.get(`/Cart/getcart/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            
            const cartItems = Array.isArray(cartResponse.data) ? cartResponse.data : [];
            dispatch(setCartItems(cartItems));
            dispatch(setLoading(false));
            return response.data;
        } catch (error: any) {
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }
}

export const removeFromCart = (userId: string,  cartItemId : string) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const token = getState().auth.authModel?.result?.token;
        try {
            dispatch(setLoading(true));
            const response = await api.delete(`/Cart/removeitem/${userId}/${cartItemId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            
            // Refresh the entire cart after removing item
            const cartResponse = await api.get(`/Cart/getcart/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            
            const cartItems = Array.isArray(cartResponse.data) ? cartResponse.data : [];
            dispatch(setCartItems(cartItems));
            dispatch(setLoading(false));
            return response.data;
        } catch (error: any) {
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }
}


export const getCartItems = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const userId = getState().auth.authModel?.result?.userId;
        const token = getState().auth.authModel?.result?.token;
        console.log("token", token);
        try {
            dispatch(setLoading(true));
            const response = await api.get(`/Cart/getcart/${userId}`,{
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("Cart API Response:", response.data);
            console.log("Response data type:", typeof response.data);
            console.log("Is Array:", Array.isArray(response.data));
            
            // Ensure we're passing an array to setCartItems
           const cartItems = response.data.result || [];
            console.log("cartItemsبببببببب", cartItems);
            dispatch(setCartItems(cartItems));
            dispatch(setLoading(false));
            return response.data;
        } catch (error: any) {
            console.log("Cart API Error:", error);
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }
}

