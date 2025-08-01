import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../src/context/LanguageContext';

const PaymentMethodsScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'card',
      title: language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card',
      subtitle: language === 'ar' ? 'فيزا، ماستركارد، أمريكان إكسبريس' : 'Visa, Mastercard, American Express',
      icon: 'card-outline',
      color: '#2196F3'
    },
    {
      id: 'paypal',
      title: 'PayPal',
      subtitle: language === 'ar' ? 'الدفع عبر باي بال' : 'Pay with PayPal',
      icon: 'logo-paypal',
      color: '#0070BA'
    },
    {
      id: 'apple-pay',
      title: 'Apple Pay',
      subtitle: language === 'ar' ? 'الدفع عبر آبل باي' : 'Pay with Apple Pay',
      icon: 'logo-apple',
      color: '#000'
    },
    {
      id: 'google-pay',
      title: 'Google Pay',
      subtitle: language === 'ar' ? 'الدفع عبر جوجل باي' : 'Pay with Google Pay',
      icon: 'logo-google',
      color: '#4285F4'
    },
    {
      id: 'cash',
      title: language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery',
      subtitle: language === 'ar' ? 'ادفع عند استلام الطلب' : 'Pay when you receive your order',
      icon: 'cash-outline',
      color: '#4CAF50'
    }
  ];

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const handleSave = () => {
    if (selectedMethod) {
      Alert.alert(
        language === 'ar' ? 'تم الحفظ' : 'Saved',
        language === 'ar' ? 'تم حفظ طريقة الدفع بنجاح' : 'Payment method saved successfully',
        [{ text: language === 'ar' ? 'حسناً' : 'OK', onPress: () => router.back() }]
      );
    } else {
      Alert.alert(
        language === 'ar' ? 'خطأ' : 'Error',
        language === 'ar' ? 'يرجى اختيار طريقة دفع' : 'Please select a payment method',
        [{ text: language === 'ar' ? 'حسناً' : 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, isRTL && styles.headerRTL]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons 
            name={isRTL ? "chevron-forward" : "chevron-back"} 
            size={24} 
            color="#333" 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === 'ar' ? 'طرق الدفع' : 'Payment Methods'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Payment Methods List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {language === 'ar' ? 'اختر طريقة الدفع المفضلة' : 'Choose your preferred payment method'}
        </Text>
        
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodItem,
              selectedMethod === method.id && styles.selectedMethod
            ]}
            onPress={() => handleMethodSelect(method.id)}
          >
            <View style={styles.methodIcon}>
              <Ionicons 
                name={method.icon as any} 
                size={24} 
                color={method.color} 
              />
            </View>
            <View style={styles.methodContent}>
              <Text style={styles.methodTitle}>{method.title}</Text>
              <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
            </View>
            <View style={styles.radioButton}>
              {selectedMethod === method.id && (
                <View style={styles.radioButtonSelected} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, !selectedMethod && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!selectedMethod}
        >
          <Text style={styles.saveButtonText}>
            {language === 'ar' ? 'حفظ' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 20,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  selectedMethod: {
    borderWidth: 2,
    borderColor: '#2196F3',
    backgroundColor: '#f0f8ff',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  methodSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentMethodsScreen; 