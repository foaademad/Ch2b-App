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
    return savedLanguage || 'en';
  } catch (error) {
    console.error('Error loading language from AsyncStorage:', error);
    return 'en';
  }
};

// تهيئة i18n مع اللغة المحفوظة
const initializeI18n = async () => {
  const lng = await loadLanguage();
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
    });
  return lng;
};

// دالة لتغيير اللغة بدون ريفريش
export const changeLanguage = async (lng: string) => {
  try {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem('appLanguage', lng);
  } catch (error) {
    console.error('Error saving language to AsyncStorage:', error);
  }
};

// تشغيل التهيئة
initializeI18n();

export default i18n;