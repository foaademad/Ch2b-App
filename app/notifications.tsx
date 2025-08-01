import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../src/context/LanguageContext';

const NotificationsScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();

  const notifications = [
    {
      id: 1,
      title: language === 'ar' ? 'طلب جديد' : 'New Order',
      message: language === 'ar' ? 'تم تأكيد طلبك رقم #12345' : 'Your order #12345 has been confirmed',
      time: '2 hours ago',
      read: false,
      type: 'order'
    },
    {
      id: 2,
      title: language === 'ar' ? 'تحديث الشحن' : 'Shipping Update',
      message: language === 'ar' ? 'تم شحن طلبك رقم #12345' : 'Your order #12345 has been shipped',
      time: '1 day ago',
      read: true,
      type: 'shipping'
    },
    {
      id: 3,
      title: language === 'ar' ? 'عرض خاص' : 'Special Offer',
      message: language === 'ar' ? 'خصم 20% على جميع المنتجات' : '20% off on all products',
      time: '2 days ago',
      read: true,
      type: 'promo'
    }
  ];

  const getIconName = (type: string) => {
    switch (type) {
      case 'order':
        return 'bag-outline';
      case 'shipping':
        return 'car-outline';
      case 'promo':
        return 'pricetag-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'order':
        return '#4CAF50';
      case 'shipping':
        return '#2196F3';
      case 'promo':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons 
            name={isRTL ? "chevron-forward" : "chevron-back"} 
            size={24} 
            color="#333" 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('notifications.title')}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Notifications List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>
              {language === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <View 
              key={notification.id} 
              style={[
                styles.notificationItem, 
                !notification.read && styles.unreadNotification
              ]}
            >
              <View style={styles.notificationIcon}>
                <Ionicons 
                  name={getIconName(notification.type) as any} 
                  size={24} 
                  color={getIconColor(notification.type)} 
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              {!notification.read && <View style={styles.unreadDot} />}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196F3',
    alignSelf: 'center',
  },
});

export default NotificationsScreen; 