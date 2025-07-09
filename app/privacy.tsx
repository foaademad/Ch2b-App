import { useLanguage } from '@/src/context/LanguageContext';
import { useRouter } from 'expo-router';
import { ChevronLeft, Cookie, Eye, Lock, MapPin, Shield } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

const PrivacySecurityScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  // State for toggles
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [dataSharingEnabled, setDataSharingEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [cookiesEnabled, setCookiesEnabled] = useState(true);

  const privacySettings = [
    {
      id: 'two_factor',
      title: t('profile.privacy_security.two_factor'),
      description: t('profile.privacy_security.two_factor_description'),
      icon: <Shield size={24} color="#36c7f6" />,
      value: twoFactorEnabled,
      onValueChange: setTwoFactorEnabled,
    },
    {
      id: 'data_sharing',
      title: t('profile.privacy_security.data_sharing'),
      description: t('profile.privacy_security.data_sharing_description'),
      icon: <Eye size={24} color="#36c7f6" />,
      value: dataSharingEnabled,
      onValueChange: setDataSharingEnabled,
    },
    {
      id: 'location',
      title: t('profile.privacy_security.location'),
      description: t('profile.privacy_security.location_description'),
      icon: <MapPin size={24} color="#36c7f6" />,
      value: locationEnabled,
      onValueChange: setLocationEnabled,
    },
    {
      id: 'cookies',
      title: t('profile.privacy_security.cookies'),
      description: t('profile.privacy_security.cookies_description'),
      icon: <Cookie size={24} color="#36c7f6" />,
      value: cookiesEnabled,
      onValueChange: setCookiesEnabled,
    },
  ];

  return (
    <View style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      {/* Header */}
      <View style={[styles.header, { direction: isRTL ? 'rtl' : 'ltr' }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#333" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.privacy_security.title')}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* Password Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.passwordButton}>
            <Lock size={24} color="#36c7f6" />
            <View style={styles.passwordButtonContent}>
              <Text style={styles.passwordButtonTitle}>{t('profile.privacy_security.change_password')}</Text>
              <Text style={styles.passwordButtonDescription}>{t('profile.privacy_security.change_password_description')}</Text>
            </View>
            <ChevronLeft size={24} color="#666" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
          </TouchableOpacity>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.privacy_security.privacy_settings')}</Text>
          {privacySettings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <View style={styles.settingIcon}>{setting.icon}</View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{setting.title}</Text>
                <Text style={styles.settingDescription}>{setting.description}</Text>
              </View>
              <Switch
                value={setting.value}
                onValueChange={setting.onValueChange}
                trackColor={{ false: '#767577', true: '#36c7f6' }}
                thumbColor={setting.value ? '#fff' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 45,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
  },
  content: {
    flex: 1,
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
  passwordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  passwordButtonContent: {
    flex: 1,
    marginLeft: 12,
  },
  passwordButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  passwordButtonDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default PrivacySecurityScreen; 