



import { AppDispatch, RootState } from "../store";
import api from "../utility/api/api";
import { setLoading, setError, setProfile } from "../slice/profileSlice";

export const getProfile = () => {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const userId = getState().auth.authModel?.result?.userId;
        const token = getState().auth.authModel?.result?.token;
        try {
            dispatch(setLoading(true));
            const response = await api.get(`/User/getuserbyid/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            dispatch(setProfile(response.data.result));
            return response.data;
        } catch (error: any) {
            console.error("Error fetching profile:", error);
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }
}