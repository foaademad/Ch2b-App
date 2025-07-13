
import { getWishlist, removeFromSallerWishlistApi, removeFromWishlistApi } from '@/src/store/api/wishlistApi';
import { RootState } from '@/src/store/store';
import { Heart, Store } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { Shadows } from '../../constants/Shadows';
import { addToCart } from '../../src/store/api/cartApi';
const WishlistScreen = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'sellers'
  const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);
  console.log("wishlist from Redux:", wishlist);
  const userId = useSelector((state: RootState) => state.auth.authModel?.result?.userId);
  console.log("Current userId:", userId);
  // استخراج العناصر المفضلة من البيانات
  const favoriteItems = wishlist.length > 0 && wishlist[0]?.favoriteItems 
    ? wishlist[0].favoriteItems 
    : [];
    const favoriteSallers = wishlist.length > 0 && wishlist[0]?.favoriteSallers 
    ? wishlist[0].favoriteSallers 
    : [];
  
  console.log("favoriteItems extracted:", favoriteItems);
  // Sample favorite sellers data (you should replace this with your actual data)
  const favoriteSellers = [
    {
      id: '1',
      name: 'Premium Store',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmV8ZW58MHx8MHx8fDA%3D',
      rating: 4.8,
      reviews: 245,
      products: 156,
    },
    {
      id: '2',
      name: 'Fashion Hub',
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D',
      rating: 4.6,
      reviews: 189,
      products: 98,
    },
    {
      id: '3',
      name: 'Tech Zone',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18e2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D',
      rating: 4.9,
      reviews: 320,
      products: 210,
    },
  ];

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const changeQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const renderFavoriteItems = () => (
    <ScrollView style={styles.content}>
      {favoriteItems.map((item) => (
        <View key={item.id} style={styles.wishlistItem}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.title}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★ {item.vendorRating}</Text>
              <Text style={styles.reviews}>({item.vendorRating} {t('reviews')})</Text>
            </View>
            <View>  
            {/* أزرار الكمية */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <TouchableOpacity onPress={() => changeQuantity(item.id.toString(), -1)} style={styles.qtyButton}>
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 10 }}>{quantities[item.id] || 1}</Text>
              <TouchableOpacity onPress={() => changeQuantity(item.id.toString(), 1)} style={styles.qtyButton}>
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
              
            </View>
            <View>
            <TouchableOpacity 
              style={[styles.addToCartButton]}
              onPress={async () => {
                const quantity = quantities[item.id] || 1;
                const cartItem = {
                  productId: (item.productId || item.id).toString(),
                  name: item.name,
                  title: item.title,
                  image: (item.image || "").slice(0, 1000),
                  LinkUrl: (item.image || "").slice(0, 1000),
                  Quntity: quantity,
                  price: item.price,
                  totalPrice: (item.price || 0) * quantity,
                };
                try {
                  await dispatch(addToCart(userId || "", cartItem) as any);
                } catch (error: any) {
                  Toast.show({
                    type: "error",
                    text1: "This card is already in the cart"
                  });
                  console.error(error);
                }
              }}
            >
              <Text style={styles.addToCartButtonText}>Add to cart</Text>
            </TouchableOpacity>
            </View>
            </View>
          </View>
          <View style={styles.actionButtons}>
           
            <TouchableOpacity 
              style={[styles.actionButton, styles.removeButton]}
              onPress={async () => {
                console.log("Remove from wishlist:", item.id);
                await dispatch(removeFromWishlistApi(item.id.toString()) as any);
                dispatch(getWishlist() as any);
              }}
            >
              <Heart size={20} color="#ff3b30" fill="#ff3b30" />
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {favoriteItems.length === 0 && (
        <View style={styles.emptyState}>
          <Heart size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>{t('Your wishlist is empty')}</Text>
          <Text style={styles.emptyStateSubtext}>
            {t('Add items to your wishlist to see them here')}
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderFavoriteSellers = () => (
    <ScrollView style={styles.content}>
      {favoriteSallers.map((seller) => {
        const isFavorite = favoriteSallers.some(s => s.vendorId === seller.vendorId);
        return (
          <View key={seller.id} style={styles.sellerItem}>
            <Image source={{ uri: seller.displayPictureUrl }} style={styles.sellerImage} />
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>{seller.name}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>★ {seller.deliveryScore}</Text>
                <Text style={styles.reviews}>({seller.deliveryScore} {t('reviews')})</Text>
              </View>
              <Text style={styles.productsCount}>{seller.deliveryScore} {t('products')}</Text> 
            </View>
            <TouchableOpacity 
              style={[styles.actionButton, styles.removeButton]}
              onPress={async () => {
                await dispatch(removeFromSallerWishlistApi(seller.id.toString()) as any);
                dispatch(getWishlist() as any);
              }}
            >
              <Heart size={20} color={isFavorite ? "#ff3b30" : "#888"} fill={isFavorite ? "#ff3b30" : "none"} />
            </TouchableOpacity>
          </View>
        );
      })}

      {favoriteSallers.length === 0 && (
        <View style={styles.emptyState}>
          <Store size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>{t('No favorite sellers')}</Text>
          <Text style={styles.emptyStateSubtext}>
            {t('Add sellers to your favorites to see them here')}
          </Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('Favorites')}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'items' && styles.activeTab]}
          onPress={() => setActiveTab('items')}
        >
          <View style={styles.tabContent}>
            <Text style={[styles.tabText, activeTab === 'items' && styles.activeTabText]}>
              {t('Favorite Items')}
            </Text>
            <View style={[styles.countBadge, activeTab === 'items' && styles.activeCountBadge]}>
              <Text style={[styles.countText, activeTab === 'items' && styles.activeCountText]}>
                {favoriteItems.length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sellers' && styles.activeTab]}
          onPress={() => setActiveTab('sellers')}
        >
          <View style={styles.tabContent}>
            <Text style={[styles.tabText, activeTab === 'sellers' && styles.activeTabText]}>
              {t('Favorite Sellers')}
            </Text>
            <View style={[styles.countBadge, activeTab === 'sellers' && styles.activeCountBadge]}>
              <Text style={[styles.countText, activeTab === 'sellers' && styles.activeCountText]}>
                {favoriteSallers.length}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'items' ? renderFavoriteItems() : renderFavoriteSellers()}
    </View>
  );
};

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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#36c7f6',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#36c7f6',
    fontWeight: '600',
  },
  countBadge: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  activeCountBadge: {
    backgroundColor: '#e6f7ff',
  },
  countText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  activeCountText: {
    color: '#36c7f6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  wishlistItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    position:'relative',
    ...Shadows.medium,
  },
  sellerItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    position:'relative',
    padding: 12,
    marginBottom: 12,
    ...Shadows.medium,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  sellerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  sellerDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#36c7f6',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffb800',
    marginRight: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#666',
  },
  productsCount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    justifyContent: 'space-between',
    paddingLeft: 12,
    
    
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: '#36c7f6',
    borderRadius: 16,
    padding: 4,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    ...Shadows.small,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
   
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 4,

    ...Shadows.small,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  qtyButtonText: {
    fontSize: 20,
    color: '#36c7f6',
    fontWeight: 'bold',
  },
});

export default WishlistScreen; 