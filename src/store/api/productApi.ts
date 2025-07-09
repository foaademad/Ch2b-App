import { addMoreProducts, getProductsBest, getProductsNew, setCurrentCategory, setCurrentProduct, setError, setLoading, setLoadingMore } from "../slice/productSlice";
import api from "../utility/api/api";
import { ProductDetailsDto, ProductsHomeResponse } from "../utility/interfaces/productInterface";

export const getProducts = () => async (dispatch: any) => {
    try {
        dispatch(setLoading(true));
        const response = await api.get("/Product/getProductsHome");
        const data = response.data as ProductsHomeResponse;
        if (data.isSuccess) {
            dispatch(getProductsBest(data.result.productsBest));
            dispatch(getProductsNew(data.result.productsNew));
        } else {
            dispatch(setError("Failed to fetch products"));
        }
        console.log(data);
        
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
        dispatch(setError(errorMessage));
    } finally {
        dispatch(setLoading(false));
    }
};

export const getProductById = (id: string) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true));
        const response = await api.get(`/Product/detailsproduct/${id}`);
        const data = response.data.result as ProductDetailsDto;
        dispatch(setCurrentProduct(data));
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
        dispatch(setError(errorMessage));
    } finally {
        dispatch(setLoading(false));
    }
}


export const getallProductByCategoryId = (
  categoryId: string,
  page: number = 1,
  pageSize: number = 10,
  loadMore: boolean = false,
  name?: string,
  nameEn?: string
) => async (dispatch: any) => {
  if (!categoryId || categoryId === 'undefined') {
    dispatch(setError('Invalid category ID'));
    return;
  }

  try {
    if (!loadMore) {
      dispatch(setLoading(true));
    } else {
      dispatch(setLoadingMore(true));
    }
    const response = await api.get(`/Product/getalltocatgeory?categoryId=${categoryId}&page=${page}&pageSize=${pageSize}`);
    const data = response.data;

    if (data.isSuccess) {
      const products = Array.isArray(data.result) ? data.result : [];
      // تحقق من أن عدد المنتجات المستلمة يساوي pageSize لتحديد ما إذا كان هناك المزيد
      const hasMore = products.length === pageSize;
      
      if (loadMore) {
        dispatch(addMoreProducts({
          products,
          hasMore: hasMore
        }));
      } else {
        dispatch(setCurrentCategory({
          products,
          hasMore: hasMore,
          currentPage: page,
          categoryId,
          name,
          nameEn
        }));
      }
    } else {
      dispatch(setError(data.message || 'Failed to fetch category products'));
    }
  } catch (error: any) {
    const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
    dispatch(setError(errorMessage));
  } finally {
    if (!loadMore) {
      dispatch(setLoading(false));
    } else {
      dispatch(setLoadingMore(false));
    }
  }
};