import { useLanguage } from '@/src/context/LanguageContext';

import { RootState } from '@/src/store/store';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import {
    ArrowRight,
    Bell,
    CreditCard,
    Globe,
    Heart,
    HelpCircle,
    LogOut,
    MapPin,
    Package,
    Settings,
    Shield
} from 'lucide-react-native';

const ProfileScreen = () => {
  const { language, changeLanguage } = useLanguage();
  const [isRTL, setIsRTL] = useState(language === "ar");
  
  useEffect(() => {
    setIsRTL(language === "ar");
  }, [language]);
  const { t } = useTranslation();
  const router = useRouter();
  
  // استخدام Redux مباشرة بدلاً من ShopContext
  const wishlistItems = useSelector((state: RootState) => state.wishlist.wishlist);
  const wishlistCount = wishlistItems.length > 0 && wishlistItems[0]?.favoriteItems 
    ? wishlistItems[0].favoriteItems.length 
    : 0;
  const orderHistory = []; // سيتم تنفيذها لاحقاً

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    changeLanguage(newLanguage);
  };

  const menuItems = [
    {
      title: t('profile.orders.title'),
      icon: <Package size={24} color="#36c7f6" />,
      onPress: () => router.push('/orders' as any),
      badge: orderHistory.length.toString(),
    },
    {
      title: t('profile.wishlist.title'),
      icon: <Heart size={24} color="#36c7f6" />,
      onPress: () => router.push('/whishList' as any),
      badge: wishlistCount.toString(),
    },
    {
      title: t('profile.addresses.title'),
      icon: <MapPin size={24} color="#36c7f6" />,
      onPress: () => router.push('/addresses' as any),
    },
    {
      title: t('profile.cards'),
      icon: <CreditCard size={24} color="#36c7f6" />,
      onPress: () => router.push('/payment-methods' as any),
    }
  ];

  const settingsItems = [
    {
      title: t('profile.notifications.title'),
      icon: <Bell size={24} color="#666" />,
      onPress: () => router.push('/notifications' as any),
    },
    {
      title: t('profile.privacy_security.title'),
      icon: <Shield size={24} color="#666" />,
      onPress: () => router.push('/privacy' as any),
    },
    {
      title: t('profile.help_support.title'),
      icon: <HelpCircle size={24} color="#666" />,
      onPress: () => router.push('/support' as any),
    },
    {
      title: t('profile.settings.title'),
      icon: <Settings size={24} color="#666" />,
      onPress: () => router.push('/settings' as any),
    },
  ];

  return (
    <ScrollView style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      {/* Profile Header */}
      <View style={[styles.header, { direction: isRTL ? 'rtl' : 'ltr' }]}>
        <View style={[styles.profileInfo, { direction: isRTL ? 'rtl' : 'ltr' }]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D' }}
            style={styles.profileImage}
          />
          <View style={[styles.userInfo, { marginLeft: isRTL ? 0 : 16, marginRight: isRTL ? 16 : 0 }]}>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => router.push('/edit-profile' as any)}
          >
            <Text style={styles.editProfileText}>{t('profile.edit_profile.title')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.languageButton}
            onPress={toggleLanguage}
          >
            <Globe size={20} color="#36c7f6" />
            <Text style={styles.languageText}>{t('profile.change_language')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={[styles.statsContainer, { direction: isRTL ? 'rtl' : 'ltr' }]}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>{t('profile.orders.title')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>{t('profile.addresses.title')}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>{t('profile.cards')}</Text>
        </View>
      </View>

      {/* Main Menu */}
      <View style={[styles.section, { direction: isRTL ? 'rtl' : 'ltr' }]}>
        <Text style={styles.sectionTitle}>{t('profile.my_account')}</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={`menu-${item.title}-${index}`}
            style={[styles.menuItem, { direction: isRTL ? 'rtl' : 'ltr' }]}
            onPress={item.onPress}
          >
            <View style={[styles.menuItemLeft, { direction: isRTL ? 'rtl' : 'ltr' }]}>
              {item.icon}
              <Text style={[styles.menuItemText, { marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0 }]}>{item.title}</Text>
            </View>
            <View style={[styles.menuItemRight, { direction: isRTL ? 'rtl' : 'ltr' }]}>
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
              <ArrowRight size={20} color="#666" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings Menu */}
      <View style={[styles.section, { direction: isRTL ? 'rtl' : 'ltr' }]}>
        <Text style={styles.sectionTitle}>{t('profile.settings.title')}</Text>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={`setting-${item.title}-${index}`}
            style={[styles.menuItem, { direction: isRTL ? 'rtl' : 'ltr' }]}
            onPress={item.onPress}
          >
            <View style={[styles.menuItemLeft, { direction: isRTL ? 'rtl' : 'ltr' }]}>
              {item.icon}
              <Text style={[styles.menuItemText, { marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0 }]}>{item.title}</Text>
            </View>
            <ArrowRight size={20} color="#666" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={[styles.logoutButton, { direction: isRTL ? 'rtl' : 'ltr' }]}>
        <LogOut size={24} color="#ff3b30" />
        <Text style={styles.logoutText}>{t('profile.logout')}</Text>
      </TouchableOpacity>

    
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 45,

  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  editProfileButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  editProfileText: {
    color: '#36c7f6',
    fontSize: 16,
    fontWeight: '600',
  },
  languageButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  languageText: {
    color: '#36c7f6',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#36c7f6',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  badge: {
    backgroundColor: '#36c7f6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    
    marginTop: 16,
    padding: 20,
    gap: 8,
  },
  logoutText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 16,
    marginBottom: 32,
  },
});