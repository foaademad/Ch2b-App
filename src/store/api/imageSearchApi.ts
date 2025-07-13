import { setError, setImageSearchResults, setLoading } from "../slice/imageSearchSlice";
import { AppDispatch, RootState } from "../store";
import api from "../utility/api/api";

// دالة البحث بالصورة (POST)
export const imageSearchApi = (imageFile: { uri: string, name: string, type: string }, page: number = 1, pageSize: number = 1) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
      const token = getState().auth.authModel?.result?.token;
      console.log('imageSearchApi called', imageFile);
      try {
        dispatch(setLoading(true));
        const formData = new FormData();
        formData.append("Image", {
          uri: imageFile.uri.startsWith('file://') ? imageFile.uri : 'file://' + imageFile.uri,
          name: imageFile.name,
          type: imageFile.type,
        } as any);
        formData.append("Page", String(page));
        formData.append("PageSize", String(pageSize));
        console.log('FormData ready', formData);
        // Debug
        for (let pair of (formData as any)._parts) {
          console.log(pair[0], pair[1]);
        }
        const response = await api.post("/Product/search-image", formData, {
          headers: {
            "Authorization": `Bearer ${token}`,
            // لا تضع Content-Type هنا!
          }
        });
        console.log('image search response:', response.data); // <--- أضف هذا السطر
        dispatch(setImageSearchResults(response.data));
      } catch (error: any) {
        console.log('image search error:', error, error?.response?.data);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    }
}

// دالة البحث بالنص (GET)
export const getImageSearchResults = (params: {
    title?: string,
    page?: number,
    pageSize?: number,
    vendorid?: string,
    vendorName?: string
}) => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const token = getState().auth.authModel?.result?.token;
        try {
            dispatch(setLoading(true));
            const response = await api.get(`/Product/search`, {
                params,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            dispatch(setImageSearchResults(response.data));
        } catch (error: any) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }
}