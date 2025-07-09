import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../config/i18n';

interface LanguageContextType {
  language: string;
  changeLanguage: (lng: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    // تحديث الحالة عند تغيير اللغة
    const handleLanguageChange = (lng: string) => {
      setLanguage(lng);
    };
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    // هنا يمكن إضافة أي منطق إضافي عند تغيير اللغة، مثل إرسال إشعار إلى الصفحات
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
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