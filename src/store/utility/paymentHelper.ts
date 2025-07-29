// Payment Helper - وظائف الدفع الثابتة
// يمكن تعديل هذه الوظائف لاحقاً لربطها مع API حقيقي

export interface PaymentData {
  orderId: string;
  paymentMethod: 'paypal' | 'bakiyya';
  amount: number;
  currency: string;
  timestamp: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  paymentStatus?: 'completed' | 'failed' | 'pending';
}

// محاكاة معالجة الدفع عبر PayPal
export const processPayPalPayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // محاكاة نجاح الدفع (يمكن تعديلها لاحقاً)
  const isSuccess = Math.random() > 0.1; // 90% نجاح
  
  if (isSuccess) {
    return {
      success: true,
      message: 'Payment completed successfully via PayPal',
      transactionId: `PP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      paymentStatus: 'completed'
    };
  } else {
    return {
      success: false,
      message: 'Payment failed. Please try again.',
      paymentStatus: 'failed'
    };
  }
};

// محاكاة معالجة الدفع عبر Bakiyya
export const processBakiyyaPayment = async (paymentData: PaymentData): Promise<PaymentResponse> => {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // محاكاة نجاح الدفع (يمكن تعديلها لاحقاً)
  const isSuccess = Math.random() > 0.05; // 95% نجاح
  
  if (isSuccess) {
    return {
      success: true,
      message: 'Payment completed successfully via Bakiyya',
      transactionId: `BK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      paymentStatus: 'completed'
    };
  } else {
    return {
      success: false,
      message: 'Payment failed. Please try again.',
      paymentStatus: 'failed'
    };
  }
};

// دالة رئيسية لمعالجة الدفع
export const processPayment = async (
  orderId: string, 
  paymentMethod: 'paypal' | 'bakiyya', 
  amount: number
): Promise<PaymentResponse> => {
  const paymentData: PaymentData = {
    orderId,
    paymentMethod,
    amount,
    currency: 'USD',
    timestamp: new Date().toISOString()
  };

  console.log('💳 Processing payment:', paymentData);

  try {
    let response: PaymentResponse;
    
    switch (paymentMethod) {
      case 'paypal':
        response = await processPayPalPayment(paymentData);
        break;
      case 'bakiyya':
        response = await processBakiyyaPayment(paymentData);
        break;
      default:
        throw new Error('Unsupported payment method');
    }

    console.log('💳 Payment result:', response);
    return response;
    
  } catch (error) {
    console.error('❌ Payment error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred during payment',
      paymentStatus: 'failed'
    };
  }
};

// دالة للتحقق من حالة الدفع
export const checkPaymentStatus = async (transactionId: string): Promise<PaymentResponse> => {
  // محاكاة التحقق من حالة الدفع
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    message: 'Payment status checked successfully',
    transactionId,
    paymentStatus: 'completed'
  };
};

// دالة لإلغاء الدفع
export const cancelPayment = async (transactionId: string): Promise<PaymentResponse> => {
  // محاكاة إلغاء الدفع
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    message: 'Payment cancelled successfully',
    transactionId,
    paymentStatus: 'failed'
  };
};

// دالة للحصول على معلومات الدفع
export const getPaymentInfo = (paymentMethod: 'paypal' | 'bakiyya') => {
  const paymentInfo = {
    paypal: {
      name: 'PayPal',
      description: 'Pay with PayPal',
      icon: 'PayPal',
      color: '#0070ba',
      fees: '2.9% + $0.30',
      processingTime: 'Instant'
    },
    bakiyya: {
      name: 'Bakiyya',
      description: 'Pay with Bakiyya',
      icon: 'Wallet',
      color: '#36c7f6',
      fees: '1.5% + $0.25',
      processingTime: '1-2 business days'
    }
  };

  return paymentInfo[paymentMethod];
};

// دالة لحساب رسوم الدفع
export const calculatePaymentFees = (amount: number, paymentMethod: 'paypal' | 'bakiyya'): number => {
  const fees = {
    paypal: { percentage: 0.029, fixed: 0.30 },
    bakiyya: { percentage: 0.015, fixed: 0.25 }
  };

  const methodFees = fees[paymentMethod];
  return (amount * methodFees.percentage) + methodFees.fixed;
};

// دالة للحصول على المبلغ الإجمالي مع الرسوم
export const getTotalWithFees = (amount: number, paymentMethod: 'paypal' | 'bakiyya'): number => {
  const fees = calculatePaymentFees(amount, paymentMethod);
  return amount + fees;
}; 