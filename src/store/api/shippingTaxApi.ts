import { setError, setLoading, setShippingTax } from "../slice/shippingTaxSlice";
import api from "../utility/api/api";
import IShippingTax from "../utility/interfaces/shippingTaxInterface";

// دالة mapping لتحويل بيانات API إلى الشكل المطلوب
function mapShippingTaxApiToModel(apiObj: any): IShippingTax {
  return {
    id: apiObj.id,
    userType: apiObj.typeToShiping, // mapping من typeToShiping إلى userType
    lowerLimit: apiObj.lowerLimit,
    upperLimit: apiObj.upperLimit,
    shippingPrice: apiObj.price, // mapping من price إلى shippingPrice
    startDate: apiObj.createAt, // mapping من createAt إلى startDate
    endDate: apiObj.updateAt, // mapping من updateAt إلى endDate
    isActive: apiObj.isActived, // mapping من isActived إلى isActive
  };
}

export const getShippingTax = () => async (dispatch: any) => {
    dispatch(setLoading(true));
    try {
        const response = await api.get(`/ShippingPrice/getall`);
        console.log("Shipping Tax API Response:", response.data);
        
        // إذا كانت البيانات array، خذ أول عنصر أو ابحث عن المناسب
        const data = response.data.result || response.data;
        
        if (Array.isArray(data) && data.length > 0) {
            // ابحث عن أول shipping tax نشط أو خذ الأولى
            const activeShippingTax = data.find((item: any) => item.isActived) || data[0];
            const mappedData = mapShippingTaxApiToModel(activeShippingTax);
            console.log("Mapped Shipping Tax Data:", mappedData);
            dispatch(setShippingTax(mappedData));
        } else if (data && !Array.isArray(data)) {
            // إذا كانت البيانات object واحد
            const mappedData = mapShippingTaxApiToModel(data);
            console.log("Mapped Shipping Tax Data:", mappedData);
            dispatch(setShippingTax(mappedData));
        } else {
            console.warn("No shipping tax data found");
            dispatch(setError("No shipping tax data available"));
        }
    } catch (error: any) {
        console.error("Shipping Tax API Error:", error);
        const errorMessage = error.response?.data?.message || error.message || "Failed to fetch shipping tax data";
        dispatch(setError(errorMessage));
    } finally {
        dispatch(setLoading(false));
    }
}
