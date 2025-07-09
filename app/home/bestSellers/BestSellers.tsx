import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../../../components/products/ProductCard';
import { getProducts } from '../../../src/store/api/productApi';
import { AppDispatch, RootState } from '../../../src/store/store';
import { ProductDto } from '../../../src/store/utility/interfaces/productInterface';

const PAGE_SIZE = 10;

const BestSellers = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { productsBest, loading } = useSelector((state: RootState) => state.product);
  const [visibleProducts, setVisibleProducts] = useState<ProductDto[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    setVisibleProducts(productsBest.slice(0, PAGE_SIZE * page));
  }, [productsBest, page]);

  const handleLoadMore = () => {
    if (visibleProducts.length < productsBest.length) {
      setPage((prev) => prev + 1);
    }
  };

  const renderItem = ({ item }: { item: ProductDto }) => (
    <ProductCard 
      product={item} 
      onPress={() => router.push(`/product/${item.id}`)}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Best Sellers</Text>
      {loading && visibleProducts.length === 0 ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
          <ActivityIndicator size="large" color="#36c7f6" />
        </View>
      ) : (
        <FlatList
          data={visibleProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && visibleProducts.length < productsBest.length ? (
              <ActivityIndicator size="small" color="#36c7f6" />
            ) : null
          }
        />
      )}
    </View>
  );
};

export default BestSellers;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 15,
    color: '#222',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
});
