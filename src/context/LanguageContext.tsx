import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initReactI18next } from 'react-i18next';

// استيراد ملفات الترجمة
const resources = {
  en: { translation: require('../../locales/en/translation.json') },
  ar: { translation: require('../../locales/ar/translation.json') },
};

interface LanguageContextType {
  language: string;
  changeLanguage: (lng: string) => Promise<void>;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('ar'); // افتراضي عربي
  const [isInitialized, setIsInitialized] = useState(false);
  const [key, setKey] = useState(0); // مفتاح لإعادة تحميل المكونات

  // تهيئة i18n عند بدء التطبيق
  useEffect(() => {
    const initializeI18n = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('appLanguage');
        const currentLanguage = savedLanguage || 'ar';
        
        // تهيئة i18n إذا لم تكن مهيأة
        if (!i18n.isInitialized) {
          await i18n
            .use(initReactI18next)
            .init({
              resources,
              lng: currentLanguage,
              fallbackLng: 'ar',
              interpolation: { escapeValue: false },
            });
        } else {
          await i18n.changeLanguage(currentLanguage);
        }
        
        setLanguage(currentLanguage);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing i18n:', error);
        setLanguage('ar');
        setIsInitialized(true);
      }
    };

    initializeI18n();
  }, []);

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      await AsyncStorage.setItem('appLanguage', lng);
      setLanguage(lng);
      
      // إعادة تحميل المكونات بتغيير المفتاح
      setKey(prev => prev + 1);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const isRTL = language === 'ar';

  if (!isInitialized) {
    // يمكن إضافة شاشة تحميل هنا
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, isRTL }}>
      <React.Fragment key={key}>
        {children}
      </React.Fragment>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};