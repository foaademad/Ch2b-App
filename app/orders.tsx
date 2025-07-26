import { useLanguage } from '@/src/context/LanguageContext';
import { useRouter } from 'expo-router';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Shadows } from '../constants/Shadows';
import { getAllOrdersToUser } from '../src/store/api/orderApi';
import { RootState } from '../src/store/store';

const OrdersScreen = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isRTL, setIsRTL] = useState(language === 'ar');
  
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

  // ترجمة حالة الطلب
  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return t('profile.coupons.order_status_pending');
      case 'processing':
        return t('profile.coupons.order_status_processing');
      case 'shipped':
        return t('profile.coupons.order_status_shipped');
      case 'delivered':
        return t('profile.coupons.order_status_delivered');
      case 'cancelled':
        return t('profile.coupons.order_status_cancelled');
      default:
        return status || t('profile.coupons.order_status_pending');
    }
  };

  // لون حالة الطلب
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return '#4CAF50';
      case 'shipped':
        return '#2196F3';
      case 'processing':
        return '#FF9800';
      case 'cancelled':
        return '#f44336';
      case 'pending':
      default:
        return '#FFA000';
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
                  backgroundColor: getStatusColor(order.status)
                }]}>
                  <Text style={styles.statusText}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>

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
                          {item.productName || `Product ${index + 1}`}
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
}); 