import { getShippingTax } from '@/src/store/api/shippingTaxApi';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Package } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLanguage } from '../src/context/LanguageContext';
import { fetchAddresses } from '../src/store/api/addressApi';
import { getCommition } from '../src/store/api/commitionScimaApi';
import { RootState } from '../src/store/store';

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isRTL } = useLanguage();
  
  // استخدام Redux مباشرة بدلاً من ShopContext
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { commition, loading: commitionLoading } = useSelector((state: RootState) => state.commition);
  const { shippingTax, loading: shippingTaxLoading } = useSelector((state: RootState) => state.shippingTax);
  const { addresses, loading: addressesLoading } = useSelector((state: RootState) => state.address);
  const { authModel } = useSelector((state: RootState) => state.auth);
  const userType = useSelector((state: RootState) => (state.auth.authModel?.result as any)?.userType) || 0;
  
  const cart = cartItems.map(item => ({
    id: item.id || 0,
    name: item.title || '',
    price: item.totalPrice || 0,
    image: item.image || '',
    rating: 0,
    reviews: 0,
    quantity: item.quntity || 1
  }));
  
  // دوال مؤقتة - سيتم تنفيذها لاحقاً
  const removeFromCart = (id: number) => console.log("Remove from cart:", id);
  const addToOrderHistory = (order: any) => console.log("Add to order history:", order);
  const clearCart = () => console.log("Clear cart");
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [shippingType, setShippingType] = useState('express'); // 'express' or 'support'
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getCommition() as any);
    dispatch(getShippingTax() as any);
    // جلب عناوين المستخدم
    if (authModel?.result?.userId) {
      dispatch(fetchAddresses(authModel.result.userId) as any);
    }
  }, [dispatch, authModel]);

  // حساب العمولة بناءً على نظام العمولة الجديد
  const calculateCommission = () => {
    if (!commition || commitionLoading) return 0;
    
    // إذا تم اختيار "Contact Support for Shipping"، اجعل العمولة 0
    if (shippingType === 'support') {
      console.log("Commission set to 0 due to Contact Support shipping");
      return 0;
    }
    
    const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    console.log("Commission calculation:", {
      userType,
      commitionUserType: commition.userType,
      totalQuantity,
      lowerLimit: commition.lowerLimit,
      upperLimit: commition.upperLimit,
      commissionRate: commition.commissionRate,
      isActive: commition.isActive,
      subtotal,
      shippingType
    });
    
    // التحقق من userType وحدود الكمية
    if (commition.userType === userType && 
        totalQuantity >= commition.lowerLimit && 
        totalQuantity <= commition.upperLimit &&
        commition.isActive) {
      const calculatedCommission = subtotal * commition.commissionRate;
      console.log("Commission applied:", calculatedCommission);
      return calculatedCommission;
    }
    
    console.log("Commission not applied - conditions not met");
    return 0;
  };

  // حساب الشحن بناءً على نظام الشحن الجديد
  const calculateShipping = () => {
    if (!shippingTax || shippingTaxLoading) return 10; // قيمة افتراضية
    
    // إذا تم اختيار "Contact Support for Shipping"، اجعل الشحن 0
    if (shippingType === 'support') {
      console.log("Shipping set to 0 due to Contact Support shipping");
      return 0;
    }
    
    const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    
    console.log("Shipping calculation:", {
      userType,
      shippingTaxUserType: shippingTax.userType, // 0 = بالوزن، 1 = بالحجم
      totalQuantity,
      lowerLimit: shippingTax.lowerLimit,
      upperLimit: shippingTax.upperLimit,
      shippingPrice: shippingTax.shippingPrice,
      isActive: shippingTax.isActive,
      shippingType,
      subtotal
    });
    
    // التحقق من حدود الكمية وحالة النشاط
    // ملاحظة: userType في shippingTax يمثل نوع الشحن (0 = بالوزن، 1 = بالحجم)
    // يمكن استخدامه لاحقاً لتطبيق قواعد مختلفة حسب نوع الشحن
    if (totalQuantity >= shippingTax.lowerLimit && 
        totalQuantity <= shippingTax.upperLimit &&
        shippingTax.isActive) {
      // حساب الشحن كـ نسبة مئوية من سعر المنتج
      const calculatedShipping = subtotal * (shippingTax.shippingPrice / 100);
      console.log("Shipping applied as percentage:", {
        percentage: shippingTax.shippingPrice,
        subtotal,
        calculatedShipping
      });
      return calculatedShipping;
    }
    
    console.log("Default shipping applied - conditions not met");
    return 10; // قيمة افتراضية
  };

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = calculateShipping();
  const commission = calculateCommission();
  const finalTotal = total + shipping + commission;

  // التحقق من إمكانية إتمام الطلب
  const canPlaceOrder = selectedAddressId !== null && addresses.length > 0;

  const handlePlaceOrder = () => {
    if (!canPlaceOrder) {
      return;
    }
    
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    console.log('Placing order with address:', selectedAddress);
    // هنا سيتم إضافة منطق إتمام الطلب
  };

  if (addressesLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('Checkout')}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Checkout')}</Text>
      </View>

      <ScrollView style={styles.content}>
        
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#2196F3" />
            <Text style={styles.sectionTitle}>{t('Delivery Address')}</Text>
          </View>
          
          {addressesLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
          ) : addresses.length === 0 ? (
            <View style={styles.noAddressesContainer}>
              <Text style={styles.noAddressesText}>{t('No delivery addresses found. Please add an address from your profile.')}</Text>
            </View>
          ) : (
            <View style={styles.addressesContainer}>
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.addressOption,
                    selectedAddressId === address.id && styles.selectedAddress
                  ]}
                  onPress={() => setSelectedAddressId(address.id)}
                >
                  <View style={styles.radioButton}>
                    {selectedAddressId === address.id && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.addressDetails}>
                    <Text style={[
                      styles.addressText,
                      selectedAddressId === address.id && styles.selectedAddressText
                    ]}>
                      {address.address}
                    </Text>
                    <Text style={[
                      styles.addressSubText,
                      selectedAddressId === address.id && styles.selectedAddressSubText
                    ]}>
                      {address.city}, {address.state}
                    </Text>
                    <Text style={[
                      styles.addressSubText,
                      selectedAddressId === address.id && styles.selectedAddressSubText
                    ]}>
                      {address.street}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Shipping Type */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color="#2196F3" />
            <Text style={styles.sectionTitle}>{t('Shipping Type')}</Text>
          </View>
          
          <View style={styles.shippingOptions}>
            <TouchableOpacity
              style={[
                styles.shippingOption,
                shippingType === 'express' && styles.selectedShipping
              ]}
              onPress={() => setShippingType('express')}
            >
              <View style={styles.radioButton}>
                {shippingType === 'express' && <View style={styles.radioInner} />}
              </View>
              <Text style={[
                styles.shippingText,
                shippingType === 'express' && styles.selectedShippingText
              ]}>
                {t('Express Air Shipping')}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.shippingOption,
                shippingType === 'support' && styles.selectedShipping
              ]}
              onPress={() => setShippingType('support')}
            >
              <View style={styles.radioButton}>
                {shippingType === 'support' && <View style={styles.radioInner} />}
              </View>
              <Text style={[
                styles.shippingText,
                shippingType === 'support' && styles.selectedShippingText
              ]}>
                {t('Contact Support for Shipping')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color="#2196F3" />
            <Text style={styles.sectionTitle}>{t('Order Summary')}</Text>
          </View>
          {cart.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <Image source={{ uri: item.image }} style={styles.orderItemImage} />
              <View style={styles.orderItemDetails}>
                <Text style={styles.orderItemName}>{item.name}</Text>
                <Text style={styles.orderItemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.orderItemPrice}>
                ${(item.price * (item.quantity || 1)).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={styles.orderSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('Subtotal')}</Text>
              <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {t('Shipping')}
                {shippingTax && shippingTax.shippingPrice > 0 && (
                  <Text style={{ fontSize: 12, color: '#666' }}>
                    {` (${shippingTax.shippingPrice.toFixed(1)}% - ${shippingTax.userType === 0 ? 'By Weight' : 'By Volume'})`}
                  </Text>
                )}
              </Text>
              <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {t('Commission')}
                {commition && commition.commissionRate > 0 && (
                  <Text style={{ fontSize: 12, color: '#666' }}>
                    {` (${(commition.commissionRate * 100).toFixed(1)}%)`}
                  </Text>
                )}
              </Text>
              <Text style={styles.summaryValue}>
                ${commission.toFixed(2)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{t('Total')}</Text>
              <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
          <View style={styles.footer}>
            {!canPlaceOrder && addresses.length > 0 && (
              <Text style={styles.warningText}>
                {t('Please select a delivery address to continue')}
              </Text>
            )}
            {addresses.length === 0 && (
              <Text style={styles.warningText}>
                {t('No delivery addresses available. Please add an address from your profile first.')}
              </Text>
            )}
            <TouchableOpacity 
              style={[
                styles.placeOrderButton,
                !canPlaceOrder && styles.placeOrderButtonDisabled
              ]}
              onPress={handlePlaceOrder}
              disabled={!canPlaceOrder}
            >
              <Text style={styles.placeOrderText}>{t('Place Order')}</Text>
            </TouchableOpacity>
          </View>
     
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
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  form: {
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  paymentOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    gap: 8,
  },
  selectedPayment: {
      backgroundColor: 'rgba(54,199,246,1.00)',
    borderColor: 'rgba(54,199,246,1.00)',
  },
  paymentText: {
    fontSize: 16,
    color: '#666',
  },
  selectedPaymentText: {
    color: '#fff',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  orderItemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderItemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(54,199,246,1.00)',
  },
  orderSummary: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(54,199,246,1.00)',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  placeOrderButton: {
    backgroundColor: 'rgba(54,199,246,1.00)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  placeOrderButtonDisabled: {
    opacity: 0.7,
  },
  shippingOptions: {
    gap: 12,
  },
  shippingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectedShipping: {
    borderColor: '#36c7f6',
    backgroundColor: '#f8fbff',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#36c7f6',
  },
  shippingText: {
    fontSize: 16,
    color: '#333',
  },
  selectedShippingText: {
    color: '#36c7f6',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  noAddressesContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noAddressesText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  addressesContainer: {
    gap: 12,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectedAddress: {
    borderColor: '#36c7f6',
    backgroundColor: '#f8fbff',
  },
  addressDetails: {
    flex: 1,
    marginLeft: 12,
  },
  addressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  selectedAddressText: {
    color: '#36c7f6',
    fontWeight: '600',
  },
  addressSubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectedAddressSubText: {
    color: '#36c7f6',
  },
  warningText: {
    color: '#f0ad4e', // Warning color
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
}); 