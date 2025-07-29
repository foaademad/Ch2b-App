import { useLanguage } from '@/src/context/LanguageContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, RefreshCw, Wallet } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Shadows } from '../constants/Shadows';
import { getAllOrdersToUser } from '../src/store/api/orderApi';
import { RootState } from '../src/store/store';
import { getOrderStatusColor, getOrderStatusText } from '../src/store/utility/orderStatusHelper';

const OrdersScreen = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isRTL, setIsRTL] = useState(language === 'ar');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paypal' | 'bakiyya' | null>(null);
  
  // Redux state
  const { orders, loading, error } = useSelector((state: RootState) => state.order);
  const { authModel } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    setIsRTL(language === 'ar');
    // جلب طلبات المستخدم عند تحميل الصفحة
    if (authModel?.result?.userId) {
      dispatch(getAllOrdersToUser(authModel.result.userId) as any);
    }
  }, [language, dispatch, authModel]);

  // إعادة تحميل الطلبات
  const handleRefresh = () => {
    if (authModel?.result?.userId) {
      dispatch(getAllOrdersToUser(authModel.result.userId) as any);
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
    } catch (error) {
      return dateString;
    }
  };

  // حساب السعر الإجمالي للمنتجات التي حالتها Reviewed
  const calculateReviewedProductsTotal = () => {
    return orders
      .filter(order => order.status === 1 || order.orderStatus === 1)
      .reduce((total, order) => total + (order.totalPrice || 0), 0);
  };

  // فتح نافذة الدفع
  const handlePaymentPress = (order: any) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
    setSelectedPaymentMethod(null);
  };

  // إغلاق نافذة الدفع
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedOrder(null);
    setSelectedPaymentMethod(null);
  };

  // اختيار طريقة الدفع
  const handlePaymentMethodSelect = (method: 'paypal' | 'bakiyya') => {
    setSelectedPaymentMethod(method);
  };

  // إتمام عملية الدفع
  const handleProcessPayment = async () => {
    if (!selectedOrder || !selectedPaymentMethod) {
      Alert.alert(
        t('error'),
        t('profile.payment.select_payment_method')
      );
      return;
    }

    // محاكاة معالجة الدفع
    Alert.alert(
      t('profile.payment.payment_successful'),
      `${t('profile.payment.payment_successful')} $${selectedOrder.totalPrice?.toFixed(2)} via ${selectedPaymentMethod === 'paypal' ? 'PayPal' : 'Bakiyya'}`,
      [
        {
          text: t('common.ok'),
          onPress: () => {
            handleClosePaymentModal();
            // إعادة تحميل الطلبات لتحديث الحالة
            handleRefresh();
          }
        }
      ]
    );
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

              {/* زر الدفع للمنتجات التي حالتها Reviewed */}
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
                          ${(item.totalPrice || 0).toFixed(2)}
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

              <View style={styles.orderFooter}>
                <Text style={styles.totalLabel}>{t('profile.coupons.order_total')}</Text>
                <Text style={styles.totalAmount}>
                  ${(order.totalPrice || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal الدفع */}
      <Modal
        visible={showPaymentModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClosePaymentModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
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

            {/* Introductory Text */}
            <Text style={styles.modalDescription}>
              {language === 'ar' 
                ? 'يرجى اختيار طريقة دفع لإتمام طلبك بأمان وسهولة'
                : 'Please choose a payment method to complete your order securely and easily'
              }
            </Text>

            {/* Total Amount */}
            <View style={styles.totalAmountContainer}>
              <Text style={styles.totalAmountLabel}>
                {language === 'ar' ? 'المبلغ الإجمالي' : 'Total Amount'}
              </Text>
              <Text style={styles.totalAmountValue}>
                SAR {selectedOrder?.totalPrice?.toFixed(2)}
              </Text>
            </View>

            {/* Payment Method Selection */}
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

            {/* Action Buttons */}
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
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
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
  reviewedSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Shadows.medium,
  },
  reviewedSummaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewedSummaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewedSummaryCount: {
    fontSize: 14,
    color: '#666',
  },
  reviewedSummaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewedSummaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  reviewedSummaryAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
}); 