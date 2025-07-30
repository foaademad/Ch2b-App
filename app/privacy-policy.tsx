import { useLanguage } from '@/src/context/LanguageContext';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PrivacyPolicyScreen = () => {
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
        <Text style={styles.headerTitle}>{t('profile.settings.privacy_policy')}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>
            {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </Text>
          
          <Text style={styles.lastUpdated}>
            {language === 'ar' ? 'آخر تحديث:' : 'Last Updated:'} {new Date().toLocaleDateString()}
          </Text>

          <Text style={styles.introduction}>
            {language === 'ar' 
              ? 'نحن نلتزم بحماية خصوصيتك. تشرح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام تطبيقنا.'
              : 'We are committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information when you use our application.'
            }
          </Text>

          <View style={styles.policySection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '1. المعلومات التي نجمعها' : '1. Information We Collect'}
            </Text>
            <Text style={styles.policyText}>
              {language === 'ar' 
                ? 'نحن نجمع المعلومات التالية:'
                : 'We collect the following information:'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• معلومات الحساب: الاسم، البريد الإلكتروني، رقم الهاتف'
                : '• Account information: Name, email, phone number'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• معلومات الطلب: عناوين الشحن، تفاصيل الدفع'
                : '• Order information: Shipping addresses, payment details'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• معلومات الاستخدام: سجل التصفح، التفضيلات'
                : '• Usage information: Browsing history, preferences'
              }
            </Text>
          </View>

          <View style={styles.policySection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '2. كيفية استخدام المعلومات' : '2. How We Use Information'}
            </Text>
            <Text style={styles.policyText}>
              {language === 'ar' 
                ? 'نستخدم معلوماتك للأغراض التالية:'
                : 'We use your information for the following purposes:'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• معالجة الطلبات وتقديم الخدمات'
                : '• Processing orders and providing services'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• التواصل معك بخصوص طلباتك'
                : '• Communicating with you about your orders'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• تحسين تجربة المستخدم'
                : '• Improving user experience'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• إرسال عروض ترويجية (بموافقتك)'
                : '• Sending promotional offers (with your consent)'
              }
            </Text>
          </View>

          <View style={styles.policySection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '3. مشاركة المعلومات' : '3. Information Sharing'}
            </Text>
            <Text style={styles.policyText}>
              {language === 'ar' 
                ? 'لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:'
                : 'We do not sell, rent, or share your personal information with third parties except in the following cases:'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• مع مزودي الخدمات الموثوقين (الشحن، الدفع)'
                : '• With trusted service providers (shipping, payment)'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• عند طلب القانون أو السلطات المختصة'
                : '• When required by law or competent authorities'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• لحماية حقوقنا وممتلكاتنا'
                : '• To protect our rights and property'
              }
            </Text>
          </View>

          <View style={styles.policySection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '4. حماية المعلومات' : '4. Information Protection'}
            </Text>
            <Text style={styles.policyText}>
              {language === 'ar' 
                ? 'نحن نستخدم تقنيات تشفير متقدمة لحماية معلوماتك:'
                : 'We use advanced encryption technologies to protect your information:'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• تشفير SSL/TLS لجميع المعاملات'
                : '• SSL/TLS encryption for all transactions'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• خوادم آمنة محمية'
                : '• Secure protected servers'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• مراقبة مستمرة للأمان'
                : '• Continuous security monitoring'
              }
            </Text>
          </View>

          <View style={styles.policySection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '5. ملفات تعريف الارتباط' : '5. Cookies'}
            </Text>
            <Text style={styles.policyText}>
              {language === 'ar' 
                ? 'نستخدم ملفات تعريف الارتباط لتحسين تجربتك. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال إعدادات المتصفح.'
                : 'We use cookies to improve your experience. You can control cookie settings through your browser settings.'
              }
            </Text>
          </View>

          <View style={styles.policySection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '6. حقوقك' : '6. Your Rights'}
            </Text>
            <Text style={styles.policyText}>
              {language === 'ar' 
                ? 'لديك الحق في:'
                : 'You have the right to:'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• الوصول إلى معلوماتك الشخصية'
                : '• Access your personal information'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• تصحيح المعلومات غير الدقيقة'
                : '• Correct inaccurate information'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• حذف معلوماتك الشخصية'
                : '• Delete your personal information'
              }
            </Text>
            <Text style={styles.bulletPoint}>
              {language === 'ar' 
                ? '• الاعتراض على معالجة معلوماتك'
                : '• Object to processing your information'
              }
            </Text>
          </View>

          <View style={styles.policySection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '7. الاحتفاظ بالمعلومات' : '7. Data Retention'}
            </Text>
            <Text style={styles.policyText}>
              {language === 'ar' 
                ? 'نحتفظ بمعلوماتك طالما كان حسابك نشطاً أو حسب المتطلبات القانونية. يمكنك طلب حذف معلوماتك في أي وقت.'
                : 'We retain your information as long as your account is active or as required by law. You can request deletion of your information at any time.'
              }
            </Text>
          </View>

          <View style={styles.policySection}>
            <Text style={styles.sectionTitle}>
              {language === 'ar' ? '8. التغييرات على السياسة' : '8. Changes to Policy'}
            </Text>
            <Text style={styles.policyText}>
              {language === 'ar' 
                ? 'قد نقوم بتحديث هذه السياسة من وقت لآخر. سنقوم بإشعارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو داخل التطبيق.'
                : 'We may update this policy from time to time. We will notify you of any material changes via email or within the application.'
              }
            </Text>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>
              {language === 'ar' ? 'للاستفسارات' : 'For Inquiries'}
            </Text>
            <Text style={styles.contactText}>
              {language === 'ar' 
                ? 'إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا:'
                : 'If you have any questions about this privacy policy, please contact us:'
              }
            </Text>
            <Text style={styles.contactEmail}>Zimabedakcompany@gmail.com</Text>
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
    marginBottom: 16,
  },
  introduction: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'justify',
  },
  policySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  policyText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'justify',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 16,
    marginBottom: 4,
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

export default PrivacyPolicyScreen; 