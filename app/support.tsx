import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Formik } from 'formik';
import { ArrowLeft, ArrowRight, Mail, Phone, Upload, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useLanguage } from '../src/context/LanguageContext';
import { createProblem } from '../src/store/api/supportApi';
import { RootState } from '../src/store/store';
import { ProblemInterface } from '../src/store/utility/interfaces/supportInterface';




// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  subject: Yup.number()
    .typeError('Problem type is required')
    .required('Problem type is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .required('Message is required'),
  orderNumber: Yup.string()
    .test('phone-format', 'Phone number must start with country code (e.g., +966, +967)', function(value) {
      if (!value) return false;
      return /^\+966|^\+967/.test(value);
    })
    .required('Phone number is required'),
});

interface FormValues {
  name: string;
  email: string;
  subject: number;
  message: string;
  orderNumber: string;
}

export default function SupportScreen() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState<{
    uri: string;
    fileName?: string;
    mimeType?: string;
    fileSize?: number;
  } | null>(null);

  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const { error, problem } = useSelector((state: RootState) => state.problem);
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: t('support.error'),
        text2: error,
        position: 'top',
        visibilityTime: 3000,
      });
    }
  }, [error, dispatch, t]);
  useEffect(() => {
    if (problem) {
      Toast.show({
        type: 'success',
        text1: t('support.success'),
        text2: t('support.success_message'),
        position: 'top',
        visibilityTime: 3000,
      });
    }
  }, [problem, dispatch, t]);
  

  const problemCategories = [
    { value: 0, label: t('support.problem_type.tech_support') },
    { value: 1, label: t('support.problem_type.account') },
    { value: 2, label: t('support.problem_type.other') },
    { value: 3, label: t('support.problem_type.suggestion') },
    { value: 4, label: t('support.problem_type.bug') },
  ];

  const initialValues: FormValues = {
    name: '',
    email: '',
    subject: 0,
    message: '',
    orderNumber: '',
  };


  const handleSubmit = (values: FormValues, { resetForm }: any) => {
    const problemData: ProblemInterface = {
      name: values.name,
      email: values.email,
      phoneNumber: values.orderNumber,
      description: values.message,
      type: values.subject,
    };

    if (selectedImage) {
      problemData.image = selectedImage.uri;
      problemData.imageDto = {
        fileName: selectedImage.fileName || 'uploaded_image.jpg',
        fileType: selectedImage.mimeType || 'image/jpeg',
        fileSize: selectedImage.fileSize?.toString() || '0',
      };
    }
    dispatch(createProblem(problemData) as any);
    resetForm();
    setSelectedImage(null);
    setTimeout(() => {
      router.back();
    }, 1000);

    // Show toast message
    Toast.show({
      type: 'success',
      text1: t('support.success'),
      text2: t('support.success_message'),
      position: 'top',
      visibilityTime: 3000,
    });
  };

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: t('support.permission_denied'),
        text2: t('support.permission_message'),
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedImage({
        uri: asset.uri,
        fileName: asset.fileName || 'uploaded_image.jpg',
        mimeType: asset.mimeType || 'image/jpeg',
        fileSize: asset.fileSize || 0,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          {isRTL ? (
            <ArrowLeft size={24} color="#000" />
          ) : (
            <ArrowRight size={24} color="#000" />
          )}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('support.title')}</Text>
      </View>

      <TouchableWithoutFeedback onPress={() => setShowCategoryPicker(false)}>
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

          {/* Send Message Form with Formik */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('support.send_message')}</Text>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <>
                  <View style={styles.formRow}>
                    <View style={styles.halfWidth}>
                      <Text style={styles.label}>{t('help.report.form.name')}</Text>
                      <TextInput
                        style={[styles.input, touched.name && errors.name ? styles.inputError : null]}
                        placeholder={t('help.report.form.placename')}
                        value={values.name}
                        onChangeText={handleChange('name')}
                        onBlur={handleBlur('name')}
                      />
                      {touched.name && errors.name && (
                        <Text style={styles.errorText}>{errors.name}</Text>
                      )}
                    </View>
                    <View style={styles.halfWidth}>
                      <Text style={styles.label}>{t('help.report.form.email')}</Text>
                      <TextInput
                        style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                        placeholder={t('help.report.form.placeemail')}
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        keyboardType="email-address"
                      />
                      {touched.email && errors.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                      )}
                    </View>
                  </View>

                  <Text style={styles.label}>{t('help.report.form.number')}</Text>
                  <TextInput
                    style={[styles.input, touched.orderNumber && errors.orderNumber ? styles.inputError : null]}
                    placeholder="e.g. +1234567890"
                    value={values.orderNumber}
                    onChangeText={handleChange('orderNumber')}
                    onBlur={handleBlur('orderNumber')}
                  />
                  {touched.orderNumber && errors.orderNumber && (
                    <Text style={styles.errorText}>{errors.orderNumber}</Text>
                  )}

                  <Text style={styles.label}>{t('help.report.form.type.title')}</Text>
                  <TouchableOpacity
                    style={[
                      styles.picker, 
                      showCategoryPicker && styles.pickerActive,
                      touched.subject && errors.subject ? styles.inputError : null
                    ]}
                    onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                  >
                    <Text style={styles.pickerText}>
                      {problemCategories.find(cat => cat.value === values.subject)?.label || t('support.problem_type.tech_support')}
                    </Text>
                  </TouchableOpacity>
                  {touched.subject && errors.subject && (
                    <Text style={styles.errorText}>{errors.subject}</Text>
                  )}

                  {showCategoryPicker && (
                    <View style={styles.categoryDropdown}>
                      {problemCategories.map((category) => (
                        <TouchableOpacity
                          key={category.value}
                          style={[
                            styles.categoryOption,
                            values.subject === category.value && styles.selectedOption
                          ]}
                          onPress={() => {
                            setFieldValue('subject', category.value);
                            setShowCategoryPicker(false);
                          }}
                        >
                          <Text style={[
                            styles.categoryOptionText,
                            values.subject === category.value && styles.selectedOptionText
                          ]}>
                            {category.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <Text style={styles.label}>{t('help.report.form.comment')}</Text>
                  <TextInput
                    style={[
                      styles.input, 
                      styles.textArea,
                      touched.message && errors.message ? styles.inputError : null
                    ]}
                    placeholder={t('help.report.form.placecomment')}
                    value={values.message}
                    onChangeText={handleChange('message')}
                    onBlur={handleBlur('message')}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                  {touched.message && errors.message && (
                    <Text style={styles.errorText}>{errors.message}</Text>
                  )}

                  <Text style={styles.label}>{t('support.image_optional')}</Text>
                  <TouchableOpacity
                    style={styles.imageUpload}
                    onPress={selectImage}
                  >
                    {selectedImage ? (
                      <View style={styles.selectedImageContainer}>
                        <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                        <TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.removeImageButton}>
                          <X size={20} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <>
                        <Upload size={20} color="#666" />
                        <Text style={styles.imageUploadText}>{t('support.choose_file')}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <Text style={styles.imageHint}>{t('support.image_help')}</Text>

                  <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.submitButtonText}>{t('help.report.submit')}</Text>
                  </TouchableOpacity>
                </>
              )}
            </Formik>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
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
  inputError: {
    borderColor: '#ff4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
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
  pickerActive: {
    borderColor: '#36c7f6',
    borderWidth: 2,
  },
  categoryDropdown: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 150,
    overflow: 'hidden',
  },
  categoryOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOption: {
    backgroundColor: '#f0f8ff',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#36c7f6',
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
  selectedImageContainer: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
});