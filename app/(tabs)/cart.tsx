import { getCartItems, removeFromCart, updateCartItem } from '@/src/store/api/cartApi';
import { RootState } from '@/src/store/store';
import { useRouter } from 'expo-router';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const CartScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const { items: cart, isLoading } = useSelector((state: RootState) => state.cart);
  const userId = useSelector((state: RootState) => state.auth.authModel?.result?.userId);

  useEffect(() => {
    try{
      if (userId) {
        dispatch(getCartItems() as any);
      }
    }catch(error){
      console.log("error", error);
    }
  }, [dispatch, userId]);

  const total = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  const handleQuantityChange = (itemId: number, change: number) => {
    const item = cart.find(i => i.id === itemId);
    if (item && userId) {
      const newQuantity = Math.max(1, (item.quntity || 1) + change);
      dispatch(updateCartItem(userId, itemId.toString(), newQuantity, item) as any);
    }
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      router.push('/checkout');
    }
  };

  const handleRemoveFromCart = (id: number) => {
    if (userId) {
      dispatch(removeFromCart(userId, id.toString()) as any);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Shopping Cart')}</Text>
        <Text style={styles.itemCount}>{cart.length} {t('items')}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <ShoppingCart size={70} color="#ccc" style={styles.emptyCartIcon} />
          <Text style={styles.emptyCartText}>No products in your cart</Text>
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.shopNowButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {cart.map((item, index) => (
            <TouchableOpacity 
              key={`cart-item-${item.productId}-${index}`} 
              style={styles.cartItem}
              onPress={() => handleProductPress(item.productId || '')}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.itemPrice}>${(item.totalPrice || 0).toFixed(2)}</Text>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(item.id || 0, -1);
                    }}
                  >
                    <Minus size={16} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quntity || 1}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(item.id || 0, 1);
                    }}
                  >
                    <Plus size={16} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.removeButton}
                onPress={(e) => {
                  e.stopPropagation();
                    handleRemoveFromCart(item.id || 0 );
                }}
              >
                <Trash2 size={20} color="#ff3b30" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>{t('Total')}</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.checkoutButton, cart.length === 0 && styles.disabledButton]} 
          onPress={handleCheckout}
          disabled={cart.length === 0}
        >
          <Text style={styles.checkoutButtonText}>{t('Proceed to Checkout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#36c7f6',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 12,
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#36c7f6',
  },
  checkoutButton: {
    backgroundColor: '#36c7f6',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartIcon: {
    marginBottom: 16,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  shopNowButton: {
    backgroundColor: '#36c7f6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  shopNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});