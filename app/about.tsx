import { useLanguage } from '@/src/context/LanguageContext';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AboutScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { language } = useLanguage();
  const [isRTL, setIsRTL] = useState(language === "ar");
  
  useEffect(() => {
    setIsRTL(language === "ar");
  }, [language]);

  return (
    <View style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      {/* Header */}
      <View style={[styles.header, { direction: isRTL ? 'rtl' : 'ltr' }]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
           {isRTL ? <ChevronRight size={24} color="#333" /> : <ChevronLeft size={24} color="#333" />}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.settings.about')}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>
            {language === 'ar' ? 'مرحباً بكم في تطبيقنا' : 'Welcome to Our App'}
          </Text>
          
          <Text style={styles.description}>
            {language === 'ar' 
              ? 'تطبيقنا هو منصة تجارة إلكترونية متكاملة تهدف إلى توفير تجربة تسوق مميزة وآمنة لعملائنا الكرام. نحن نقدم مجموعة واسعة من المنتجات عالية الجودة مع خدمة عملاء متميزة.'
              : 'Our app is a comprehensive e-commerce platform designed to provide our valued customers with an exceptional and secure shopping experience. We offer a wide range of high-quality products with outstanding customer service.'
            }
          </Text>

          <View style={styles.featureSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? 'مميزاتنا' : 'Our Features'}
            </Text>
            
            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>
                {language === 'ar' ? '• تسوق آمن' : '• Secure Shopping'}
              </Text>
              <Text style={styles.featureDescription}>
                {language === 'ar' 
                  ? 'جميع المعاملات محمية بتقنيات تشفير متقدمة'
                  : 'All transactions are protected with advanced encryption technologies'
                }
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>
                {language === 'ar' ? '• شحن سريع' : '• Fast Shipping'}
              </Text>
              <Text style={styles.featureDescription}>
                {language === 'ar' 
                  ? 'خدمة شحن سريعة وموثوقة لجميع المناطق'
                  : 'Fast and reliable shipping service to all areas'
                }
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>
                {language === 'ar' ? '• دعم العملاء' : '• Customer Support'}
              </Text>
              <Text style={styles.featureDescription}>
                {language === 'ar' 
                  ? 'فريق دعم متخصص متاح على مدار الساعة'
                  : 'Specialized support team available 24/7'
                }
              </Text>
            </View>

            <View style={styles.featureItem}>
              <Text style={styles.featureTitle}>
                {language === 'ar' ? '• جودة المنتجات' : '• Product Quality'}
              </Text>
              <Text style={styles.featureDescription}>
                {language === 'ar' 
                  ? 'جميع المنتجات مختارة بعناية لضمان الجودة العالية'
                  : 'All products are carefully selected to ensure high quality'
                }
              </Text>
            </View>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}
            </Text>
            
            <Text style={styles.contactItem}>
              {language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'} Zimabedakcompany@gmail.com
            </Text>
            <Text style={styles.contactItem}>
              {language === 'ar' ? 'الهاتف:' : 'Phone:'} +967776896588
            </Text>
            <Text style={styles.contactItem}>
              {language === 'ar' ? 'العنوان:' : 'Address:'} اليمن _ حضرموت _ تريم
            </Text>
          </View>

         
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
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
   
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'justify',
  },
  featureSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  featureItem: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#36c7f6',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 16,
  },
  contactSection: {
    marginBottom: 24,
  },
  contactItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  versionSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default AboutScreen; 