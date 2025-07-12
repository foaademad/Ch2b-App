import { useRouter } from 'expo-router';
import { ArrowLeft, CreditCard, MapPin, Package } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { RootState } from '../src/store/store';

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  
  // استخدام Redux مباشرة بدلاً من ShopContext
  const cartItems = useSelector((state: RootState) => state.cart.items);
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

  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const shipping = 10;
  const tax = total * 0.1; // 10% tax
  const finalTotal = total + shipping + tax;

  const handlePlaceOrder = async () => {
    try {
      // 1. Validate inputs
      if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || 
          !shippingInfo.state || !shippingInfo.zipCode || !shippingInfo.phone) {
        Toast.show({
          type: 'error',
          text1: t('Error'),
          text2: t('Please fill in all shipping information'),
          position: 'top',
        });
        return;
      }

      if (paymentMethod === 'credit' && (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvv)) {
        Toast.show({
          type: 'error',
          text1: t('Error'),
          text2: t('Please fill in all card details'),
          position: 'top',
        });
        return;
      }

      // 2. Show loading state
      setIsLoading(true);

      // 3. Process payment
      let paymentSuccess = false;
      if (paymentMethod === 'credit') {
        // Simulate credit card processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        paymentSuccess = true; // In real app, this would be the result from payment gateway
      } else {
        // PayPal would handle its own flow
        paymentSuccess = true;
      }

      if (!paymentSuccess) {
        throw new Error('Payment failed');
      }

      // 4. Create order
      const order: any = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'Processing',
        shippingInfo,
        paymentMethod: paymentMethod as 'credit' | 'paypal',
        paymentStatus: 'Paid'
      };

      // 5. Add to order history
      addToOrderHistory(order);

      // 6. Clear cart
      clearCart();

      // 7. Show success message
      Toast.show({
        type: 'success',
        text1: t('Success'),
        text2: t('Your order has been placed successfully!'),
        position: 'top',
        onPress: () => {
        },
      });
      router.replace('/orders' as any);

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('Error'),
        text2: t('There was a problem processing your order. Please try again.'),
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('Checkout')}</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Shipping Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color="#2196F3" />
            <Text style={styles.sectionTitle}>{t('Shipping Information')}</Text>
          </View>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder={t('Full Name')}
              value={shippingInfo.fullName}
              onChangeText={(text) => setShippingInfo(prev => ({ ...prev, fullName: text }))}
            />
            <TextInput
              style={styles.input}
              placeholder={t('Address')}
              value={shippingInfo.address}
              onChangeText={(text) => setShippingInfo(prev => ({ ...prev, address: text }))}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder={t('City')}
                value={shippingInfo.city}
                onChangeText={(text) => setShippingInfo(prev => ({ ...prev, city: text }))}
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder={t('State')}
                value={shippingInfo.state}
                onChangeText={(text) => setShippingInfo(prev => ({ ...prev, state: text }))}
              />
            </View>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder={t('ZIP Code')}
                value={shippingInfo.zipCode}
                onChangeText={(text) => setShippingInfo(prev => ({ ...prev, zipCode: text }))}
                keyboardType="numeric"
              />
              <TextInput
                style={[styles.input, styles.halfInput]}
                placeholder={t('Phone')}
                value={shippingInfo.phone}
                onChangeText={(text) => setShippingInfo(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color="#2196F3" />
            <Text style={styles.sectionTitle}>{t('Payment Method')}</Text>
          </View>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'credit' && styles.selectedPayment]}
              onPress={() => setPaymentMethod('credit')}
            >
              <CreditCard size={20} color={paymentMethod === 'credit' ? '#fff' : '#666'} />
              <Text style={[styles.paymentText, paymentMethod === 'credit' && styles.selectedPaymentText]}>
                {t('Credit Card')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'paypal' && styles.selectedPayment]}
              onPress={() => setPaymentMethod('paypal')}
            >
              <Text style={[styles.paymentText, paymentMethod === 'paypal' && styles.selectedPaymentText]}>
                PayPal
              </Text>
            </TouchableOpacity>
          </View>
          {paymentMethod === 'credit' && (
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder={t('Card Number')}
                value={cardInfo.cardNumber}
                onChangeText={(text) => setCardInfo(prev => ({ ...prev, cardNumber: text }))}
                keyboardType="numeric"
              />
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder={t('MM/YY')}
                  value={cardInfo.expiryDate}
                  onChangeText={(text) => setCardInfo(prev => ({ ...prev, expiryDate: text }))}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder={t('CVV')}
                  value={cardInfo.cvv}
                  onChangeText={(text) => setCardInfo(prev => ({ ...prev, cvv: text }))}
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}
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
              <Text style={styles.summaryLabel}>{t('Tax')}</Text>
              <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{t('Total')}</Text>
              <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.placeOrderButton, isLoading && styles.placeOrderButtonDisabled]} 
          onPress={handlePlaceOrder}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>{t('Place Order')}</Text>
          )}
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
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
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
    color: '#2196F3',
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
    color: '#2196F3',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  placeOrderButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
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
}); 