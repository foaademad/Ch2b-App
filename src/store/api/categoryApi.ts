import { addCategories, getCategories, setError, setLoading } from "../slice/categorySlice";
import api from "../utility/api/api";
import { CategoryApiResponse } from "../utility/interfaces/categoryInterface";

export const getCategoriesApi = (page = 1, pagesize = 20, addMode = false) => async (dispatch: any) => {
    try {
        dispatch(setLoading(true));
        const response = await api.get(`/Category/getall?page=${page}&pagesize=${pagesize}`);
        const data = response.data as CategoryApiResponse;
        if (addMode) {
            dispatch(addCategories(data.result));
        } else {
            dispatch(getCategories(data.result));
        }
    } catch (error) {
        dispatch(setError(error as string));
    } finally {
        dispatch(setLoading(false));
    }
}