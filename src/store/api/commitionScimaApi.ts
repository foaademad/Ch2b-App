import { setCommition, setError, setLoading } from "../slice/commitionScimaSlice";
import api from "../utility/api/api";
import ICommition from "../utility/interfaces/commitionInterface";

export const getCommition = () => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
        const response = await api.get(`/CommissionScheme/getAll`);
        console.log("Commission API Response:", response.data);
        
        // إذا كانت البيانات array، خذ أول عنصر أو ابحث عن المناسب
        const data = response.data.result || response.data;
        
        if (Array.isArray(data) && data.length > 0) {
            // ابحث عن أول عمولة نشطة أو خذ الأولى
            const activeCommission = data.find((item: ICommition) => item.isActive) || data[0];
            dispatch(setCommition(activeCommission));
        } else if (data && !Array.isArray(data)) {
            // إذا كانت البيانات object واحد
            dispatch(setCommition(data as ICommition));
        } else {
            console.warn("No commission data found");
            dispatch(setError("No commission data available"));
        }
    } catch (error: any) {
        console.error("Commission API Error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to fetch commission data";
        dispatch(setError(errorMessage));
    } finally {
        dispatch(setLoading(false));
    }
}   

