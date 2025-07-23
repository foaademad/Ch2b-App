
import { useLanguage } from '@/src/context/LanguageContext';
import { getWishlist, removeFromSallerWishlistApi, removeFromWishlistApi } from '@/src/store/api/wishlistApi';
import { RootState } from '@/src/store/store';
import { useRouter } from 'expo-router';
import { Heart, Store } from 'lucide-react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Shadows } from '../../constants/Shadows';

const WishlistScreen = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const dispatch = useDispatch();
  const router = useRouter();
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




  const renderFavoriteItems = () => (
    <ScrollView style={styles.content}>
      {favoriteItems.map((item) => (
        <TouchableOpacity 
          key={item.id} 
          style={styles.wishlistItem}
          onPress={() => router.push(`/product/${item.productId || item.id}`)}
        >
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text style={styles.itemName}>{item.title}</Text>
            <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★ {item.vendorRating}</Text>
              <Text style={styles.reviews}>({item.vendorRating} {t('wishlist.reviews')})</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.actionButton, styles.removeButton]}
            onPress={async (e) => {
              e.stopPropagation(); // منع تشغيل navigation عند الضغط على زر الحذف
              console.log("Remove from wishlist:", item.id);
              await dispatch(removeFromWishlistApi(item.id.toString()) as any);
              dispatch(getWishlist() as any);
            }}
          >
            <Heart size={20} color="#ff3b30" fill="#ff3b30" />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}

      {favoriteItems.length === 0 && (
        <View style={styles.emptyState}>
          <Heart size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>{t('wishlist.empty_wishlist')}</Text>
          <Text style={styles.emptyStateSubtext}>
            {t('wishlist.add_items_to_wishlist')}
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
                <Text style={styles.reviews}>({seller.deliveryScore} {t('wishlist.reviews')})</Text>
              </View>
              <Text style={styles.productsCount}>{seller.deliveryScore} {t('wishlist.products')}</Text> 
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
          <Text style={styles.emptyStateText}>{t('wishlist.no_favorite_sellers')}</Text>
          <Text style={styles.emptyStateSubtext}>
            {t('wishlist.add_sellers_to_favorites')}
          </Text>
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('wishlist.favorites')}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'items' && styles.activeTab]}
          onPress={() => setActiveTab('items')}
        >
          <View style={styles.tabContent}>
            <Text style={[styles.tabText, activeTab === 'items' && styles.activeTabText]}>
              {t('wishlist.favorite_items')}
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
              {t('wishlist.favorite_sellers')}
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

  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
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

});

export default WishlistScreen; 