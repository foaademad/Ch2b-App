import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../src/context/LanguageContext';

const SettingsScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();

  const settingsSections = [
    {
      title: language === 'ar' ? 'الإعدادات العامة' : 'General Settings',
      items: [
        {
          id: 'language',
          title: language === 'ar' ? 'اللغة' : 'Language',
          subtitle: language === 'ar' ? 'تغيير لغة التطبيق' : 'Change app language',
          icon: 'language-outline',
          type: 'navigate',
          route: '/language-settings'
        },
        {
          id: 'theme',
          title: language === 'ar' ? 'المظهر' : 'Theme',
          subtitle: language === 'ar' ? 'تغيير مظهر التطبيق' : 'Change app appearance',
          icon: 'color-palette-outline',
          type: 'navigate',
          route: '/theme-settings'
        },
        {
          id: 'notifications',
          title: language === 'ar' ? 'الإشعارات' : 'Notifications',
          subtitle: language === 'ar' ? 'إدارة إعدادات الإشعارات' : 'Manage notification settings',
          icon: 'notifications-outline',
          type: 'navigate',
          route: '/notifications'
        }
      ]
    },
    {
      title: language === 'ar' ? 'الحساب والأمان' : 'Account & Security',
      items: [
        {
          id: 'profile',
          title: language === 'ar' ? 'الملف الشخصي' : 'Profile',
          subtitle: language === 'ar' ? 'تعديل معلومات الملف الشخصي' : 'Edit profile information',
          icon: 'person-outline',
          type: 'navigate',
          route: '/edit-profile'
        },
        {
          id: 'privacy',
          title: language === 'ar' ? 'الخصوصية' : 'Privacy',
          subtitle: language === 'ar' ? 'إعدادات الخصوصية والأمان' : 'Privacy and security settings',
          icon: 'shield-outline',
          type: 'navigate',
          route: '/privacy'
        },
        {
          id: 'payment',
          title: language === 'ar' ? 'طرق الدفع' : 'Payment Methods',
          subtitle: language === 'ar' ? 'إدارة طرق الدفع' : 'Manage payment methods',
          icon: 'card-outline',
          type: 'navigate',
          route: '/payment-methods'
        }
      ]
    },
    {
      title: language === 'ar' ? 'الدعم والمساعدة' : 'Support & Help',
      items: [
        {
          id: 'help',
          title: language === 'ar' ? 'مركز المساعدة' : 'Help Center',
          subtitle: language === 'ar' ? 'البحث عن المساعدة والدعم' : 'Find help and support',
          icon: 'help-circle-outline',
          type: 'navigate',
          route: '/support'
        },
        {
          id: 'about',
          title: language === 'ar' ? 'حول التطبيق' : 'About App',
          subtitle: language === 'ar' ? 'معلومات حول التطبيق' : 'Information about the app',
          icon: 'information-circle-outline',
          type: 'navigate',
          route: '/about'
        },
        {
          id: 'terms',
          title: language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions',
          subtitle: language === 'ar' ? 'قراءة الشروط والأحكام' : 'Read terms and conditions',
          icon: 'document-text-outline',
          type: 'navigate',
          route: '/terms'
        }
      ]
    }
  ];

  const handleItemPress = (item: any) => {
    if (item.type === 'navigate' && item.route) {
      router.push(item.route as any);
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
        <Text style={styles.headerTitle}>
          {language === 'ar' ? 'الإعدادات' : 'Settings'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Settings Sections */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.settingItem,
                  itemIndex === section.items.length - 1 && styles.lastItem
                ]}
                onPress={() => handleItemPress(item)}
              >
                <View style={styles.settingIcon}>
                  <Ionicons 
                    name={item.icon as any} 
                    size={24} 
                    color="#666" 
                  />
                </View>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{item.title}</Text>
                  <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons 
                  name={isRTL ? "chevron-back" : "chevron-forward"} 
                  size={20} 
                  color="#ccc" 
                />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            {language === 'ar' ? 'إصدار التطبيق' : 'App Version'} 1.0.0
          </Text>
        </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastItem: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});

export default SettingsScreen; 