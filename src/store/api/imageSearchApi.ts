// import {
//   setError,
//   setImageSearchResults,
//   setLoading,
// } from "../slice/imageSearchSlice";
// import { AppDispatch } from "../store";
// import api from "../utility/api/api";

// export interface ImageSearchRequist {
//   file: File;
//   page: number;
// }

// export const searchImage = (data: ImageSearchRequist) => {
//   return async (dispatch: AppDispatch) => {
//     dispatch(setLoading(true));
//     try {
//       const formData = new FormData();
//       formData.append("image", data.file);
//       formData.append("page", data.page.toString());
//       const response = await api.post("/Product/search-image", formData);
//       console.log("Image search response:", response.data.result);
      
//       dispatch(setImageSearchResults(response.data.result));
//     } catch (error: any) {
//       dispatch(setError(error.message));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };
// };

// ===============================================================================
// import {
//   setError,
//   setImageSearchResults,
//   setSearchTextResults,
//   setLoading,
// } from "../slice/imageSearchSlice";
// import { AppDispatch } from "../store";
// import api from "../utility/api/api";

// export interface ImageSearchRequest {
//   file: {
//     uri: string;
//     name: string;
//     type: string;
//   };
//   page: number;
// }

// export interface TextSearchRequest {
//   title: string;
//   page: number;
//   language: string;
// }

// // 🔍 دالة البحث بالصورة
// export const searchImage = (data: ImageSearchRequest) => {
//   return async (dispatch: AppDispatch) => {
//     dispatch(setLoading(true));

//     try {
//       const formData = new FormData();
//       formData.append("image", {
//         uri: data.file.uri,
//         name: data.file.name,
//         type: data.file.type,
//       } as any);
//       formData.append("page", data.page.toString());

//       const response = await api.post("/Product/search-image", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       console.log("Image search response:", response.data.result);
//       dispatch(setImageSearchResults(response.data.result));
//     } catch (error: any) {
//       console.error("Image search error:", error);
//       dispatch(setError(error.message || "Unexpected error"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };
// };

// // 🔎 دالة البحث النصي
// export const searchByText = (data: TextSearchRequest) => {
//   return async (dispatch: AppDispatch) => {
//     dispatch(setLoading(true));

//     try {
//       const response = await api.get(
//         `/Product/Search?title=${data.title}&page=${data.page}&language=${data.language}`
//       );

//       console.log("Text search response:", response.data.result);
//       dispatch(setSearchTextResults(response.data.result));
//     } catch (error: any) {
//       console.error("Text search error:", error);
//       dispatch(setError(error.message || "Unexpected error"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };
// };
// =====================================================================

import {
  setError,
  setImageSearchResults,
  setSearchTextResults,
  setLoading,
} from "../slice/imageSearchSlice";
import { AppDispatch } from "../store";
import api from "../utility/api/api";

export interface ImageSearchRequest {
  file: File;
  page: number;
}

export interface TextSearchRequest {
  title: string;
  page: number;
  language: string;
}

export const searchImage = (data: ImageSearchRequest) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const formData = new FormData();
      formData.append("image", data.file);
      formData.append("page", data.page.toString());
      const response = await api.post("/Product/search-image", formData);
      dispatch(setImageSearchResults(response.data.result));
    } catch (error: any) {
      dispatch(setError(error.message || "Image search failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const searchByText = (data: TextSearchRequest) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setLoading(true));
    try {
      const url = `/Product/Search?title=${encodeURIComponent(data.title)}&page=${data.page}&language=${data.language}`;
      const response = await api.get(url);
      dispatch(setSearchTextResults(response.data.result));
    } catch (error: any) {
      dispatch(setError(error.message || "Text search failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };
};
