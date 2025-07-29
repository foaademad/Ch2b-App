// حالات الطلبات وترجماتها
export const ORDER_STATUSES = {
  0: 'Pending',
  1: 'Reviewed', 
  2: 'PayMentCompelete',
  3: 'Processing',
  4: 'Shipped',
  5: 'DeliveredCountry',
  6: 'DeliveredHome',
  7: 'Cancelled',
  8: 'Refunded',
  9: 'Returned',
  10: 'Failed'
} as const;

// ترجمة حالات الطلبات للعربية
export const ORDER_STATUSES_AR = {
  0: 'معلق',
  1: 'تمت المراجعة',
  2: 'مكتمل الدفع',
  3: 'قيد المعالجة',
  4: 'تم الشحن',
  5: 'تم التسليم في البلد',
  6: 'تم التسليم للمنزل',
  7: 'ملغي',
  8: 'تم الاسترداد',
  9: 'تم الإرجاع',
  10: 'فشل'
} as const;

// ألوان حالات الطلبات
export const ORDER_STATUS_COLORS = {
  0: '#FFA000', // Pending - برتقالي
  1: '#2196F3', // Reviewed - أزرق
  2: '#4CAF50', // PayMentCompelete - أخضر
  3: '#FF9800', // Processing - برتقالي غامق
  4: '#2196F3', // Shipped - أزرق
  5: '#4CAF50', // DeliveredCountry - أخضر
  6: '#4CAF50', // DeliveredHome - أخضر
  7: '#f44336', // Cancelled - أحمر
  8: '#9C27B0', // Refunded - بنفسجي
  9: '#FF5722', // Returned - أحمر برتقالي
  10: '#f44336' // Failed - أحمر
} as const;

// دالة للحصول على نص الحالة
// تقبل رقم أو نص وتعيد النص المناسب للحالة باللغة المطلوبة
export const getOrderStatusText = (status: number | string, language: 'en' | 'ar' = 'en'): string => {
  // تحويل النص إلى رقم إذا كان مطلوباً
  const numericStatus = typeof status === 'string' ? parseInt(status, 10) : status;
  
  // التحقق من أن القيمة صحيحة
  if (isNaN(numericStatus) || numericStatus < 0 || numericStatus > 10) {
    console.warn(`Invalid order status: ${status}, using default text`);
    return language === 'ar' ? 'غير معروف' : 'Unknown';
  }
  
  if (language === 'ar') {
    return ORDER_STATUSES_AR[numericStatus as keyof typeof ORDER_STATUSES_AR] || 'غير معروف';
  }
  return ORDER_STATUSES[numericStatus as keyof typeof ORDER_STATUSES] || 'Unknown';
};

// دالة للحصول على لون الحالة
// تقبل رقم أو نص وتعيد اللون المناسب للحالة
export const getOrderStatusColor = (status: number | string): string => {
  // تحويل النص إلى رقم إذا كان مطلوباً
  const numericStatus = typeof status === 'string' ? parseInt(status, 10) : status;
  
  // التحقق من أن القيمة صحيحة
  if (isNaN(numericStatus) || numericStatus < 0 || numericStatus > 10) {
    console.warn(`Invalid order status: ${status}, using default color`);
    return '#666'; // اللون الافتراضي
  }
  
  return ORDER_STATUS_COLORS[numericStatus as keyof typeof ORDER_STATUS_COLORS] || '#666';
};

// دالة للتحقق من صحة حالة الطلب
export const isValidOrderStatus = (status: number | string): boolean => {
  const numericStatus = typeof status === 'string' ? parseInt(status, 10) : status;
  return !isNaN(numericStatus) && numericStatus >= 0 && numericStatus <= 10;
};

// قائمة بجميع حالات الطلبات للاستخدام في القوائم المنسدلة
export const ORDER_STATUS_OPTIONS = [
  { value: 0, label: 'Pending', labelAr: 'معلق' },
  { value: 1, label: 'Reviewed', labelAr: 'تمت المراجعة' },
  { value: 2, label: 'PayMentCompelete', labelAr: 'مكتمل الدفع' },
  { value: 3, label: 'Processing', labelAr: 'قيد المعالجة' },
  { value: 4, label: 'Shipped', labelAr: 'تم الشحن' },
  { value: 5, label: 'DeliveredCountry', labelAr: 'تم التسليم في البلد' },
  { value: 6, label: 'DeliveredHome', labelAr: 'تم التسليم للمنزل' },
  { value: 7, label: 'Cancelled', labelAr: 'ملغي' },
  { value: 8, label: 'Refunded', labelAr: 'تم الاسترداد' },
  { value: 9, label: 'Returned', labelAr: 'تم الإرجاع' },
  { value: 10, label: 'Failed', labelAr: 'فشل' }
];

