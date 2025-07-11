import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { addToWishlistApi } from '../../src/store/api/wishlistApi';
import { ProductDto } from '../../src/store/utility/interfaces/productInterface';
interface ProductCardProps {
  product: ProductDto;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const rating = Number(product.featuredValues?.find(value => value.name === 'rating')?.value) || 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const starsArray = Array(fullStars).fill('★');
  const dispatch = useDispatch();
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
          onPress={e => {
            e.stopPropagation();
            
            dispatch(addToWishlistApi(product) as any);
          }}
        >
           <Ionicons name={'heart-outline'} size={22} color={'#888'} />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.title || product.name }</Text>
        <Text style={styles.weight}>⚖ {product.physicalParameters?.weight ?? '-'} kg</Text>
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
            <Text style={styles.rating}>No ratings yet</Text>
          )}
        </View>
        <Text style={styles.productPrice}>
          {product.price?.convertedPriceList?.internal?.sign} {product.price?.convertedPriceList?.internal?.price}
        </Text>
        <Text style={styles.usdPrice}>
          ${product.price?.convertedPriceList?.displayedMoneys?.[0]?.price ?? '-'} USD
        </Text>
        <Text style={styles.quantity}>{product.masterQuantity} left</Text>
        <View style={styles.vendorRow}>
          {/* <Text style={styles.vendor}>{product.vendorDisplayName.split(' ').slice(0, 7).join("...........") || product.vendorName.slice(0, 7).join("...........")}</Text> */}
          <Text style={styles.vendor}>
            {(product.vendorDisplayName || product.vendorName || '').slice(0, 13)}
            {((product.vendorDisplayName || product.vendorName || '').length > 13) ? '...' : ''}
          </Text>
          {product.isSellAllowed ? (
            <Text style={styles.verified}>✔ Verified</Text>
          ) : (
            <Text style={[styles.verified, { color: 'gray' } ]}>Not Verified</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: 175,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 4,
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