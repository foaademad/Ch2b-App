import { Ionicons } from '@expo/vector-icons';
import { Heart } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Shadows } from '../../constants/Shadows';
import { useLanguage } from '../../src/context/LanguageContext';
import { addToWishlistApi, getWishlist } from '../../src/store/api/wishlistApi';
import { RootState } from '../../src/store/store';
import { ProductDto } from '../../src/store/utility/interfaces/productInterface';

interface ProductCardProps {
  product: ProductDto;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const rating = Number(product.featuredValues?.find(value => value.name === 'rating')?.value) || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  // const starsArray = Array(fullStars).fill('★');
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);
  const isFavorite = wishlist.some(
    (fav) =>
      fav.favoriteItems &&
      fav.favoriteItems.some((item) => item.productId === product.id)
  );
  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.mainPictureUrl || product.pictures?.[0]?.url || 'https://via.placeholder.com/150x150?text=No+Image' }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favIcon}
          onPress={async e => {
            e.stopPropagation();
            await dispatch(addToWishlistApi(product) as any);
            dispatch(getWishlist() as any);
          }}
        >
          <Heart
            size={24}
            color={isFavorite ? "#ff3b30" : "#888"}
            fill={isFavorite ? "#ff3b30" : "none"}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>{product.title || product.name }</Text>
        <Text style={[styles.weight, { textAlign: isRTL ? 'right' : 'left' }]}>⚖ {product.physicalParameters?.weight ?? '-'} kg</Text>
        <View style={styles.ratingContainer}>
          {rating > 0 ? (
            <>
              {[...Array(fullStars)].map((_, i) => (
                <Ionicons key={i} name="star" size={12} color="#FFD700" />
              ))}
              {hasHalfStar && <Ionicons name="star-half" size={12} color="#FFD700" />}
              <Text style={styles.rating}> {`(${rating})`}</Text>
            </>
          ) : (
            <Text style={[styles.rating, { textAlign: isRTL ? 'right' : 'left' }]}>{t('product.no_ratings')}</Text>
          )}
        </View>
        <Text style={[styles.productPrice, { textAlign: isRTL ? 'right' : 'left' }]}>
          {product.price?.convertedPriceList?.internal?.sign} {product.price?.convertedPriceList?.internal?.price}
        </Text>
        <Text style={[styles.usdPrice, { textAlign: isRTL ? 'right' : 'left' }]}>
          ${product.price?.convertedPriceList?.displayedMoneys?.[0]?.price ?? '-'} USD
        </Text>
        <Text style={[styles.quantity, { textAlign: isRTL ? 'right' : 'left' }]}>{t('product.quantity_left', { quantity: product.masterQuantity })}</Text>
        <View style={[styles.vendorRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {/* <Text style={styles.vendor}>{product.vendorDisplayName.split(' ').slice(0, 7).join("...........") || product.vendorName.slice(0, 7).join("...........")}</Text> */}
          <Text style={[styles.vendor, { textAlign: isRTL ? 'right' : 'left' }]}>
            {(product.vendorDisplayName || product.vendorName || '').slice(0, 13)}
            {((product.vendorDisplayName || product.vendorName || '').length > 13) ? '...' : ''}
          </Text>
          {product.isSellAllowed ? (
            <Text style={[styles.verified, { textAlign: isRTL ? 'right' : 'left' }]}>{t('product.verified')}</Text>
          ) : (
            <Text style={[styles.verified, { color: 'gray', textAlign: isRTL ? 'right' : 'left' }]}>{t('product.not_verified')}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: 165,
    backgroundColor: '#fff',
    borderRadius: 16,
    ...Shadows.medium,
    overflow: 'hidden',
    position: 'relative',
    margin: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#f4f4f4',
  },
  favIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16,
    padding: 4,
    zIndex: 2,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  weight: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  rating: {
    fontSize: 12,
    color: '#FFD700',
    marginRight: 3,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#36c7f6',
    marginBottom: 2,
  },
  usdPrice: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  quantity: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  vendor: {
    fontSize: 12,
    color: '#36c7f6',
    fontWeight: 'bold',
    marginRight: 6,
  },
  verified: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',

  },
});

export default ProductCard;