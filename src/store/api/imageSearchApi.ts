import {
  setError,
  setImageSearchResults,
  setLoading,
} from "../slice/imageSearchSlice";
import { AppDispatch } from "../store";
import api from "../utility/api/api";

export interface ImageSearchRequist {
  file: File;
  page: number;
}

export const searchImage = (data: ImageSearchRequist) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const formData = new FormData();
      formData.append("image", data.file);
      formData.append("page", data.page.toString());
      const response = await api.post("/Product/search-image", formData);
      console.log("Image search response:", response.data.result);
      
      dispatch(setImageSearchResults(response.data.result));
    } catch (error: any) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
};


