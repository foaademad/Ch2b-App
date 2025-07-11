import Toast from "react-native-toast-message";
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction, setCartItems, setError, setLoading, updateCartItem as updateCartItemAction } from "../slice/cartSlice";
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
   
      // Update local state immediately for better UX
      dispatch(addToCartAction(cartItem));
      dispatch(setLoading(false));
      console.log("response", response.data);
      Toast.show({
        type: "success",
        text1: "Item added to cart successfully"
      });
      return response.data;
    } catch (error: any) {
      console.log("error", error);
      dispatch(setError("error.message"));
      dispatch(setLoading(false));
      
      Toast.show({
        type: "error",
        text1: "Failed to add item to cart"
      });
      
      throw error;
    }
  };
};

export const updateCartItem = (userId: string, cartItemId: string, quntity: number, cartItem: CartItemDto) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
      const token = getState().auth.authModel?.result?.token;
      try {
        dispatch(setLoading(true));
  
        // استخراج attributeItemId إذا كان موجودًا
        const attributeItemId = cartItem.attributeItems && cartItem.attributeItems.length > 0 
          ? cartItem.attributeItems[0].id 
          : 0;
  
        // ✅ أرسل الحقل باسم صحيح expected by backend
        const body = { quantity: quntity, attributeItemId };
  
        console.log('PATCH Body:', body);
  
        const response = await api.patch(`/Cart/update-quantity/${userId}/${cartItemId}`, body, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        console.log('PATCH Response:', response.data);
  
        const updatedItem = { 
          ...cartItem, 
          quntity, 
          totalPrice: cartItem.totalPrice 
            ? (cartItem.totalPrice / (cartItem.quntity || 1)) * quntity 
            : 0 
        };
  
        dispatch(updateCartItemAction(updatedItem)); 
        dispatch(setLoading(false));
  
        return response.data;
      } catch (error: any) {
        dispatch(setError(error.message));
        dispatch(setLoading(false));
        Toast.show({
          type: "error",
          text1: "Failed to update cart item"
        });
        throw error;
      }
    };
  };
  
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
            
            // Update local state immediately for better UX
            dispatch(removeFromCartAction(cartItemId));
            dispatch(setLoading(false));
            
            Toast.show({
                type: "success",
                text1: "Item removed from cart successfully"
            });
            
            return response.data;
        } catch (error: any) {
            dispatch(setError(error.message));
            dispatch(setLoading(false));
            
            Toast.show({
                type: "error",
                text1: "Failed to remove item from cart"
            });
            
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
            // اطبع كل عنصر مع الكمية الخاصة به
            if (response.data.result && Array.isArray(response.data.result)) {
                response.data.result.forEach((item: any) => {
                    console.log(`ProductId: ${item.productId}, quntity: ${item.quntity}`);
                });
            }
            // Ensure we're passing an array to setCartItems
           const cartItems = response.data.result || [];
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

