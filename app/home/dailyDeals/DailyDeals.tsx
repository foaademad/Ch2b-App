import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProductCard from '../../../components/products/ProductCard';
import api from '../../../src/store/utility/api/api';
import { ProductDto } from '../../../src/store/utility/interfaces/productInterface';

const CATEGORY_IDS = [
  'otc-49',
  'otc-50',
  'abb-10048',
  'otc-51',
  'abb-10054',
  'abb-1031607',
  'abb-1031633',
  'abb-1033898',
  'abb-124022010',
  'abb-1336',
  'abb-201301601',
  'abb-10112',
  'abb-1045423',
  'abb-345',
  'abb-10054',
  'abb-1031607',
  'abb-1031633',
  'abb-1033898', 
  'abb-1336',
  'abb-201301601',
  'abb-10112',
  'abb-1045423',
  'abb-345',
  'abb-1008',


];
const PAGE_SIZE = 20;

function shuffleArray<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function DailyDeals({ onProductsChange }: { onProductsChange?: (products: ProductDto[]) => void }) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [categoryPages, setCategoryPages] = useState<{ [catId: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب المنتجات للصفحات الحالية لكل كاتيجوري
  const fetchProducts = async (pages: { [catId: string]: number }, append = false) => {
    setError(null);
    try {
      setLoadingMore(!loading);
      setLoading(loading);
      const allResults: ProductDto[] = [];
      let anyHasMore = false;
      await Promise.all(
        CATEGORY_IDS.map(async (categoryId) => {
          const page = pages[categoryId] || 1;
          const response = await api.get(`/Product/getalltocatgeory?categoryId=${categoryId}&page=${page}&pageSize=${PAGE_SIZE}`);
          let newProducts: ProductDto[] = [];
          if (response && response.data && response.data.result) {
            if (Array.isArray(response.data.result)) {
              newProducts = response.data.result;
            } else {
              newProducts = response.data.result.products || [];
            }
          }
          if (newProducts.length === PAGE_SIZE) {
            anyHasMore = true;
          }
          allResults.push(...newProducts);
        })
      );
      setProducts(prev => {
        const merged = append ? [...prev, ...allResults] : allResults;
        if (onProductsChange) onProductsChange(merged); // تمرير المنتجات للأب
        return shuffleArray(merged);
      });
      setHasMore(anyHasMore);
    } catch (err: any) {
      setError(err?.message || 'Error loading products');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // أول تحميل
  useEffect(() => {
    const initialPages: { [catId: string]: number } = {};
    CATEGORY_IDS.forEach(id => { initialPages[id] = 1; });
    setCategoryPages(initialPages);
    setLoading(true);
    fetchProducts(initialPages, false);
  }, []);

  // زر تحميل المزيد
  const handleLoadMore = () => {
    const nextPages = { ...categoryPages };
    CATEGORY_IDS.forEach(id => { nextPages[id] = (nextPages[id] || 1) + 1; });
    setCategoryPages(nextPages);
    setLoadingMore(true);
    fetchProducts(nextPages, true);
  };

  const handleProductPress = (product: ProductDto) => {
    router.push(`/product/${product.id}` as any);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Daily Deals</Text>
      {loading && (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="large" color="#36c7f6" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      )}
      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={18} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <View style={styles.productsGrid}>
        {products.map((product, index) => (
          <View key={`${product.id}-${product.categoryId || ''}-${index}`} style={styles.productWrapper}>
            <ProductCard product={product} onPress={() => handleProductPress(product)} />
          </View>
        ))}
      </View>
      {hasMore && !loading && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore} disabled={loadingMore}>
          {loadingMore ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loadMoreText}>Load More</Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 15,
    color: '#222',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingLeft: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingLeft: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    marginLeft: 8,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
   
    paddingBottom: 8,
    paddingLeft: 10,
  },
  productWrapper: {
   
    marginBottom: 14,
  },
  loadMoreButton: {
    backgroundColor: '#36c7f6',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 20,
    alignSelf: 'center',
    minWidth: 160,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    fontWeight: 'bold',
  },
});
