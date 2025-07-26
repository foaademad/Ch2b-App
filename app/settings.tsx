import { useLanguage } from '@/src/context/LanguageContext';
import { useRouter } from 'expo-router';
import { Bell, ChevronLeft, ChevronRight, FileText, Globe, Info, Shield } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SettingsScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const { language, changeLanguage } = useLanguage();
  const [isRTL, setIsRTL] = useState(language === "ar");
  
  useEffect(() => {
    setIsRTL(language === "ar");
  }, [language]);
  const settingsSections = [
    {
      title: t('profile.settings.language'),
      icon: <Globe size={24} color="#36c7f6" />,
      value: language === 'en' ? 'English' : 'العربية',
      onPress: () => {
        changeLanguage(language === 'en' ? 'ar' : 'en');
        setIsRTL(language === "ar");
      },
    },
    {
      title: t('profile.settings.notifications'),
      icon: <Bell size={24} color="#36c7f6" />,
      value: notifications ? 'Enabled' : 'Disabled',
      onPress: () => setNotifications(!notifications),
    },
    {
      title: t('profile.settings.privacy'),
      icon: <Shield size={24} color="#36c7f6" />,
      value: locationServices ? 'Enabled' : 'Disabled',
      onPress: () => setLocationServices(!locationServices),
    },
  ];

  const aboutSections = [
    {
      title: t('profile.settings.about'),
      icon: <Info size={24} color="#36c7f6" />,
      onPress: () => router.push('/about' as any),
    },
    {
      title: t('profile.settings.terms'),
      icon: <FileText size={24} color="#36c7f6" />,
      onPress: () => router.push('/terms' as any),
    },
    {
      title: t('profile.settings.privacy_policy'),
      icon: <Shield size={24} color="#36c7f6" />,
      onPress: () => router.push('/privacy-policy' as any),
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
        <Text style={styles.headerTitle}>{t('profile.settings.title')}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.title')}</Text>
          {settingsSections.map((item, index) => (
            <TouchableOpacity
              key={`setting-${item.title}-${index}`}
              style={styles.settingItem}
              onPress={item.onPress}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { direction: isRTL ? 'rtl' : 'ltr' }]}>{item.icon}</View>
                <Text style={styles.settingTitle}>{item.title}</Text>
              </View>
              <View style={styles.settingRight}>
                <Text style={styles.settingValue}>{item.value}</Text>
                <ChevronRight size={20} color="#666" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.settings.about')}</Text>
          {aboutSections.map((item, index) => (
            <TouchableOpacity
              key={`about-${item.title}-${index}`}
              style={styles.settingItem}
              onPress={item.onPress}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>{item.icon}</View>
                <Text style={styles.settingTitle}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color="#666" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  version: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginTop: 16,
    marginBottom: 32,
  },
});

export default SettingsScreen; 