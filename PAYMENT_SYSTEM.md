# نظام الدفع - Payment System

## نظرة عامة
تم إنشاء نظام دفع متكامل للمنتجات التي حالتها "Reviewed" مع دعم طريقتين للدفع:
- PayPal
- Bakiyya

## الملفات الرئيسية

### 1. `src/store/utility/paymentHelper.ts`
الملف الرئيسي الذي يحتوي على جميع وظائف الدفع الثابتة (Static Functions).

#### الوظائف المتاحة:
- `processPayment()` - معالجة الدفع الرئيسية
- `processPayPalPayment()` - معالجة الدفع عبر PayPal
- `processBakiyyaPayment()` - معالجة الدفع عبر Bakiyya
- `calculatePaymentFees()` - حساب رسوم الدفع
- `getTotalWithFees()` - حساب المبلغ الإجمالي مع الرسوم
- `getPaymentInfo()` - معلومات طرق الدفع

### 2. `app/orders.tsx`
صفحة الطلبات التي تحتوي على:
- زر الدفع للمنتجات التي حالتها "Reviewed"
- Modal اختيار طريقة الدفع
- عرض ملخص الدفع والرسوم

### 3. ملفات الترجمة
- `locales/ar/translation.json` - الترجمات العربية
- `locales/en/translation.json` - الترجمات الإنجليزية

## كيفية الاستخدام

### 1. إضافة زر الدفع
```tsx
{(order.status === 1 || order.orderStatus === 1) && (
  <TouchableOpacity 
    style={styles.paymentButton}
    onPress={() => handlePaymentPress(order)}
  >
    <CreditCard size={16} color="#fff" />
    <Text style={styles.paymentButtonText}>
      {t('profile.payment.pay_now')}
    </Text>
  </TouchableOpacity>
)}
```

### 2. معالجة الدفع
```tsx
import { processPayment } from '../src/store/utility/paymentHelper';

const paymentResult = await processPayment(
  orderId,
  paymentMethod, // 'paypal' | 'bakiyya'
  amount
);
```

### 3. حساب الرسوم
```tsx
import { calculatePaymentFees, getTotalWithFees } from '../src/store/utility/paymentHelper';

const fees = calculatePaymentFees(amount, 'paypal');
const totalWithFees = getTotalWithFees(amount, 'paypal');
```

## رسوم الدفع

### PayPal
- النسبة: 2.9%
- الرسوم الثابتة: $0.30
- وقت المعالجة: فوري

### Bakiyya
- النسبة: 1.5%
- الرسوم الثابتة: $0.25
- وقت المعالجة: 1-2 يوم عمل

## حالات الطلبات المدعومة

### حالة "Reviewed" (رقم 1)
- تظهر زر الدفع
- يمكن للمستخدم اختيار طريقة الدفع
- بعد الدفع الناجح، تتغير الحالة إلى "مكتمل الدفع" (رقم 2)

## التخصيص والتطوير

### 1. إضافة طريقة دفع جديدة
1. أضف الطريقة الجديدة في `paymentHelper.ts`
2. أضف الترجمات في ملفات الترجمة
3. حدث Modal الدفع في `orders.tsx`

### 2. ربط مع API حقيقي
1. استبدل الوظائف الثابتة في `paymentHelper.ts`
2. أضف معالجة الأخطاء المناسبة
3. حدث رسائل النجاح والفشل

### 3. إضافة ميزات جديدة
- التحقق من حالة الدفع
- إلغاء الدفع
- سجل المعاملات
- إشعارات الدفع

## الأمان

### الميزات الحالية:
- التحقق من صحة البيانات
- معالجة الأخطاء
- رسائل تأكيد للمستخدم

### التوصيات المستقبلية:
- تشفير بيانات الدفع
- التحقق من الهوية
- حماية من الاحتيال
- سجل التدقيق

## الاختبار

### اختبار الوظائف:
```tsx
// اختبار نجاح الدفع
const result = await processPayment('order123', 'paypal', 100);
console.log(result.success); // true/false

// اختبار حساب الرسوم
const fees = calculatePaymentFees(100, 'paypal');
console.log(fees); // 3.20
```

## الدعم والمساعدة

لأي استفسارات أو مشاكل:
1. راجع هذا الملف
2. تحقق من console logs
3. راجع ملف `paymentHelper.ts`
4. تأكد من صحة الترجمات

## التحديثات المستقبلية

- [ ] ربط مع PayPal API حقيقي
- [ ] ربط مع Bakiyya API حقيقي
- [ ] إضافة طرق دفع إضافية
- [ ] تحسين واجهة المستخدم
- [ ] إضافة إشعارات push
- [ ] تحسين الأمان 