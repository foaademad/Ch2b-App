import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Phone, Upload } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../src/context/LanguageContext';
import { createProblem } from '../src/store/api/supportApi';
import { clearError, clearSuccess } from '../src/store/slice/supportSlice';
import { RootState } from '../src/store/store';

export default function SupportScreen() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Redux state
  const { loading, error, success, lastSubmittedProblem } = useSelector((state: RootState) => state.support);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Other',
    description: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const problemCategories = [
    { value: 'shipping', label: t('support.categories.shipping') },
    { value: 'payment', label: t('support.categories.payment') },
    { value: 'product', label: t('support.categories.product') },
    { value: 'account', label: t('support.categories.account') },
    { value: 'technical', label: t('support.categories.technical') },
    { value: 'other', label: t('support.categories.other') },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.description) {
      Toast.show({
        type: 'error',
        text1: t('support.error'),
        text2: t('support.fill_required_fields'),
        position: 'top',
      });
      return;
    }

    console.log('Submitting support form with data:', formData);

    // إرسال البيانات للـ API
    const result = await dispatch(createProblem(formData) as any);
    
    console.log('Support form submission result:', result);
    
    if (result.success) {
      // إعادة تعيين النموذج
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: 'Other',
        description: '',
      });
      setSelectedImage(null);
      
      console.log('Form reset after successful submission');
    }
  };

  // متابعة تغييرات الحالة
  useEffect(() => {
    if (success && lastSubmittedProblem) {
      const { message, problemId, result } = lastSubmittedProblem;
      
      Toast.show({
        type: 'success',
        text1: t('support.success'),
        text2: `${message}\n${t('support.problem_id', { id: problemId })}`,
        position: 'top',
        visibilityTime: 5000, // وقت أطول لقراءة المعلومات
      });
      
      dispatch(clearSuccess());
      
      // العودة للصفحة السابقة بعد 3 ثوان
      setTimeout(() => {
        router.back();
      }, 3000);
    }
  }, [success, lastSubmittedProblem]);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: t('support.error'),
        text2: error,
        position: 'top',
        visibilityTime: 4000,
      });
      
      dispatch(clearError());
    }
  }, [error]);

  const selectImage = () => {
    // هنا يمكن إضافة منطق اختيار الصورة
    Toast.show({
      type: 'info',
      text1: t('support.image_upload'),
      text2: t('support.image_upload_desc'),
      position: 'top',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" style={{ transform: [{ rotate: isRTL ? '180deg' : '0deg' }] }} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('support.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support.contact_info')}</Text>
          
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Phone size={20} color="#36c7f6" />
            </View>
            <View style={styles.contactDetails}>
              <Text style={styles.contactTitle}>{t('support.phone_support')}</Text>
              <Text style={styles.contactSubtitle}>+1 (555) 123-4567</Text>
              <Text style={styles.contactTime}>Monday - Friday, 9am - 5pm EST</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <Mail size={20} color="#36c7f6" />
            </View>
            <View style={styles.contactDetails}>
              <Text style={styles.contactTitle}>{t('support.email_support')}</Text>
              <Text style={styles.contactSubtitle}>support@importease.com</Text>
              <Text style={styles.contactTime}>{t('support.response_time')}</Text>
            </View>
          </View>

          
        </View>

        {/* Send Message Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('support.send_message')}</Text>
          
          <View style={styles.formRow}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>{t('support.name')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('support.name_placeholder')}
                value={formData.name}
                onChangeText={(text) => handleInputChange('name', text)}
                editable={!loading}
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>{t('support.email')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('support.email_placeholder')}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
          </View>

          <Text style={styles.label}>{t('support.phone')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('support.phone_placeholder')}
            value={formData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
            keyboardType="phone-pad"
            editable={!loading}
          />

          <Text style={styles.label}>{t('support.problem_category')}</Text>
          <View style={styles.picker}>
            <Text style={styles.pickerText}>
              {problemCategories.find(cat => cat.value === formData.category.toLowerCase())?.label || t('support.categories.other')}
            </Text>
          </View>

          <Text style={styles.label}>{t('support.image_optional')}</Text>
          <TouchableOpacity 
            style={[styles.imageUpload, loading && styles.disabledButton]} 
            onPress={selectImage}
            disabled={loading}
          >
            <Upload size={20} color="#666" />
            <Text style={styles.imageUploadText}>{t('support.choose_file')}</Text>
          </TouchableOpacity>
          <Text style={styles.imageHint}>{t('support.image_help')}</Text>

          <Text style={styles.label}>{t('support.description')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('support.description_placeholder')}
            value={formData.description}
            onChangeText={(text) => handleInputChange('description', text)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={!loading}
          />

          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>{t('support.send_message')}</Text>
            )}
          </TouchableOpacity>
        </View>

       
      </ScrollView>
    </View>
  );
}

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
    paddingTop: 50,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactSubtitle: {
    fontSize: 14,
    color: '#36c7f6',
    marginTop: 2,
  },
  contactTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  pickerText: {
    fontSize: 16,
    color: '#333',
  },
  imageUpload: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    gap: 8,
  },
  imageUploadText: {
    fontSize: 16,
    color: '#666',
  },
  imageHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#36c7f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 