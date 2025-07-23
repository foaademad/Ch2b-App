import { setError, setLoading, setProblem } from "../slice/supportSlice";
import { AppDispatch } from "../store";
import api from "../utility/api/api";
import { ProblemInterface } from "../utility/interfaces/supportInterface";

export const createProblem = (data: ProblemInterface) => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            const response = await api.post("/Problem/create-problem", data);
            console.log('API Response:', response.data);
            dispatch(setProblem(response.data.result));
            return response.data;
        } catch (error: any) {
            console.error("Error creating problem:", error);
            dispatch(setError(error.message));
            return { error: error.message }; // إرجاع كائن خطأ بدلاً من undefined
        } finally {
            dispatch(setLoading(false));
        }
    }
};

