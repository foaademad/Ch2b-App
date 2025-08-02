import Toast from "react-native-toast-message";
import { addToCart as addToCartAction, removeFromCart as removeFromCartAction, setCartItems, setError, setLoading, updateCartItem as updateCartItemAction } from "../slice/cartSlice";
import { AppDispatch, RootState } from "../store";
import api from "../utility/api/api";
import { CartItemDto } from "../utility/interfaces/cartInterface";

export const addToCart = (userId: string, cartItem: CartItemDto) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const token = getState().auth.authModel?.result?.token;
    console.log("token", token);
    
    // فحص إذا كان المستخدم مسجل دخول
    if (!userId || !token) {
      console.log("User not authenticated");
      Toast.show({
        type: "error",
        text1: "Please login to add items to cart"
      });
      return;
    }

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
      
      // معالجة أنواع مختلفة من الأخطاء
      let errorMessage = "Failed to add item to cart";
      if (error.response?.status === 404) {
        errorMessage = "Cart service not available";
      } else if (error.response?.status === 401) {
        errorMessage = "Please login again";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error, please try again later";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(setError(errorMessage));
      dispatch(setLoading(false));
      
      Toast.show({
        type: "error",
        text1: errorMessage
      });
      
      // لا نريد أن نرمي الخطأ مرة أخرى لمنع الكراش
      return null;
    }
  };
};

export const updateCartItem = (userId: string, cartItemId: string, quntity: number, cartItem: CartItemDto) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
      const token = getState().auth.authModel?.result?.token;
      
      // فحص إذا كان المستخدم مسجل دخول
      if (!userId || !token) {
        console.log("User not authenticated");
        Toast.show({
          type: "error",
          text1: "Please login to update cart"
        });
        return;
      }

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
        console.log("Error updating cart item:", error);
        
        // معالجة أنواع مختلفة من الأخطاء
        let errorMessage = "Failed to update cart item";
        if (error.response?.status === 404) {
          errorMessage = "Cart item not found";
        } else if (error.response?.status === 401) {
          errorMessage = "Please login again";
        } else if (error.response?.status === 500) {
          errorMessage = "Server error, please try again later";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        dispatch(setError(errorMessage));
        dispatch(setLoading(false));
        
        Toast.show({
          type: "error",
          text1: errorMessage
        });
        
        // لا نريد أن نرمي الخطأ مرة أخرى لمنع الكراش
        return null;
      }
    };
  };
  
export const removeFromCart = (userId: string,  cartItemId : string) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const token = getState().auth.authModel?.result?.token;
        
        // فحص إذا كان المستخدم مسجل دخول
        if (!userId || !token) {
          console.log("User not authenticated");
          Toast.show({
            type: "error",
            text1: "Please login to remove items from cart"
          });
          return;
        }

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
            console.log("Error removing from cart:", error);
            
            // معالجة أنواع مختلفة من الأخطاء
            let errorMessage = "Failed to remove item from cart";
            if (error.response?.status === 404) {
              errorMessage = "Cart item not found";
            } else if (error.response?.status === 401) {
              errorMessage = "Please login again";
            } else if (error.response?.status === 500) {
              errorMessage = "Server error, please try again later";
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            
            Toast.show({
                type: "error",
                text1: errorMessage
            });
            
            // لا نريد أن نرمي الخطأ مرة أخرى لمنع الكراش
            return null;
        }
    }
}


export const getCartItems = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const userId = getState().auth.authModel?.result?.userId;
        const token = getState().auth.authModel?.result?.token;
        console.log("Getting cart items for userId:", userId);
        console.log("Token available:", !!token);
        
        // فحص إذا كان المستخدم مسجل دخول
        if (!userId || !token) {
          console.log("User not authenticated, clearing cart");
          dispatch(setCartItems([]));
          dispatch(setLoading(false));
          return null;
        }

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
           console.log("Cart API Response:", response.data);
           console.log("Cart Items to set:", cartItems);
           dispatch(setCartItems(Array.isArray(cartItems) ? cartItems : []));
            dispatch(setLoading(false));
            return response.data;
        } catch (error: any) {
            console.log("Cart API Error:", error);
            
            // معالجة أنواع مختلفة من الأخطاء
            let errorMessage = "Failed to load cart items";
            if (error.response?.status === 404) {
              errorMessage = "Cart service not available";
              // في حالة 404، نضع كارت فارغ بدلاً من إظهار خطأ
              dispatch(setCartItems([]));
            } else if (error.response?.status === 401) {
              errorMessage = "Please login again";
              dispatch(setCartItems([]));
            } else if (error.response?.status === 500) {
              errorMessage = "Server error, please try again later";
            } else if (error.message) {
              errorMessage = error.message;
            }
            
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            
            // لا نريد أن نرمي الخطأ مرة أخرى لمنع الكراش
            return null;
        }
    }
}

