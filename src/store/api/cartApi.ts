import { addToCart as addToCartAction, clearCart as clearCartAction, removeFromCart as removeFromCartAction, setCartItems, setError, setLoading, updateCartItem as updateCartItemAction } from "../slice/cartSlice";
import api from "../utility/api/api";
import { CartItemDto } from "../utility/interfaces/cartInterface";
import { AppDispatch } from "../store";
import { RootState } from "../store";
export const getCart = async () => {
    const response = await api.get("/cart");
    return response.data;
}


export const addToCart = (userId: string, cartItem: CartItemDto) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const token = getState().auth.authModel?.token;
    console.log("token", token);
    try {
      dispatch(setLoading(true));
      const response = await api.post(`/Cart/addtocart/${userId}`, cartItem, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      dispatch(addToCartAction(response.data));
      dispatch(setLoading(false));
      console.log("response", response.data);
      return response.data;
    } catch (error: any) {
      dispatch(setError(error.message));
      dispatch(setLoading(false));
      throw error;
    }
  };
};

export const removeFromCart = async (productId: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            const response = await api.delete(`/cart/${productId}`);
            dispatch(removeFromCartAction(productId));
            dispatch(setLoading(false));
            return response.data;
        } catch (error: any) {
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }
}

export const updateCartItem = async (productId: string, quantity: number, cartItem: CartItemDto) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            const response = await api.put(`/cart/${productId}`, { quantity, cartItem });
            dispatch(updateCartItemAction(response.data));
            dispatch(setLoading(false));
            return response.data;
        } catch (error: any) {
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }
}

export const clearCart = async () => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            const response = await api.delete("/cart");
            dispatch(clearCartAction());
            dispatch(setLoading(false));
            return response.data;
        } catch (error: any) {
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }
}

export const getCartItems = async () => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            const response = await api.get("/cart");
            dispatch(setCartItems(response.data));
            dispatch(setLoading(false));
            return response.data;
        } catch (error: any) {
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            throw error;
        }
    }
}

