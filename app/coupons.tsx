import { useLanguage } from '@/src/context/LanguageContext';
import { getAllActiveCoupons } from '@/src/store/api/couponApi';
import type { AppDispatch } from '@/src/store/store';
import { RootState } from '@/src/store/store';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Copy, DollarSign, Tag } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    Clipboard,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const CouponsScreen = () => {
  const { language, changeLanguage } = useLanguage();
  const [isRTL, setIsRTL] = useState(language === "ar");
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('available');
  
  const dispatch = useDispatch<AppDispatch>();
  const { coupons, loading, error } = useSelector((state: RootState) => state.coupon);

  useEffect(() => {
    setIsRTL(language === "ar");
    // جلب الكوبونات عند تحميل الصفحة
    dispatch(getAllActiveCoupons());
  }, [language, dispatch]);

  const copyToClipboard = async (code: string) => {
    try {
      await Clipboard.setString(code);
      Alert.alert(
        t('profile.coupons.code_copied'),
        t('profile.coupons.code_copied'),
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to copy code');
    }
  };

  const getFilteredCoupons = () => {
    if (!coupons || !Array.isArray(coupons)) return [];
    
    // فلترة الكوبونات الصالحة فقط
    const validCoupons = coupons.filter(coupon => 
      coupon && 
      typeof coupon === 'object' && 
      coupon.id && 
      typeof coupon.isActived === 'boolean' && 
      typeof coupon.isExpired === 'boolean'
    );
    
    let filteredCoupons;
    switch (activeTab) {
      case 'available':
        filteredCoupons = validCoupons.filter(coupon => coupon.isActived && !coupon.isExpired);
        break;
      case 'expired':
        filteredCoupons = validCoupons.filter(coupon => coupon.isExpired);
        break;
      default:
        filteredCoupons = validCoupons;
    }
    
    return filteredCoupons;
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString.trim() === '') return 'غير محدد';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'غير محدد';
      const formattedDate = date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US');
      return formattedDate || 'غير محدد';
    } catch (error) {
      return 'غير محدد';
    }
  };

  const renderCouponCard = (coupon: any) => {
    if (!coupon || typeof coupon !== 'object') {
      return null;
    }
    
    const isDisabled = !coupon.isActived || coupon.isExpired;
    
    // التأكد من أن جميع القيم آمنة
    const discount = coupon.discount || 0;
    const code = coupon.code || '';
    const description = coupon.description && coupon.description.trim() !== '' ? coupon.description : t('profile.coupons.discount');
    const minimumPrice = coupon.minimumPrice || 0;
    const endData = coupon.endData || '';
    
    // التأكد من أن جميع النصوص آمنة
    const safeDiscount = String(discount || 0);
    const safeCode = String(code || '');
    const safeDescription = String(description || t('profile.coupons.discount'));
    const safeMinimumPrice = String(minimumPrice || 0);
    const safeEndData = String(formatDate(endData) || 'غير محدد');
    
    return (
      <View key={coupon.id} style={[styles.couponCard, isDisabled && styles.disabledCard]}>
        <View style={styles.couponHeader}>
          <View style={styles.discountContainer}>
            <Tag size={24} color={isDisabled ? "#999" : "#36c7f6"} />
            <Text style={[styles.discountText, isDisabled && styles.disabledText]}>
              {safeDiscount}%
            </Text>
          </View>
          <View style={styles.codeContainer}>
            <Text style={[styles.codeText, isDisabled && styles.disabledText]}>
              {safeCode}
            </Text>
            {!isDisabled && (
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={() => copyToClipboard(safeCode)}
              >
                <Copy size={16} color="#36c7f6" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <Text style={[styles.descriptionText, isDisabled && styles.disabledText]}>
          {safeDescription}
        </Text>
        
        <View style={styles.couponDetails}>
          {minimumPrice > 0 && (
            <View style={styles.detailItem}>
              <DollarSign size={16} color={isDisabled ? "#999" : "#666"} />
              <Text style={[styles.detailText, isDisabled && styles.disabledText]}>
                {t('profile.coupons.minimum_purchase')}: {safeMinimumPrice} ريال
              </Text>
            </View>
          )}
          
          <View style={styles.detailItem}>
            <Calendar size={16} color={isDisabled ? "#999" : "#666"} />
            <Text style={[styles.detailText, isDisabled && styles.disabledText]}>
              {t('profile.coupons.valid_until')}: {safeEndData}
            </Text>
          </View>
        </View>
        
        {coupon.isExpired && (
          <View style={styles.expiredBadge}>
            <Text style={styles.expiredBadgeText}>{t('profile.coupons.expired')}</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#36c7f6" />
        <Text style={styles.loadingText}>جاري تحميل الكوبونات...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => dispatch(getAllActiveCoupons())}
        >
          <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      {/* Header */}
      <View style={[styles.header, { direction: isRTL ? 'rtl' : 'ltr' }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.coupons.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { direction: isRTL ? 'rtl' : 'ltr' }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => setActiveTab('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
            {t('profile.coupons.available')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'expired' && styles.activeTab]}
          onPress={() => setActiveTab('expired')}
        >
          <Text style={[styles.tabText, activeTab === 'expired' && styles.activeTabText]}>
            {t('profile.coupons.expired')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Coupons List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {getFilteredCoupons().length > 0 ? (
          getFilteredCoupons().map(renderCouponCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Tag size={64} color="#ccc" />
            <Text style={styles.emptyText}>{t('profile.coupons.no_coupons')}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default CouponsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#36c7f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#36c7f6',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  couponCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  disabledCard: {
    opacity: 0.6,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#36c7f6',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  couponDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  termsText: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
  disabledText: {
    color: '#999',
  },
  expiredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#dc3545',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiredBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
}); 