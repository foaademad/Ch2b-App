import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// استيراد ملفات الترجمة
const resources = {
  en: { translation: require('../../locales/en/translation.json') },
  ar: { translation: require('../../locales/ar/translation.json') },
};

// دالة لتحميل اللغة المحفوظة من AsyncStorage
const loadLanguage = async () => {
  try {
    const savedLanguage = await AsyncStorage.getItem('appLanguage');
    return savedLanguage || 'ar'; // افتراضي عربي
  } catch (error) {
    console.error('Error loading language from AsyncStorage:', error);
    return 'ar';
  }
};

// تهيئة i18 مع اللغة المحفوظة
const initializeI18n = async () => {
  const lng = await loadLanguage();
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng,
      fallbackLng: 'ar',
      interpolation: { escapeValue: false },
    });
  return lng;
};

// دالة لتغيير اللغة وحفظها في AsyncStorage
export const changeLanguage = async (lng: string) => {
  try {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem('appLanguage', lng);
  } catch (error) {
    console.error('Error saving language to AsyncStorage:', error);
  }
};

// دالة للحصول على اللغة الحالية
export const getCurrentLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem('appLanguage');
    return savedLanguage || 'ar';
  } catch (error) {
    console.error('Error loading language from AsyncStorage:', error);
    return 'ar';
  }
};

// تصدير دالة التهيئة
export default initializeI18n;