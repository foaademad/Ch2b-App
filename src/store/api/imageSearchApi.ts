import {
  appendImageSearchResults,
  appendSearchTextResults,
  setCurrentPage,
  setError,
  setHasMore,
  setImageSearchResults,
  setLoading,
  setLoadingMore,
  setSearchTextResults,
} from "../slice/imageSearchSlice";
import { AppDispatch } from "../store";
import api from "../utility/api/api";

export interface ImageSearchRequest {
  file: {
    uri: string;
    name: string;
    type: string;
  };
  page: number;
}

export interface TextSearchRequest {
  title: string;
  page: number;
  language: string;
}

// 🔍 دالة البحث بالصورة
export const searchImage = (data: ImageSearchRequest) => {
  return async (dispatch: AppDispatch) => {
    if (data.page === 1) {
      dispatch(setLoading(true));
      dispatch(setError(null));
    } else {
      dispatch(setLoadingMore(true));
    }

    try {
      const formData = new FormData();
      // تحويل uri إلى Blob
      const response = await fetch(data.file.uri);
      const blob = await response.blob();
      formData.append("Image", blob, data.file.name);
      formData.append("page", data.page.toString());

      const apiResponse = await api.post("/Product/search-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Image search response:", apiResponse.data.result);
      
      if (data.page === 1) {
        dispatch(setImageSearchResults(apiResponse.data.result));
      } else {
        dispatch(appendImageSearchResults(apiResponse.data.result));
      }
      
      dispatch(setCurrentPage(data.page));
      dispatch(setHasMore(apiResponse.data.result && apiResponse.data.result.length > 0));
    } catch (error: any) {
      console.error("Image search error:", error);
      
      // معالجة أفضل للأخطاء
      let errorMessage = "Unexpected error";
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (errors.Image) {
          errorMessage = errors.Image.join(', ');
        } else if (typeof errors === 'object') {
          errorMessage = Object.values(errors).flat().join(', ');
        }
      } else if (error.response?.data?.title) {
        errorMessage = error.response.data.title;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      dispatch(setError(errorMessage));
    } finally {
      if (data.page === 1) {
        dispatch(setLoading(false));
      } else {
        dispatch(setLoadingMore(false));
      }
    }
  };
};

// 🔎 دالة البحث النصي
export const searchByText = (data: TextSearchRequest) => {
  return async (dispatch: AppDispatch) => {
    if (data.page === 1) {
      dispatch(setLoading(true));
      dispatch(setError(null)); // مسح الأخطاء السابقة
    } else {
      dispatch(setLoadingMore(true));
    }

    try {
      const response = await api.get(
        `/Product/Search?title=${data.title}&page=${data.page}&language=${data.language}`
      );

      console.log("Text search response:", response.data.result);
      
      if (data.page === 1) {
        dispatch(setSearchTextResults(response.data.result));
      } else {
        dispatch(appendSearchTextResults(response.data.result));
      }
      
      dispatch(setCurrentPage(data.page));
      dispatch(setHasMore(response.data.result && response.data.result.length > 0));
    } catch (error: any) {
      console.error("Text search error:", error);
      dispatch(setError(error.message || "Unexpected error"));
    } finally {
      if (data.page === 1) {
        dispatch(setLoading(false));
      } else {
        dispatch(setLoadingMore(false));
      }
    }
  };
};
