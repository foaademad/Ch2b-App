import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Shadows } from '../constants/Shadows';
import { useLanguage } from '../src/context/LanguageContext';
import { addNewAddress, deleteExistingAddress, fetchAddresses } from '../src/store/api/addressApi';
import { RootState } from '../src/store/store';

// بيانات الدول والمدن
// const countries = [
//   { label: 'Saudi Arabia', value: 'saudi' },
//   { label: 'Yemen', value: 'yemen' },
// ];

// const citiesByCountry: Record<string, { label: string; value: string }[]> = {
//   saudi: [
//     { label: 'Riyadh Region', value: 'Riyadh' },
//     { label: 'Makkah Region', value: 'Makkah' },
//     { label: 'Eastern Province', value: 'Eastern Province' },
//     { label: 'Asir Region', value: 'Asir' },
//     { label: 'Jazan Region', value: 'Jazan' },
//     { label: 'Najran Region', value: 'Najran' },
//     { label: 'Al Bahah Region', value: 'Al Bahah' },
//     { label: 'Al Jouf Region', value: 'Al Jouf' },
//     { label: 'Northern Borders Region', value: 'Northern Borders' },
//     { label: 'Qassim Region', value: 'Qassim' },
//     { label: 'Hail Region', value: 'Hail' },
//     { label: 'Tabuk Region', value: 'Tabuk' },
//     { label: 'Madinah Region', value: 'Madinah' },
//   ],
//   yemen: [
//     { label: 'Sana\'a', value: 'Sana\'a' },
//     { label: 'Aden', value: 'Aden' },
//     { label: 'Taiz', value: 'Taiz' },
//     { label: 'Al Hudaydah', value: 'Al Hudaydah' },
//     { label: 'Ibb', value: 'Ibb' },
//     { label: 'Dhamar', value: 'Dhamar' },
//     { label: 'Al Mahwit', value: 'Al Mahwit' },
//     { label: 'Amran', value: 'Amran' },
//     { label: 'Sana\'a (Governorate)', value: 'Sana\'a Governorate' },
//     { label: 'Sa\'dah', value: 'Sa\'dah' },
//     { label: 'Al Jawf', value: 'Al Jawf' },
//     { label: 'Marib', value: 'Marib' },
//     { label: 'Al Bayda', value: 'Al Bayda' },
//     { label: 'Abyan', value: 'Abyan' },
//     { label: 'Lahij', value: 'Lahij' },
//     { label: 'Al Dhale\'e', value: 'Al Dhale\'e' },
//     { label: 'Shabwah', value: 'Shabwah' },
//     { label: 'Hadramout', value: 'Hadramout' },
//     { label: 'Al Mahrah', value: 'Al Mahrah' },
//     { label: 'Socotra', value: 'Socotra' },
//   ],
// };

// دالة للحصول على الترجمة حسب اللغة
const getTranslatedCountries = (t: any) => [
  { label: t('countries.saudi_arabia'), value: 'saudi' },
  { label: t('countries.yemen'), value: 'yemen' },
];

const getTranslatedCities = (t: any): Record<string, { label: string; value: string }[]> => ({
  saudi: [
    { label: t('cities.riyadh'), value: 'Riyadh' },
    { label: t('cities.makkah'), value: 'Makkah' },
    { label: t('cities.eastern_province'), value: 'Eastern Province' },
    { label: t('cities.asir'), value: 'Asir' },
    { label: t('cities.jazan'), value: 'Jazan' },
    { label: t('cities.najran'), value: 'Najran' },
    { label: t('cities.al_bahah'), value: 'Al Bahah' },
    { label: t('cities.al_jouf'), value: 'Al Jouf' },
    { label: t('cities.northern_borders'), value: 'Northern Borders' },
    { label: t('cities.qassim'), value: 'Qassim' },
    { label: t('cities.hail'), value: 'Hail' },
    { label: t('cities.tabuk'), value: 'Tabuk' },
    { label: t('cities.madinah'), value: 'Madinah' },
  ],
  yemen: [
    { label: t('cities.sanaa'), value: 'Sana\'a' },
    { label: t('cities.aden'), value: 'Aden' },
    { label: t('cities.taiz'), value: 'Taiz' },
    { label: t('cities.al_hudaydah'), value: 'Al Hudaydah' },
    { label: t('cities.ibb'), value: 'Ibb' },
    { label: t('cities.dhamar'), value: 'Dhamar' },
    { label: t('cities.al_mahwit'), value: 'Al Mahwit' },
    { label: t('cities.amran'), value: 'Amran' },
    { label: t('cities.sanaa_governorate'), value: 'Sana\'a Governorate' },
    { label: t('cities.sadah'), value: 'Sa\'dah' },
    { label: t('cities.al_jawf'), value: 'Al Jawf' },
    { label: t('cities.marib'), value: 'Marib' },
    { label: t('cities.al_bayda'), value: 'Al Bayda' },
    { label: t('cities.abyan'), value: 'Abyan' },
    { label: t('cities.lahij'), value: 'Lahij' },
    { label: t('cities.al_dhalee'), value: 'Al Dhale\'e' },
    { label: t('cities.shabwah'), value: 'Shabwah' },
    { label: t('cities.hadramout'), value: 'Hadramout' },
    { label: t('cities.al_mahrah'), value: 'Al Mahrah' },
    { label: t('cities.socotra'), value: 'Socotra' },
  ],
});

export default function AddressesScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isRTL } = useLanguage();
  const dispatch = useDispatch();
  
  // Redux state
  const { addresses, loading, addLoading, deleteLoading, error } = useSelector((state: RootState) => state.address);
  const { authModel } = useSelector((state: RootState) => state.auth);
  
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // جلب العناوين عند تحميل الصفحة
  useEffect(() => {
    if (authModel?.result?.userId) {
      dispatch(fetchAddresses(authModel.result.userId) as any);
    }
  }, [dispatch, authModel]);

  // عرض رسائل الخطأ
  useEffect(() => {
    if (error && !addLoading) {
      Toast.show({
        type: 'error',
        text1: t('Error'),
        text2: error,
        position: 'top',
      });
    }
  }, [error, t, addLoading]);

  const handleAddAddress = () => {
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = async (addressId: number) => {
    const result = await dispatch(deleteExistingAddress(addressId) as any);
    if (result.success) {
      Toast.show({
        type: 'success',
        text1: t('profile.addresses.delete_success'),
        position: 'top',
      });
    }
  };

  const handleSaveAddress = async (values: any, { resetForm }: any) => {
    if (!authModel?.result?.userId) {
      Toast.show({
        type: 'error',
        text1: t('Error'),
        text2: 'User ID not found',
        position: 'top',
      });
      return;
    }

    const now = new Date().toISOString();
    const addressData = {
      address: values.address,
      city: values.city,
      state: values.state,
      country: values.country,
      street: values.streetAddress,
      createdAt: now,
      updatedAt: now,
      userId: authModel.result.userId,
    };

    console.log('Sending address data:', addressData);
    const result = await dispatch(addNewAddress(addressData, authModel.result.userId) as any);
    console.log('API result:', result);
    
    if (result && result.success) {
      setIsAddingAddress(false);
      resetForm();
      // إعادة جلب العناوين للتأكد من تحديث القائمة
      if (authModel?.result?.userId) {
        dispatch(fetchAddresses(authModel.result.userId) as any);
      }
      Toast.show({
        type: 'success',
        text1: t('profile.addresses.add_success'),
        position: 'top',
      });
    } else {
      // إذا لم تنجح العملية، لا نخفي المودل
      console.log('Address addition failed:', result);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={[styles.header, isRTL && styles.headerRTL]}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, isRTL && styles.backButtonRTL]}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>{t('profile.addresses.title')}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, isRTL && styles.backButtonRTL]}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isRTL && styles.textRTL]}>{t('profile.addresses.title')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {addresses.length === 0 && !isAddingAddress && (
          <Text style={[styles.noAddressesText, isRTL && styles.textRTL]}>
            {t('profile.addresses.no_addresses')}
          </Text>
        )}
        
        {addresses.map((address) => (
          <View key={address.id} style={styles.addressCard}>
            <View style={[styles.addressHeader, isRTL && styles.addressHeaderRTL]}>
              <Text style={[styles.addressName, isRTL && styles.textRTL]}>{address.country}</Text>
              <View style={[styles.addressActions, isRTL && styles.addressActionsRTL]}>
                <TouchableOpacity 
                  onPress={() => handleDeleteAddress(address.id)} 
                  style={styles.actionButton}
                  disabled={deleteLoading}
                >
                  <Trash2 size={20} color="#FF5252" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.addressText, isRTL && styles.textRTL]}>{address.address}</Text>
            <Text style={[styles.addressText, isRTL && styles.textRTL]}>
              {address.city}, {address.state}
            </Text>
            <Text style={[styles.addressText, isRTL && styles.textRTL]}>{address.street}</Text>
          </View>
        ))}

        {isAddingAddress && (
          <Formik
            initialValues={{
              country: 'saudi',
              state: '',
              address: '',
              city: '',
              streetAddress: '',
            }}
            validationSchema={Yup.object({
              country: Yup.string().required(t('validation.country_required')),
              state: Yup.string().required(t('validation.state_required')),
              address: Yup.string().required(t('validation.address_required')),
              city: Yup.string().required(t('validation.city_required')),
              streetAddress: Yup.string().required(t('validation.street_address_required')),
            })}
            onSubmit={handleSaveAddress}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.formContainer}>
                <Text style={[styles.formTitle, isRTL && styles.textRTL]}>
                  {t('profile.addresses.add_new')}
                </Text>
                {/* الدولة */}
                <View style={styles.pickerContainer}>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={values.country}
                      onValueChange={(value: string) => {
                        setFieldValue('country', value);
                        setFieldValue('state', '');
                      }}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      {getTranslatedCountries(t).map(c => (
                        <Picker.Item key={c.value} label={c.label} value={c.value} />
                      ))}
                    </Picker>
                  </View>
                  {touched.country && errors.country && (
                    <Text style={styles.errorText}>{errors.country}</Text>
                  )}
                </View>
                {/* المدينة (state) */}
                <View style={styles.pickerContainer}>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={values.state}
                      onValueChange={(value: string) => setFieldValue('state', value)}
                      style={styles.picker}
                      itemStyle={styles.pickerItem}
                    >
                      <Picker.Item label={t('profile.addresses.state') + '*'} value="" />
                      {(getTranslatedCities(t) as any)[values.country]?.map((city: { label: string; value: string }) => (
                        <Picker.Item key={city.value} label={city.label} value={city.value} />
                      ))}
                    </Picker>
                  </View>
                  {touched.state && errors.state && (
                    <Text style={styles.errorText}>{errors.state}</Text>
                  )}
                </View>
                {/* العنوان */}
                <TextInput
                  style={[styles.input, isRTL && styles.inputRTL]}
                  placeholder={t('profile.addresses.address')}
                  value={values.address}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  textAlign={isRTL ? 'right' : 'left'}
                />
                {touched.address && errors.address && (
                  <Text style={styles.errorText}>{errors.address}</Text>
                )}
                {/* المدينة */}
                <TextInput
                  style={[styles.input, isRTL && styles.inputRTL]}
                  placeholder={t('profile.addresses.city')}
                  value={values.city}
                  onChangeText={handleChange('city')}
                  onBlur={handleBlur('city')}
                  textAlign={isRTL ? 'right' : 'left'}
                />
                {touched.city && errors.city && (
                  <Text style={styles.errorText}>{errors.city}</Text>
                )}
                {/* عنوان الشارع */}
                <TextInput
                  style={[styles.input, isRTL && styles.inputRTL]}
                  placeholder="123 Main Street"
                  value={values.streetAddress}
                  onChangeText={handleChange('streetAddress')}
                  onBlur={handleBlur('streetAddress')}
                  textAlign={isRTL ? 'right' : 'left'}
                />
                {touched.streetAddress && errors.streetAddress && (
                  <Text style={styles.errorText}>{errors.streetAddress}</Text>
                )}
                <View style={[styles.formButtons, isRTL && styles.formButtonsRTL]}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => {
                      setIsAddingAddress(false);
                    }}
                    disabled={addLoading}
                  >
                    <Text style={styles.cancelButtonText}>{t('Cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSubmit as any}
                    disabled={addLoading}
                  >
                    <Text style={styles.saveButtonText}>
                      {addLoading ? t('common.loading') : t('profile.addresses.save')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        )}

        {!isAddingAddress && (
          <TouchableOpacity style={[styles.addButton, isRTL && styles.addButtonRTL]} onPress={handleAddAddress}>
            <Plus size={24} color="#fff" />
            <Text style={[styles.addButtonText, isRTL && styles.addButtonTextRTL]}>
              {t('profile.addresses.add_new')}
            </Text>
          </TouchableOpacity>
        )}
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
    paddingTop: 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Shadows.medium,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addressActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  addressText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  saveButton: {
    backgroundColor: '#2196F3',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#36c7f6',
    padding: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backButtonRTL: {
    marginRight: 0,
    marginLeft: 16,
  },
  textRTL: {
    textAlign: 'right',
  },
  addressHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  addressActionsRTL: {
    flexDirection: 'row-reverse',
  },
  inputRTL: {
    textAlign: 'right',
  },
  formButtonsRTL: {
    flexDirection: 'row-reverse',
  },
  addButtonRTL: {
    flexDirection: 'row-reverse',
  },
  addButtonTextRTL: {
    marginLeft: 0,
    marginRight: 8,
  },
  noAddressesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 32,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerWrapper: {
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
}); 