import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../src/context/LanguageContext';

const PrivacyScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
    locationSharing: true,
    dataCollection: true,
    personalizedAds: false
  });

  const privacySettings = [
    {
      id: 'pushNotifications',
      title: language === 'ar' ? 'إشعارات الدفع' : 'Push Notifications',
      subtitle: language === 'ar' ? 'استقبال الإشعارات على الهاتف' : 'Receive notifications on your phone',
      icon: 'notifications-outline',
      type: 'switch'
    },
    {
      id: 'emailNotifications',
      title: language === 'ar' ? 'إشعارات البريد الإلكتروني' : 'Email Notifications',
      subtitle: language === 'ar' ? 'استقبال الإشعارات عبر البريد الإلكتروني' : 'Receive notifications via email',
      icon: 'mail-outline',
      type: 'switch'
    },
    {
      id: 'smsNotifications',
      title: language === 'ar' ? 'إشعارات الرسائل النصية' : 'SMS Notifications',
      subtitle: language === 'ar' ? 'استقبال الإشعارات عبر الرسائل النصية' : 'Receive notifications via SMS',
      icon: 'chatbubble-outline',
      type: 'switch'
    },
    {
      id: 'locationSharing',
      title: language === 'ar' ? 'مشاركة الموقع' : 'Location Sharing',
      subtitle: language === 'ar' ? 'السماح للتطبيق بالوصول إلى موقعك' : 'Allow app to access your location',
      icon: 'location-outline',
      type: 'switch'
    },
    {
      id: 'dataCollection',
      title: language === 'ar' ? 'جمع البيانات' : 'Data Collection',
      subtitle: language === 'ar' ? 'السماح بجمع البيانات لتحسين الخدمة' : 'Allow data collection to improve service',
      icon: 'analytics-outline',
      type: 'switch'
    },
    {
      id: 'personalizedAds',
      title: language === 'ar' ? 'الإعلانات المخصصة' : 'Personalized Ads',
      subtitle: language === 'ar' ? 'استقبال إعلانات مخصصة بناءً على اهتماماتك' : 'Receive personalized ads based on your interests',
      icon: 'megaphone-outline',
      type: 'switch'
    }
  ];

  const handleToggle = (settingId: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId as keyof typeof prev]
    }));
  };

  const handleSave = () => {
    // هنا يمكن حفظ الإعدادات في التخزين المحلي أو إرسالها للخادم
    router.back();
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
          {language === 'ar' ? 'إعدادات الخصوصية' : 'Privacy Settings'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Privacy Settings */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {language === 'ar' ? 'إعدادات الإشعارات' : 'Notification Settings'}
        </Text>
        
        {privacySettings.map((setting) => (
          <View key={setting.id} style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Ionicons 
                name={setting.icon as any} 
                size={24} 
                color="#666" 
              />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{setting.title}</Text>
              <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
            </View>
            {setting.type === 'switch' && (
              <Switch
                value={settings[setting.id as keyof typeof settings] as boolean}
                onValueChange={() => handleToggle(setting.id)}
                trackColor={{ false: '#e0e0e0', true: '#2196F3' }}
                thumbColor={settings[setting.id as keyof typeof settings] ? '#fff' : '#f4f3f4'}
              />
            )}
          </View>
        ))}

        {/* Privacy Policy Link */}
        <TouchableOpacity
          style={styles.policyLink}
          onPress={() => router.push('/privacy-policy' as any)}
        >
          <View style={styles.policyIcon}>
            <Ionicons name="document-text-outline" size={24} color="#2196F3" />
          </View>
          <View style={styles.policyContent}>
            <Text style={styles.policyTitle}>
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Text>
            <Text style={styles.policySubtitle}>
              {language === 'ar' ? 'اقرأ سياسة الخصوصية الكاملة' : 'Read our complete privacy policy'}
            </Text>
          </View>
          <Ionicons 
            name={isRTL ? "chevron-back" : "chevron-forward"} 
            size={20} 
            color="#ccc" 
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>
            {language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
          </Text>
        </TouchableOpacity>
      </View>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  policyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  policyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  policyContent: {
    flex: 1,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  policySubtitle: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrivacyScreen; 