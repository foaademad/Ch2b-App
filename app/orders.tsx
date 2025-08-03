
import { useLanguage } from '@/src/context/LanguageContext';
import { TransferFormValues } from '@/src/store/utility/interfaces/orderInterface';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { ArrowLeft, Building2, CreditCard, RefreshCw, Upload, Wallet } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Linking, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Shadows } from '../constants/Shadows';
import { createPayPalPayment, fetchAllBankAccounts, getAllOrdersToUser, payByAccountBank } from '../src/store/api/orderApi';
import { RootState } from '../src/store/store';
import { getOrderStatusColor, getOrderStatusText } from '../src/store/utility/orderStatusHelper';



const OrdersScreen = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isRTL, setIsRTL] = useState(language === 'ar');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showBankTransferModal, setShowBankTransferModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'bakiyya' | null>(null);
  const [transferReceiptImage, setTransferReceiptImage] = useState<{ uri: string; type?: string; name?: string } | null>(null);
  const [currentStep, setCurrentStep] = useState(1); // Track current step
  
  // Redux state
  const { orders, loading, error } = useSelector((state: RootState) => state.order);
  const { authModel } = useSelector((state: RootState) => state.auth);
  const { bankAccounts } = useSelector((state: RootState) => state.bankAccount);
  
  // Debug: Log bank accounts to console
  console.log('🏦 Bank Accounts from Redux:', bankAccounts);
  useEffect(() => {
    setIsRTL(language === 'ar');
    if (authModel?.result?.userId) {
      dispatch(getAllOrdersToUser(authModel.result.userId) as any);
    }
  }, [language, dispatch, authModel]);

  useEffect(() => {
    if (authModel?.result?.userId) {
      dispatch(fetchAllBankAccounts() as any);
    }
  }, [dispatch, authModel]);

  const handleRefresh = () => {
    if (authModel?.result?.userId) {
      dispatch(getAllOrdersToUser(authModel.result.userId) as any);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
    } catch (error: any) {
      return dateString;
    }
  };

  // const calculateReviewedProductsTotal = () => {
  //   return orders
  //     .filter(order => order.status === 1 || order.orderStatus === 1)
  //     .reduce((total, order) => total + (order.totalPrice || 0), 0);
  // };

  const handlePaymentPress = (order: any) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
    setSelectedPaymentMethod(null);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedOrder(null);
    setSelectedPaymentMethod(null);
  };

  const handleCloseBankTransferModal = () => {
    setShowBankTransferModal(false);
    setSelectedOrder(null);
    setSelectedPaymentMethod(null);
    setTransferReceiptImage(null);
    setCurrentStep(1); // Reset to first step
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setTransferReceiptImage(result.assets[0]);
      }
    } catch (error: any) {
      console.error('Error picking image:', error);
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'حدث خطأ أثناء اختيار الصورة' : 'An error occurred while selecting the image'
      );
    }
  };

  const bankTransferValidationSchema = Yup.object().shape({
    bankAccountToTransferTo: Yup.string()
      .required(language === 'ar' ? 'يرجى اختيار البنك' : 'Please select a bank'),
    senderBankName: Yup.string()
      .required(language === 'ar' ? 'اسم البنك مطلوب' : 'Bank name is required')
      .min(2, language === 'ar' ? 'اسم البنك يجب أن يكون على الأقل حرفين' : 'Bank name must be at least 2 characters'),
    senderAccountName: Yup.string()
      .required(language === 'ar' ? 'اسم الحساب مطلوب' : 'Account name is required')
      .min(2, language === 'ar' ? 'اسم الحساب يجب أن يكون على الأقل حرفين' : 'Account name must be at least 2 characters'),
    senderAccountNumber: Yup.string()
      .required(language === 'ar' ? 'رقم الحساب مطلوب' : 'Account number is required')
      .matches(/^\d+$/, language === 'ar' ? 'رقم الحساب يجب أن يحتوي على أرقام فقط' : 'Account number must contain only numbers'),
    amount: Yup.number()
      .required(language === 'ar' ? 'المبلغ مطلوب' : 'Amount is required')
      .positive(language === 'ar' ? 'المبلغ يجب أن يكون موجب' : 'Amount must be positive')
      .min(0.01, language === 'ar' ? 'المبلغ يجب أن يكون أكبر من صفر' : 'Amount must be greater than zero'),
  });

  // handle bank transfer submit
  const handleBankTransferSubmit = async (values: any) => {
    if (!transferReceiptImage) {
      Toast.show({
        type: 'error',
        text1: language === 'ar' ? 'صورة الإيصال مطلوبة' : 'Receipt image required',
        text2: language === 'ar' ? 'يرجى اختيار صورة إيصال التحويل' : 'Please select a transfer receipt image'
      });
     
      return;
    }

    try {
      // تحويل الصورة إلى File
      const response = await fetch(transferReceiptImage.uri);
      const blob = await response.blob();
      const file = new File([blob], 'transfer_receipt.jpg', { type: 'image/jpeg' });

      const transferData = {
        userId: authModel?.result?.userId,
        accountId: values.bankAccountToTransferTo,
        toAccount: selectedOrder?.id,
        fromBankName: values.senderBankName,
        fromAccountName: values.senderAccountName,
        fromAccountNumber: values.senderAccountNumber,
        transferImage: file,
        amount: values.amount,
        orderId: selectedOrder?.id,
      };

      console.log('Bank Transfer Data:', transferData);
      
     

      dispatch(payByAccountBank(authModel?.result?.userId as string, transferData as TransferFormValues) as any);

      handleCloseBankTransferModal();
      handleClosePaymentModal();
      Toast.show({
        type: 'success',
        text1: language === 'ar' ? 'تم إرسال بيانات التحويل' : 'Transfer details sent',
        text2: language === 'ar' ? 'سيتم مراجعة التحويل قريباً' : 'Transfer will be reviewed soon'
      });
    } catch (error: any) {
      console.error('Error processing image:', error);
      Toast.show({
        type: 'error',
        text1: language === 'ar' ? 'خطأ في معالجة الصورة' : 'Error processing image',
        text2: language === 'ar' ? 'يرجى المحاولة مرة أخرى' : 'Please try again'
      });
    }
  };

  const handlePaymentMethodSelect = (method: 'paypal' | 'bakiyya') => {
    setSelectedPaymentMethod(method);
  };

  const handleProcessPayment = async () => {
    if (!selectedOrder || !selectedPaymentMethod) {
      Toast.show({
        type: 'error',
        text1: t('error'),
        text2: t('profile.payment.select_payment_method')
      });
      return;
    }

    if (selectedPaymentMethod === 'paypal') {
      try {
        const result = await dispatch(createPayPalPayment(selectedOrder.id) as any);
        
        console.log('💳 PayPal API Response:', result);
        console.log('💳 PayPal API Data:', result.data);
        console.log('💳 PayPal API Message:', result.message);
        
        if (result.success) {
          console.log('🔗 PayPal Payment Link:', result.data?.linkPayment);
          
          if (result.data?.linkPayment && typeof result.data.linkPayment === 'string') {
            const paypalUrl = result.data.linkPayment;
            const supported = await Linking.canOpenURL(paypalUrl);
            
            if (supported) {
              await Linking.openURL(paypalUrl);
              handleClosePaymentModal();
              
              Toast.show({
                type: 'success',
                text1: language === 'ar' ? 'تم فتح PayPal' : 'PayPal Opened',
                text2: language === 'ar' ? 'يرجى إتمام عملية الدفع' : 'Please complete your payment'
              });
              
              console.log('💳 Payment link opened - waiting for actual payment completion');
            } else {
              Toast.show({
                type: 'info',
                text1: language === 'ar' ? 'رابط الدفع' : 'Payment Link',
                text2: language === 'ar' ? 'تم نسخ رابط الدفع' : 'Payment link copied'
              });
            }
          } else {
            handleClosePaymentModal();
            
            Toast.show({
              type: 'success',
              text1: language === 'ar' ? 'تم إنشاء الدفع' : 'Payment Created',
              text2: language === 'ar' 
                ? `المبلغ: ${selectedOrder.totalPrice?.toFixed(2)} - رقم الطلب: ${selectedOrder.id}`
                : `Amount: ${selectedOrder.totalPrice?.toFixed(2)} - Order: ${selectedOrder.id}`
            });
          }
        } else {
          Toast.show({
            type: 'error',
            text1: t('error'),
            text2: result.message || (language === 'ar' ? 'فشل في إنشاء الدفع' : 'Failed to create payment')
          });
        }
      } catch (error) {
        console.error('❌ Payment error:', error);
        Toast.show({
          type: 'error',
          text1: t('error'),
          text2: language === 'ar' ? 'خطأ في إنشاء الدفع' : 'Error creating payment'
        });
      }
    } else if (selectedPaymentMethod === 'bakiyya') {
      setShowBankTransferModal(true);

    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.orders.title')}</Text>
        <TouchableOpacity 
          style={[styles.refreshButton, { marginLeft: isRTL ? 0 : 'auto', marginRight: isRTL ? 'auto' : 0 }]}
          onPress={handleRefresh}
          disabled={loading}
        >
          <RefreshCw size={20} color="#36c7f6" style={{ opacity: loading ? 0.5 : 1 }} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{t('profile.coupons.loading_orders')}</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
              <Text style={styles.retryButtonText}>{t('profile.coupons.order_retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{t('profile.coupons.no_orders_found')}</Text>
          </View>
        ) : (
          orders.map((order: any) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>
                    {t('profile.coupons.order_number')}{(order.id || order.orderId).slice(0, 15) + '...'}
                  </Text>
                  <Text style={styles.orderDate}>
                    {formatDate(order.createAt || order.orderDate)}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { 
                  backgroundColor: getOrderStatusColor(order.status || order.orderStatus)
                }]}>
                  <Text style={styles.statusText}>
                    {(() => {
                      const status = order.status || order.orderStatus;
                      return getOrderStatusText(status, language as 'en' | 'ar');
                    })()}
                  </Text>
                </View>
              </View>

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

              <View style={styles.itemsContainer}>
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item: any, index: number) => (
                    <View key={index} style={styles.itemRow}>
                      <Image 
                        source={{ uri: item.linkItemUrl || item.image }} 
                        style={styles.itemImage}
                      />
                      <View style={styles.itemDetails}>
                        <Text style={styles.itemName}>
                          {item.name || `Product ${index + 1}`}
                        </Text>
                        <Text style={styles.itemQuantity}>
                          {t('profile.coupons.order_items')}: {item.quntity || item.quantity || 1}
                        </Text>
                        <Text style={styles.itemPrice}>
                          {(item.totalPrice || 0).toFixed(2)} SAR
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noItemsText}>
                    {t('profile.coupons.no_orders_found')}
                  </Text>
                )}
              </View>

              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    {language === 'ar' ? 'سعر المنتجات' : 'Products Price'}
                  </Text>
                  <Text style={styles.priceValue}>
                      {((order.totalPrice || 0) - (order.shippingPrice || 0) - (order.tax || 0)).toFixed(2)} SAR
                  </Text>
                </View>
                
                {(order.shippingPrice && order.shippingPrice > 0) && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>
                      {language === 'ar' ? 'الشحن' : 'Shipping'}
                    </Text>
                    <Text style={styles.priceValue}>
                      {(order.shippingPrice || 0).toFixed(2)} SAR
                    </Text>
                  </View>
                )}
                
                {(order.tax && order.tax > 0) && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>
                      {language === 'ar' ? 'الضرائب' : 'Taxes'}
                    </Text>
                    <Text style={styles.priceValue}>
                      {(order.tax || 0).toFixed(2)} SAR
                    </Text>
                  </View>
                )}
                
                <View style={styles.priceDivider} />
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>{t('profile.coupons.order_total')}</Text>
                <Text style={styles.totalAmount}>
                  {(order.totalPrice || 0).toFixed(2)} SAR
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      {/* model of payment */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClosePaymentModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={styles.modalHeaderIcon}>
                  <CreditCard size={20} color="#fff" />
                </View>
                <Text style={styles.modalTitle}>
                  {t('profile.payment.title')}
                </Text>
              </View>
              <TouchableOpacity onPress={handleClosePaymentModal}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              {language === 'ar' 
                ? 'يرجى اختيار طريقة دفع لإتمام طلبك بأمان وسهولة'
                : 'Please choose a payment method to complete your order securely and easily'
              }
            </Text>

            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmountLabel}>
                {language === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}
              </Text>
              <Text style={styles.totalAmountValue}>
                SAR {selectedOrder?.totalPrice?.toFixed(2)}
              </Text>
            </View>

            <View style={styles.paymentMethodSection}>
              <View style={styles.sectionHeader}>
                <CreditCard size={16} color="#36c7f6" />
                <Text style={styles.sectionTitle}>
                  {language === 'ar' ? 'اختر طريقة الدفع' : 'Select Payment Method'}
                </Text>
              </View>

              <View style={styles.paymentOptions}>
                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    selectedPaymentMethod === 'paypal' && styles.selectedPaymentOption
                  ]}
                  onPress={() => handlePaymentMethodSelect('paypal')}
                >
                  <View style={styles.paymentOptionIcon}>
                    <Text style={styles.paypalIcon}>PayPal</Text>
                  </View>
                  <View style={styles.paymentOptionInfo}>
                    <Text style={[
                      styles.paymentOptionTitle,
                      selectedPaymentMethod === 'paypal' && styles.selectedPaymentText
                    ]}>
                      {language === 'ar' ? 'الدفع الإلكتروني' : 'Online Payment'}
                    </Text>
                    <Text style={[
                      styles.paymentOptionDescription,
                      selectedPaymentMethod === 'paypal' && styles.selectedPaymentText
                    ]}>
                      {language === 'ar' 
                        ? 'ادفع بأمان باستخدام بطاقة الائتمان أو المحفظة الرقمية'
                        : 'Pay securely with credit card or digital wallet'
                      }
                    </Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedPaymentMethod === 'paypal' && styles.selectedRadioButton
                  ]}>
                    {selectedPaymentMethod === 'paypal' && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.paymentOption,
                    selectedPaymentMethod === 'bakiyya' && styles.selectedPaymentOption
                  ]}
                  onPress={() => handlePaymentMethodSelect('bakiyya')}
                >
                  <View style={[styles.paymentOptionIcon, styles.bakiyyaIcon]}>
                    <Wallet size={20} color="#fff" />
                  </View>
                  <View style={styles.paymentOptionInfo}>
                    <Text style={[
                      styles.paymentOptionTitle,
                      selectedPaymentMethod === 'bakiyya' && styles.selectedPaymentText
                    ]}>
                      {language === 'ar' ? 'التحويل البنكي' : 'Bank Transfer'}
                    </Text>
                    <Text style={[
                      styles.paymentOptionDescription,
                      selectedPaymentMethod === 'bakiyya' && styles.selectedPaymentText
                    ]}>
                      {language === 'ar' 
                        ? 'حول الأموال مباشرة إلى حسابنا البنكي'
                        : 'Transfer money directly to our bank account'
                      }
                    </Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    selectedPaymentMethod === 'bakiyya' && styles.selectedRadioButton
                  ]}>
                    {selectedPaymentMethod === 'bakiyya' && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleClosePaymentModal}
              >
                <Text style={styles.cancelButtonText}>
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.confirmPaymentButton,
                  !selectedPaymentMethod && styles.disabledButton
                ]}
                onPress={handleProcessPayment}
                disabled={!selectedPaymentMethod}
              >
                <CreditCard size={16} color="#fff" />
                <Text style={styles.confirmPaymentText}>
                  {language === 'ar' ? 'تأكيد الدفع' : 'Confirm Payment'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bank Transfer Modal with Two Steps */}
      <Modal
        visible={showBankTransferModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseBankTransferModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bankTransferModalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <View style={[styles.modalHeaderIcon, { backgroundColor: '#ff9500' }]}>
                  <Building2 size={20} color="#fff" />
                </View>
                <Text style={styles.modalTitle}>
                  {language === 'ar' ? 'إرسال تفاصيل التحويل البنكي' : 'Send Bank Transfer Details'}
                </Text>
              </View>
              <TouchableOpacity onPress={handleCloseBankTransferModal}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Step Indicator */}
            <View style={styles.stepIndicatorContainer}>
              <View style={[styles.stepIndicator, currentStep === 1 ? styles.activeStep : styles.completedStep]}>
                <Text style={styles.stepIndicatorText}>1</Text>
              </View>
              <View style={styles.stepConnector} />
              <View style={[styles.stepIndicator, currentStep === 2 ? styles.activeStep : styles.inactiveStep]}>
                <Text style={styles.stepIndicatorText}>2</Text>
              </View>
            </View>
            <View style={styles.stepLabelsContainer}>
              <Text style={[styles.stepLabel, currentStep === 1 && styles.activeStepLabel]}>
                {language === 'ar' ? 'اختيار البنك' : 'Bank Selection'}
              </Text>
              <Text style={[styles.stepLabel, currentStep === 2 && styles.activeStepLabel]}>
                {language === 'ar' ? 'تفاصيل التحويل' : 'Transfer Details'}
              </Text>
            </View>

            <Formik
              initialValues={{
                bankAccountToTransferTo: '',
                senderBankName: '',
                senderAccountName: '',
                senderAccountNumber: '',
                amount: selectedOrder?.totalPrice?.toFixed(2) || ''
              }}
              validationSchema={bankTransferValidationSchema}
              onSubmit={handleBankTransferSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, setFieldValue }) => (
                <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                  {currentStep === 1 && (
                    <View style={styles.formSection}>
                      
                      <View style={styles.fullWidthInput}>
                        <Text style={styles.inputLabel}>
                          {language === 'ar' ? 'البنك المستلم' : 'Select Receiving Bank'}
                        </Text>
                        <Picker
                          selectedValue={values.bankAccountToTransferTo}
                          style={[styles.picker, errors.bankAccountToTransferTo && touched.bankAccountToTransferTo && styles.errorInput]}
                          onValueChange={(itemValue: any) => setFieldValue('bankAccountToTransferTo', itemValue)}
                        >
                          <Picker.Item label={language === 'ar' ? 'اختر البنك' : 'Select a bank'} value="" />
                          {bankAccounts.map((bank: any) => (
                            <Picker.Item key={bank.id} label={bank.nameOfBank} value={bank.id} style={{color: 'black'}}  />
                          ))}
                        </Picker>
                        {errors.bankAccountToTransferTo && touched.bankAccountToTransferTo && (
                          <Text style={styles.errorText}>{errors.bankAccountToTransferTo as string}</Text>
                        )}
                      </View>
                    </View>
                  )}

                  {currentStep === 2 && (
                    <>
                      <View style={styles.formSection}>
                        
                        <View style={styles.twoColumnLayout}>
                          <View style={styles.inputColumn}>
                            <Text style={styles.inputLabel}>
                              {language === 'ar' ? 'اسم البنك المرسل' : 'Sender Bank Name'}
                            </Text>
                            <TextInput
                              style={[styles.textInput, errors.senderBankName && touched.senderBankName && styles.errorInput]}
                              placeholder={language === 'ar' ? 'أدخل اسم البنك' : 'Enter bank name'}
                              placeholderTextColor="#999"
                              value={values.senderBankName}
                              onChangeText={handleChange('senderBankName')}
                              onBlur={handleBlur('senderBankName')}
                            />
                            {errors.senderBankName && touched.senderBankName && (
                              <Text style={styles.errorText}>{errors.senderBankName as string}</Text>
                            )}
                          </View>

                          <View style={styles.inputColumn}>
                            <Text style={styles.inputLabel}>
                              {language === 'ar' ? 'اسم الحساب المرسل' : 'Sender Account Name'}
                            </Text>
                            <TextInput
                              style={[styles.textInput, errors.senderAccountName && touched.senderAccountName && styles.errorInput]}
                              placeholder={language === 'ar' ? 'أدخل اسم الحساب' : 'Enter account name'}
                              placeholderTextColor="#999"
                              value={values.senderAccountName}
                              onChangeText={handleChange('senderAccountName')}
                              onBlur={handleBlur('senderAccountName')}
                            />
                            {errors.senderAccountName && touched.senderAccountName && (
                              <Text style={styles.errorText}>{errors.senderAccountName as string}</Text>
                            )}
                          </View>
                        </View>

                        <View style={styles.fullWidthInput}>
                          <Text style={styles.inputLabel}>
                            {language === 'ar' ? 'رقم الحساب المرسل' : 'Sender Account Number'}
                          </Text>
                          <TextInput
                            style={[styles.textInput, errors.senderAccountNumber && touched.senderAccountNumber && styles.errorInput]}
                            placeholder={language === 'ar' ? 'أدخل رقم الحساب' : 'Enter account number'}
                            placeholderTextColor="#999"
                            value={values.senderAccountNumber}
                            onChangeText={handleChange('senderAccountNumber')}
                            onBlur={handleBlur('senderAccountNumber')}
                            keyboardType="numeric"
                          />
                          {errors.senderAccountNumber && touched.senderAccountNumber && (
                            <Text style={styles.errorText}>{errors.senderAccountNumber as string}</Text>
                          )}
                        </View>
                      </View>

                      <View style={styles.formSection}>
                        
                        <View style={styles.fullWidthInput}>
                          <Text style={styles.inputLabel}>
                            {language === 'ar' ? 'المبلغ' : 'Amount'}
                          </Text>
                          <TextInput
                            style={[styles.textInput, errors.amount && touched.amount && styles.errorInput]}
                            placeholder={language === 'ar' ? 'أدخل المبلغ' : 'Enter amount'}
                            placeholderTextColor="#999"
                            value={values.amount}
                            onChangeText={handleChange('amount')}
                            onBlur={handleBlur('amount')}
                            keyboardType="numeric"
                          />
                          {errors.amount && touched.amount && (
                            <Text style={styles.errorText}>{errors.amount as string}</Text>
                          )}
                          <Text style={styles.orderTotalText}>
                            {language === 'ar' ? 'المجموع الإجمالي للطلب' : 'Order Total'}: SAR {selectedOrder?.totalPrice?.toFixed(2)}
                          </Text>
                        </View>

                        <View style={styles.fullWidthInput}>
                          <Text style={styles.inputLabel}>
                            {language === 'ar' ? 'صورة إيصال التحويل' : 'Transfer Receipt Image'}
                          </Text>
                          <TouchableOpacity style={styles.imageUploadButton} onPress={handlePickImage}>
                            <Upload size={20} color="#36c7f6" />
                            <Text style={styles.imageUploadText}>
                              {language === 'ar' ? 'اختر ملف' : 'Choose file'}
                            </Text>
                          </TouchableOpacity>
                          <Text style={styles.noFileText}>
                            {transferReceiptImage ? 
                              (language === 'ar' ? 'تم اختيار الصورة' : 'Image selected') : 
                              (language === 'ar' ? 'لم يتم اختيار ملف' : 'No file chosen')
                            }
                          </Text>
                          {transferReceiptImage && (
                            <Image source={{ uri: transferReceiptImage.uri as string }} style={styles.previewImage} />
                          )}
                        </View>
                      </View>
                    </>
                  )}

                  <View style={styles.formActions}>
                    {currentStep === 1 ? (
                      <>
                        <TouchableOpacity
                          style={styles.cancelButton}
                          onPress={handleCloseBankTransferModal}
                        >
                          <Text style={styles.cancelButtonText}>
                            {language === 'ar' ? 'إلغاء' : 'Cancel'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.nextButton, !values.bankAccountToTransferTo && styles.disabledButton]}
                          onPress={() => setCurrentStep(2)}
                          disabled={!values.bankAccountToTransferTo}
                        >
                          <Text style={styles.nextButtonText}>
                            {language === 'ar' ? 'التالي' : 'Next'}
                          </Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={() => setCurrentStep(1)}
                        >
                          <Text style={styles.backButtonText}>
                            {language === 'ar' ? 'رجوع' : 'Back'}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.submitButton, !isValid && styles.disabledButton]}
                          onPress={() => handleSubmit()}
                          disabled={!isValid}
                        >
                          <Text style={styles.submitButtonText}>
                            {language === 'ar' ? 'إرسال التحويل' : 'Submit Transfer'}
                          </Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </ScrollView>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  refreshButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#36c7f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Shadows.medium,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemDetails: {
    marginLeft: 12,
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  noItemsText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#36c7f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 16,
    ...Shadows.medium,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    ...Shadows.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#36c7f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  totalAmountContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmountLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  totalAmountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#36c7f6',
  },
  paymentMethodSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  paymentOptions: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  selectedPaymentOption: {
    borderColor: '#36c7f6',
    backgroundColor: '#f8fbff',
  },
  paymentOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#36c7f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bakiyyaIcon: {
    backgroundColor: '#ff9500',
  },
  paypalIcon: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentOptionInfo: {
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  selectedPaymentText: {
    color: '#36c7f6',
  },
  paymentOptionDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadioButton: {
    borderColor: '#36c7f6',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#36c7f6',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  confirmPaymentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#36c7f6',
    borderRadius: 8,
    gap: 8,
  },
  confirmPaymentText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  priceBreakdown: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    ...Shadows.medium,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 16,
    marginBottom: 16,
  },
  bankTransferModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '95%',
    maxWidth: 500,
    maxHeight: '90%',
    ...Shadows.large,
  },
  formContainer: {
    padding: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputColumn: {
    flex: 1,
  },
  fullWidthInput: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  errorInput: {
    borderColor: '#f44336',
  },
  
  orderTotalText: {
    fontSize: 14,
    color: '#36c7f6',
    fontWeight: '600',
    marginTop: 8,
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    gap: 8,
  },
  imageUploadText: {
    fontSize: 16,
    color: '#36c7f6',
    fontWeight: '500',
  },
  noFileText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#36c7f6',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    
    ...Shadows.medium,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#36c7f6',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    // marginTop: 16,
    ...Shadows.medium,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  backButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#36c7f6',
  },
  completedStep: {
    backgroundColor: '#4caf50',
  },
  inactiveStep: {
    backgroundColor: '#e0e0e0',
  },
  stepIndicatorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepConnector: {
    width: 160,
    height: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  stepLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  stepLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  activeStepLabel: {
    color: '#36c7f6',
    fontWeight: '600',
  },
});