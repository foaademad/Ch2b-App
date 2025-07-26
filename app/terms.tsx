import { useLanguage } from '@/src/context/LanguageContext';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TermsScreen = () => {
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
          <ChevronLeft size={24} color="#333" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.settings.terms')}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>
            {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
          </Text>
          
          <Text style={styles.lastUpdated}>
            {language === 'ar' ? 'آخر تحديث:' : 'Last Updated:'} {new Date().toLocaleDateString()}
          </Text>

          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '1. قبول الشروط' : '1. Acceptance of Terms'}
            </Text>
            <Text style={styles.termsText}>
              {language === 'ar' 
                ? 'باستخدام هذا التطبيق، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام التطبيق.'
                : 'By using this application, you agree to be bound by these terms and conditions. If you do not agree to any part of these terms, please do not use the application.'
              }
            </Text>
          </View>

          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '2. استخدام التطبيق' : '2. Use of Application'}
            </Text>
            <Text style={styles.termsText}>
              {language === 'ar' 
                ? 'يجب استخدام التطبيق للأغراض القانونية فقط. يحظر استخدام التطبيق لأي غرض غير قانوني أو ضار أو مسيء.'
                : 'The application must be used for lawful purposes only. It is prohibited to use the application for any illegal, harmful, or offensive purpose.'
              }
            </Text>
          </View>

          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '3. الحساب والمسؤولية' : '3. Account and Responsibility'}
            </Text>
            <Text style={styles.termsText}>
              {language === 'ar' 
                ? 'أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور الخاصة بك. أنت مسؤول عن جميع الأنشطة التي تحدث تحت حسابك.'
                : 'You are responsible for maintaining the confidentiality of your account information and password. You are responsible for all activities that occur under your account.'
              }
            </Text>
          </View>

          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '4. الخصوصية' : '4. Privacy'}
            </Text>
            <Text style={styles.termsText}>
              {language === 'ar' 
                ? 'سيتم جمع واستخدام معلوماتك الشخصية وفقاً لسياسة الخصوصية الخاصة بنا. يرجى مراجعة سياسة الخصوصية لفهم كيفية استخدام معلوماتك.'
                : 'Your personal information will be collected and used in accordance with our privacy policy. Please review our privacy policy to understand how your information is used.'
              }
            </Text>
          </View>

          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '5. المدفوعات' : '5. Payments'}
            </Text>
            <Text style={styles.termsText}>
              {language === 'ar' 
                ? 'جميع المدفوعات تتم من خلال بوابات دفع آمنة. نحن لا نخزن معلومات بطاقة الائتمان الخاصة بك. الأسعار قابلة للتغيير دون إشعار مسبق.'
                : 'All payments are processed through secure payment gateways. We do not store your credit card information. Prices are subject to change without prior notice.'
              }
            </Text>
          </View>

          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '6. الشحن والتسليم' : '6. Shipping and Delivery'}
            </Text>
            <Text style={styles.termsText}>
              {language === 'ar' 
                ? 'نحن نسعى لتسليم طلباتك في أقرب وقت ممكن. قد تتأخر أوقات التسليم بسبب ظروف خارجة عن إرادتنا. لا نضمن أوقات التسليم الدقيقة.'
                : 'We strive to deliver your orders as quickly as possible. Delivery times may be delayed due to circumstances beyond our control. We do not guarantee exact delivery times.'
              }
            </Text>
          </View>

          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '7. الإرجاع والاسترداد' : '7. Returns and Refunds'}
            </Text>
            <Text style={styles.termsText}>
              {language === 'ar' 
                ? 'يمكن إرجاع المنتجات خلال 14 يوماً من تاريخ الاستلام إذا كانت في حالتها الأصلية. سيتم معالجة الاسترداد خلال 5-7 أيام عمل.'
                : 'Products can be returned within 14 days of receipt if they are in their original condition. Refunds will be processed within 5-7 business days.'
              }
            </Text>
          </View>

          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '8. المسؤولية القانونية' : '8. Legal Liability'}
            </Text>
            <Text style={styles.termsText}>
              {language === 'ar' 
                ? 'لا نتحمل المسؤولية عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام التطبيق. مسؤوليتنا محدودة بالقيمة المدفوعة للمنتج.'
                : 'We are not liable for any direct or indirect damages resulting from the use of the application. Our liability is limited to the amount paid for the product.'
              }
            </Text>
          </View>

          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '9. التعديلات' : '9. Modifications'}
            </Text>
            <Text style={styles.termsText}>
              {language === 'ar' 
                ? 'نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو داخل التطبيق.'
                : 'We reserve the right to modify these terms and conditions at any time. You will be notified of any material changes via email or within the application.'
              }
            </Text>
          </View>

          <View style={styles.termsSection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '10. القانون المطبق' : '10. Governing Law'}
            </Text>
            <Text style={styles.termsText}>
              {language === 'ar' 
                ? 'تخضع هذه الشروط والأحكام لقوانين المملكة العربية السعودية. أي نزاعات ستخضع لاختصاص المحاكم السعودية.'
                : 'These terms and conditions are governed by the laws of the Kingdom of Saudi Arabia. Any disputes will be subject to the jurisdiction of Saudi courts.'
              }
            </Text>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>
              {language === 'ar' ? 'للاستفسارات' : 'For Inquiries'}
            </Text>
            <Text style={styles.contactText}>
              {language === 'ar' 
                ? 'إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى التواصل معنا:'
                : 'If you have any questions about these terms and conditions, please contact us:'
              }
            </Text>
            <Text style={styles.contactEmail}>legal@ourapp.com</Text>
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
    marginBottom: 8,
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  termsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'justify',
  },
  contactSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
    marginTop: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  contactEmail: {
    fontSize: 14,
    color: '#36c7f6',
    fontWeight: '600',
  },
});

export default TermsScreen; 