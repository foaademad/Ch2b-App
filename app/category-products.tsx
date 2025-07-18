import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Animated, Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../components/products/ProductCard';
import { Shadows } from '../constants/Shadows';
import { useLanguage } from '../src/context/LanguageContext';
import { getallProductByCategoryId } from '../src/store/api/productApi';
import { RootState } from '../src/store/store';
import { ProductDto } from '../src/store/utility/interfaces/productInterface';

const { width: screenWidth } = Dimensions.get('window');
const ITEM_WIDTH = 175; // عرض كل منتج
const ITEM_MARGIN = 10; // الهامش بين المنتجات
const CONTAINER_PADDING = 20; // padding الحاوية

// حساب عدد الأعمدة بناءً على عرض الشاشة
const calculateNumColumns = () => {
  const width = Dimensions.get('window').width;
  if (width >= 1200) return 6; // تابلت كبير أو ديسكتوب
  if (width >= 900) return 5;  // تابلت landscape
  if (width >= 600) return 4;  // تابلت صغير
  return 2; // موبايل
};

export default function CategoryProductsScreen() {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentCategory, loading, loadingMore, error } = useSelector((state: RootState) => state.product);

  // شريط البحث
  const [search, setSearch] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);
  const [numColumns, setNumColumns] = useState(calculateNumColumns());

  // إعادة حساب عدد الأعمدة عند تغيير حجم الشاشة
  useEffect(() => {
    const updateNumColumns = () => {
      setNumColumns(calculateNumColumns());
    };

    const subscription = Dimensions.addEventListener('change', updateNumColumns);
    // إعادة حساب عند تحميل المكون أيضاً
    updateNumColumns();
    return () => subscription?.remove();
  }, []);

  const filteredProducts = currentCategory?.products?.filter(
    (item) =>
      (item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.brandName?.toLowerCase().includes(search.toLowerCase()))
  ) || [];

  useEffect(() => {
    // إذا لم يكن هناك كاتيجوري محدد، ارجع للصفحة السابقة
    if (!currentCategory) {
      router.back();
    }
  }, [currentCategory, router]);

  const toggleSearch = () => {
    if (isSearchVisible) {
      // إخفاء البحث
      Animated.timing(searchAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsSearchVisible(false);
        setSearch('');
      });
    } else {
      // إظهار البحث
      setIsSearchVisible(true);
      Animated.timing(searchAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        searchInputRef.current?.focus();
      });
    }
  };

  const handleProductPress = (product: ProductDto) => {
    if (product.id) {
      router.push(`/product/${product.id}`);
    }
  };

  const handleLoadMore = () => {
    // تحقق من وجود فئة حالية وأن هناك المزيد من المنتجات وأن التحميل ليس جارياً
    if (currentCategory && currentCategory.hasMore && !loadingMore) {
      const nextPage = (currentCategory.currentPage || 1) + 1;
      const categoryId = currentCategory.categoryId;
      if (categoryId) {
        // استخدام pageSize = 10 للحصول على 10 منتجات في كل مرة
        dispatch(getallProductByCategoryId(categoryId, nextPage, 20, true, currentCategory.name, currentCategory.nameEn) as any);
      }
    }
  };

  // كارد المنتج بنفس تصميم BestSellers
  const renderProduct = ({ item }: { item: ProductDto }) => (
    <ProductCard product={item} onPress={() => handleProductPress(item)} />
  );

  const renderLoadMoreButton = () => {
    // لا تظهر الزر إذا لم يكن هناك المزيد من المنتجات
    if (!currentCategory?.hasMore) return null;
    
    return (
      <View style={styles.loadMoreContainer}>
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
          disabled={loadingMore}
          activeOpacity={0.8}
        >
          {loadingMore ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={{ color: '#fff', fontSize: 14, fontFamily: 'Poppins-Regular', marginLeft: 8 }}>
                {t('category_products.loading_more')}
              </Text>
            </View>
          ) : (
            <Text style={styles.loadMoreText}>{t('category_products.load_more')}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#36c7f6" />
        <Text style={styles.loadingText}>{t('category_products.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {t('category_products.error_loading')}: {typeof error === 'string' ? error : t('common.unknown_error')}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            if (currentCategory) {
              const categoryId = currentCategory.categoryId;
              if (categoryId) {
                dispatch(getallProductByCategoryId(categoryId, 1, 10, false, currentCategory.name, currentCategory.nameEn) as any);
              }
            }
          }}
        >
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentCategory) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{t('category_products.no_category_selected')}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>{t('common.go_back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { direction: isRTL ? 'rtl' : 'ltr' }]}>
      <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={23} color="#36c7f6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentCategory.nameEn || currentCategory.name}
        </Text>
        <TouchableOpacity
          style={styles.searchIconButton}
          onPress={toggleSearch}
        >
          <Ionicons 
            name={isSearchVisible ? "close" : "search"} 
            size={23} 
            color="#36c7f6" 
          />
        </TouchableOpacity>
      </View>
      
      {/* شريط البحث المتحرك */}
      <Animated.View 
        style={[
          styles.searchBarContainer,
          {
            height: searchAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 60],
            }),
            opacity: searchAnimation,
            transform: [{
              translateY: searchAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            }],
          },
        ]}
      >
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#36c7f6" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder={t('category_products.search_placeholder')}
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearch('')}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {filteredProducts.length > 0 ? (
        <FlatList
          key={numColumns}
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={(item, index) => item.id || `product-${index}`}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
          ListFooterComponent={renderLoadMoreButton}
          columnWrapperStyle={styles.productRow}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>
            {search.length > 0 ? t('category_products.no_products_found_search') : t('category_products.no_products_in_category')}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 30,
    // backgroundColor: '#36c7f6',
    color: 'black',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    flex: 1,
    textAlign: 'center',
  },
  searchIconButton: {
    padding: 5,
    width: 34,
    alignItems: 'center',
  },
  placeholder: {
    width: 34,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#2c3e50',
  },
  loadMoreLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreLoadingText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#36c7f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    fontWeight: 'bold',
  },
  productsList: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  loadMoreContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#36c7f6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    ...Shadows.primaryLight,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    fontWeight: 'bold',
  },
  searchBarContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    overflow: 'hidden',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    margin: 10,
    borderRadius: 25,
    ...Shadows.small,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#2c3e50',
  },
  clearButton: {
    padding: 5,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: ITEM_MARGIN,
  },
}); 