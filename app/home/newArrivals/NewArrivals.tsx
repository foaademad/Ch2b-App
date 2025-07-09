import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../../src/store/api/productApi';
import { AppDispatch, RootState } from '../../../src/store/store';
import { ProductDto } from '../../../src/store/utility/interfaces/productInterface';
import ProductCard from '../../../components/products/ProductCard';

const PAGE_SIZE = 10;

export default function NewArrivals() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { productsNew, loading } = useSelector((state: RootState) => state.product);
  const [visibleProducts, setVisibleProducts] = useState<ProductDto[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    setVisibleProducts(productsNew.slice(0, PAGE_SIZE * page));
  }, [productsNew, page]);

  const handleLoadMore = () => {
    if (visibleProducts.length < productsNew.length) {
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
      <Text style={styles.title}>New Arrivals</Text>
      {loading && visibleProducts.length === 0 ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', minHeight: 120 }}>
          <ActivityIndicator size="large" color="#36c7f6" />
        </View>
      ) : (
        <FlatList
          data={visibleProducts}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && visibleProducts.length < productsNew.length ? (
              <ActivityIndicator size="small" color="#36c7f6" />
            ) : null
          }
        />
      )}
    </View>
  );
}

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