import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
import React from 'react';
import { StyleSheet } from 'react-native';
import { useLanguage } from "../../src/context/LanguageContext";
import { useShop } from "../../src/context/ShopContext";

export default function TabLayout() {
  const { language } = useLanguage();
  const { cart, wishlist} = useShop();

  // تعريف التبويبات في مصفوفة
  const tabScreens = [
    {
      name: 'index',
      title: { ar: 'الرئيسية', en: 'Home' },
      icon: 'home-outline',
    },
    {
      name: 'categories',
      title: { ar: 'الكاتيجوري', en: 'Categories' },
      icon: 'grid-outline',
    },
   
    {
      name: 'whishList',
      title: { ar: 'المفضلة', en: 'WhishList' },
      icon: 'heart-outline',
      badge: wishlist.length > 0 ? wishlist.length : undefined,
    },
    {
      name: 'cart',
      title: { ar: 'السلة', en: 'Cart' },
      icon: 'cart-outline',
      badge: cart.length > 0 ? cart.length : undefined,
    },
    {
      name: 'profile',
      title: { ar: 'الملف الشخصي', en: 'Profile' },
      icon: 'person-outline',
    }
  ];

  // إعادة ترتيب التبويبات إذا كانت اللغة عربية
  const orderedTabs = language === 'ar' ? [...tabScreens].reverse() : tabScreens;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#36c7f6',
        tabBarInactiveTintColor: '#7f8c8d',
        tabBarLabelStyle: {
          textAlign: language === 'ar' ? 'right' : 'left',
          writingDirection: language === 'ar' ? 'rtl' : 'ltr',
          fontFamily: language === 'ar' ? 'Tajawal' : 'Roboto-Regular',
        },
      }}
    >
      {orderedTabs.map((tab, index) => (
        <Tabs.Screen
          key={`tab-${index}`}
          name={tab.name}
          options={{
            title: language === 'ar' ? tab.title.ar : tab.title.en,
            tabBarIcon: ({ color }) => (
              <Ionicons name={tab.icon as any} size={22} color={color} />
            ),
            tabBarBadge: tab.badge,
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
});