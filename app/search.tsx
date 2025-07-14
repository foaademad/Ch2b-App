import { useLanguage } from '@/src/context/LanguageContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Filter, Search, X } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList, Image, Modal, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Shadows } from '../constants/Shadows';
import { RootState } from '../src/store/store';
import { ProductDto } from '../src/store/utility/interfaces/productInterface';
import { searchByText, searchImage } from '../src/store/api/imageSearchApi';

interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  brands: string[];
  categories: string[];
}

const SearchScreen = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();
  const imageFile = params.imageFile as any; // assuming imageFile passed via router

  const { imageSearchResults, searchTextResults } = useSelector((state: RootState) => state.imageSearch);

  const [searchText, setSearchText] = useState('');
  const [filteredResults, setFilteredResults] = useState<ProductDto[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    priceRange: { min: 0, max: 10000 },
    brands: [],
    categories: [],
  });

  const searchResults = imageFile ? imageSearchResults : searchTextResults;

  useEffect(() => {
    if (imageFile) {
      dispatch(searchImage({ file: imageFile, page: 1 }) as any);
    }
  }, [imageFile]);

  useEffect(() => {
    if (!imageFile && searchText.trim()) {
      dispatch(searchByText({
        title: searchText,
        page: 1,
        language,
      }) as any);
    }
  }, [searchText]);

  useEffect(() => {
    applyFilters(searchResults, activeFilters);
  }, [searchResults, activeFilters]);

  const applyFilters = (products: ProductDto[], filters: FilterOptions) => {
    let filtered = products;
    filtered = filtered.filter(product => {
      const price = product.price?.convertedPriceList?.internal?.price || 0;
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product =>
        product.brandName && filters.brands.includes(product.brandName)
      );
    }
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product =>
        product.categoryId && filters.categories.includes(product.categoryId.toString())
      );
    }
    setFilteredResults(filtered);
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...activeFilters, ...newFilters };
    setActiveFilters(updatedFilters);
  };

  const renderProduct = ({ item }: { item: ProductDto }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.85}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.mainPictureUrl }} style={styles.productImage} resizeMode="cover" />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productBrand}>{item.brandName}</Text>
        <Text style={styles.productPrice}>
          {item.price?.convertedPriceList?.internal?.sign} {item.price?.convertedPriceList?.internal?.price}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t("searchProducts")}
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={!imageFile}
          />
        </View>
      </View>

      <FlatList
        data={filteredResults}
        renderItem={renderProduct}
        keyExtractor={(item) => `search-${item.id}`}
        contentContainerStyle={styles.resultsContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('No products found')}</Text>
            <Text style={styles.emptySubText}>{t('Try different keywords or adjust your filters')}</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  searchContainer: { padding: 16, backgroundColor: '#fff' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5',
    borderRadius: 25, paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: '#e0e0e0',
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  resultsContainer: { padding: 16 },
  productCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', ...Shadows.card,
  },
  productImage: {
    width: 80, height: 80, borderRadius: 8, backgroundColor: '#f4f4f4', marginRight: 12,
  },
  productInfo: { flex: 1 },
  productTitle: {
    fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4,
  },
  productBrand: { fontSize: 14, color: '#666', marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#36c7f6' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#999', textAlign: 'center' },
});

export default SearchScreen;
