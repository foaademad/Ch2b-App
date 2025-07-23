import { useLanguage } from '@/src/context/LanguageContext';
import { getCartItems, removeFromCart, updateCartItem } from '@/src/store/api/cartApi';
import { setCartItems } from '@/src/store/slice/cartSlice';
import { RootState } from '@/src/store/store';
import { useRouter } from 'expo-router';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Shadows } from '../../constants/Shadows';

const CartScreen = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const router = useRouter();
  const dispatch = useDispatch();
  const { items: cart, isLoading } = useSelector((state: RootState) => state.cart);
  const userId = useSelector((state: RootState) => state.auth.authModel?.result?.userId);
  const [cartRequested, setCartRequested] = React.useState(false);

  useEffect(() => {
    if (userId && cart.length === 0 && !isLoading && !cartRequested) {
      setCartRequested(true);
      dispatch(getCartItems() as any);
    }
  }, [dispatch, userId, cart.length, isLoading, cartRequested]);

  const total = cart.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

  const handleQuantityChange = (itemIndex: number, change: number) => {
    const item = cart[itemIndex];
    if (item && userId) {
      const newQuantity = Math.max(1, (item.quntity || 1) + change);
      
      // If item has an id from backend, update via API
      if (item.id) {
        dispatch(updateCartItem(userId, item.id.toString(), newQuantity, item) as any);
      } else {
        // For newly added items without backend id, update local state only
        const updatedItem = { 
          ...item, 
          quntity: newQuantity,
          totalPrice: (item.price || 0) * newQuantity
        };
        
        // Update local cart state
        const updatedCart = [...cart];
        updatedCart[itemIndex] = updatedItem;
        dispatch(setCartItems(updatedCart));
      }
    }
  };

  const handleProductPress = (productId: string, originalProductId?: string) => {
    // Use originalProductId if available, otherwise extract from productId
    let targetProductId = originalProductId || productId;
    
    // If no originalProductId provided, try to extract it from productId
    if (!originalProductId) {

      const colonIndex = productId.indexOf(':');
      if (colonIndex !== -1) {

        const substring = productId.substring(0, colonIndex);
        const lastDashIndex = substring.lastIndexOf('-');
        if (lastDashIndex !== -1) {
          targetProductId = productId.substring(0, lastDashIndex);
        }
      }
    }
    
    // Ensure we have a valid product ID before navigation
    if (targetProductId && targetProductId.trim() !== '') {
      console.log(`Navigating from cart to product: ${targetProductId}`);
      router.push(`/product/${targetProductId}`);
    } else {
      console.error(`Invalid product ID: ${targetProductId} from ${productId}`);
    }
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      router.push('/checkout');
    }
  };

  const handleRemoveFromCart = (itemIndex: number) => {
    const item = cart[itemIndex];
    if (userId && item) {
      if (item.id) {
        // If item has backend id, remove via API
        dispatch(removeFromCart(userId, item.id.toString()) as any);
      } else {
        // For newly added items without backend id, remove from local state only
        const updatedCart = cart.filter((_, idx) => idx !== itemIndex);
        dispatch(setCartItems(updatedCart));
      }
    }
  };

  return (
    <View style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('cart.title')}</Text>
        <Text style={styles.itemCount}>{cart.length} {t('cart.items')}</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>{t('common.loading')}</Text>
        </View>
      ) : cart.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <ShoppingCart size={70} color="#ccc" style={styles.emptyCartIcon} />
          <Text style={styles.emptyCartText}>{t('cart.empty_cart')}</Text>
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.shopNowButtonText}>{t('cart.shop_now')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content}>
          {cart.map((item, index) => (
            <TouchableOpacity 
              key={`cart-item-${item.productId}-${index}`} 
              style={styles.cartItem}
              onPress={() => handleProductPress(item.productId || '', (item as any).originalProductId)}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.title}</Text>
                <Text style={styles.itemPrice}>${(item.totalPrice || 0).toFixed(2)}</Text>
                
                {/* Configurators */}
                {(item as any).configuratorsInfo && (
                  <View style={styles.configuratorsContainer}>
                    <Text style={styles.configuratorsTitle}>{t('product.configuration')}:</Text>
                    {JSON.parse((item as any).configuratorsInfo).map((config: any, idx: number) => (
                      <Text key={idx} style={styles.configuratorText}>
                        {config.pid}: {config.vid}
                      </Text>
                    ))}
                  </View>
                )}  

                {/* Physical Parameters */}
                {item.physicalParametersJson && (
                  ((item.physicalParametersJson.weight || 0) > 0 || 
                   (item.physicalParametersJson.height || 0) > 0 || 
                   (item.physicalParametersJson.width || 0) > 0)
                ) && (
                  <View style={styles.physicalParamsContainer}>
                    <Text style={styles.physicalParamsTitle}>{t('product.physical_parameters')}:</Text>
                    {item.physicalParametersJson.weight && item.physicalParametersJson.weight > 0 && (
                      <Text style={styles.physicalParamText}>
                        {t('product.weight')}: {item.physicalParametersJson.weight}
                      </Text>
                    )}
                    {item.physicalParametersJson.height && item.physicalParametersJson.height > 0 && (
                      <Text style={styles.physicalParamText}>
                        {t('product.height')}: {item.physicalParametersJson.height}
                      </Text>
                    )}
                    {item.physicalParametersJson.width && item.physicalParametersJson.width > 0 && (
                      <Text style={styles.physicalParamText}>
                        {t('product.width')}: {item.physicalParametersJson.width}
                      </Text>
                    )}
                  </View>
                )}
                
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(index, -1);
                    }}
                  >
                    <Minus size={16} color="#666" />
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quntity || 1}</Text>
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(index, 1);
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
                  handleRemoveFromCart(index);
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
          <Text style={styles.totalLabel}>{t('cart.total')}</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.checkoutButton, cart.length === 0 && styles.disabledButton]} 
          onPress={handleCheckout}
          disabled={cart.length === 0}
        >
          <Text style={styles.checkoutButtonText}>{t('cart.proceed_to_checkout')}</Text>
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
    padding: 16,
    marginBottom: 12,
    ...Shadows.medium,
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
  physicalParamsContainer: {
    backgroundColor: '#f8fafd',
    borderRadius: 8,
    padding: 8,
    marginVertical: 6,
  },
  physicalParamsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  physicalParamText: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  configuratorsContainer: {
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    padding: 8,
    marginVertical: 6,
  },
  configuratorsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#36c7f6',
    marginBottom: 4,
  },
  configuratorText: {
    fontSize: 11,
    color: '#333',
    marginBottom: 2,
    fontWeight: '600',
  },
});