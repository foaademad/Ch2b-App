import { useRouter } from 'expo-router';
import { ArrowLeft, Package } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getCommition } from '../src/store/api/commitionScimaApi';
import { RootState } from '../src/store/store';

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  
  // استخدام Redux مباشرة بدلاً من ShopContext
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { commition, loading: commitionLoading } = useSelector((state: RootState) => state.commition);
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

  useEffect(() => {
    dispatch(getCommition() as any);
  }, [dispatch]);

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

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = 10;
  const commission = calculateCommission();
  const finalTotal = total + shipping + commission;

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Checkout')}</Text>
      </View>

      <ScrollView style={styles.content}>
        
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
              <Text style={styles.summaryLabel}>{t('Shipping')}</Text>
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
            <TouchableOpacity style={styles.placeOrderButton}>
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
}); 