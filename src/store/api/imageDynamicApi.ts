import { setError, setImage, setLoading } from "../slice/imageDynamicSlice";
import api from "../utility/api/api";

export const getImageDynamic = () => async (dispatch: any) => {
    try {
        dispatch(setLoading(true));

        const response = await api.get("/ImagesDynamic/get-ImagesDynamic");

        // استخراج مصفوفة الصور من result.images
        const images = response.data.result.images;

        console.log("data from image dynamic from api", images);

        if (Array.isArray(images)) {
            dispatch(setImage(images)); // حفظ الصور في الـ Redux
        } else {
            dispatch(setError("Invalid images data structure"));
        }

    } catch (error: any) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};
