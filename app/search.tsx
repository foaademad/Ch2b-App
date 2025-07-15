import { useLanguage } from '@/src/context/LanguageContext';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Camera, Filter, Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator, FlatList, Image, Modal, ScrollView,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Shadows } from '../constants/Shadows';
import { searchByText, searchImage } from '../src/store/api/imageSearchApi';
import { RootState } from '../src/store/store';
import { ProductDto } from '../src/store/utility/interfaces/productInterface';

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
  const imageFile = params.imageFile as any;

  const { 
    imageSearchResults, 
    searchTextResults, 
    loading, 
    loadingMore, 
    currentPage, 
    hasMore 
  } = useSelector((state: RootState) => state.imageSearch);

  const [searchText, setSearchText] = useState('');
  const [filteredResults, setFilteredResults] = useState<ProductDto[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    priceRange: { min: 0, max: 10000 },
    brands: [],
    categories: [],
  });

  // استخراج العلامات التجارية والفئات المتاحة من النتائج
  const availableBrands = Array.from(new Set(searchTextResults.map(product => product.brandName).filter(Boolean)));
  const availableCategories = Array.from(new Set(searchTextResults.map(product => product.categoryId?.toString()).filter(Boolean)));

  const searchResults = imageFile ? imageSearchResults : searchTextResults;

  useEffect(() => {
    if (imageFile) {
      dispatch(searchImage({ file: imageFile, page: 1 }) as any);
    }
  }, [imageFile]);

  useEffect(() => {
    if (!imageFile && searchText.trim()) {
      dispatch(searchByText({ title: searchText, page: 1, language }) as any);
    }
  }, [searchText]);

  useEffect(() => {
    applyFilters(searchResults, activeFilters);
  }, [searchResults, activeFilters]);

  const applyFilters = (products: ProductDto[], filters: FilterOptions) => {
    let filtered = products;
    
    // فلتر السعر
    filtered = filtered.filter(product => {
      const price = product.price?.convertedPriceList?.internal?.price || 0;
      return price >= filters.priceRange.min && price <= filters.priceRange.max;
    });
    
    // فلتر العلامات التجارية
    if (filters.brands.length > 0) {
      filtered = filtered.filter(product =>
        product.brandName && filters.brands.includes(product.brandName)
      );
    }
    
    // فلتر الفئات
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

  const toggleBrand = (brand: string) => {
    const newBrands = activeFilters.brands.includes(brand)
      ? activeFilters.brands.filter(b => b !== brand)
      : [...activeFilters.brands, brand];
    updateFilters({ brands: newBrands });
  };

  const toggleCategory = (category: string) => {
    const newCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter(c => c !== category)
      : [...activeFilters.categories, category];
    updateFilters({ categories: newCategories });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      priceRange: { min: 0, max: 10000 },
      brands: [],
      categories: [],
    });
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      const nextPage = currentPage + 1;
      
      if (imageFile) {
        dispatch(searchImage({ file: imageFile, page: nextPage }) as any);
      } else if (searchText.trim()) {
        dispatch(searchByText({ title: searchText, page: nextPage, language }) as any);
      }
    }
  };

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      const file = result.assets[0];
      const image = {
        uri: file.uri,
        name: file.fileName || 'image.jpg',
        type: file.type || 'image/jpeg',
      } as any;
      dispatch(searchImage({ file: image, page: 1 }) as any);
    }
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

  const renderLoadMoreButton = () => {
    if (!hasMore || filteredResults.length === 0) return null;
    
    return (
      <View style={styles.loadMoreContainer}>
        <TouchableOpacity
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
          disabled={loadingMore}
          activeOpacity={0.8}
        >
          {loadingMore ? (
            <View style={styles.loadMoreLoadingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.loadMoreLoadingText}>
                {t('Loading more products...')}
              </Text>
            </View>
          ) : (
            <Text style={styles.loadMoreText}>{t('Load More Products')}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{t('Filters')}</Text>
          <TouchableOpacity onPress={() => setShowFilterModal(false)}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* فلتر السعر */}
          <View style={styles.filterSection}>
            <Text style={styles.filterSectionTitle}>{t('Price Range')}</Text>
            <View style={styles.priceRangeContainer}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min"
                keyboardType="numeric"
                value={activeFilters.priceRange.min.toString()}
                onChangeText={(text) => updateFilters({
                  priceRange: { ...activeFilters.priceRange, min: Number(text) || 0 }
                })}
              />
              <Text style={styles.priceSeparator}>-</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="Max"
                keyboardType="numeric"
                value={activeFilters.priceRange.max.toString()}
                onChangeText={(text) => updateFilters({
                  priceRange: { ...activeFilters.priceRange, max: Number(text) || 10000 }
                })}
              />
            </View>
          </View>

          {/* فلتر العلامات التجارية */}
          {availableBrands.length > 0 && (
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>{t('Brands')}</Text>
              <View style={styles.chipContainer}>
                {availableBrands.map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.chip,
                      activeFilters.brands.includes(brand) && styles.chipActive
                    ]}
                    onPress={() => toggleBrand(brand)}
                  >
                    <Text style={[
                      styles.chipText,
                      activeFilters.brands.includes(brand) && styles.chipTextActive
                    ]}>
                      {brand}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* فلتر الفئات */}
          {availableCategories.length > 0 && (
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>{t('Categories')}</Text>
              <View style={styles.chipContainer}>
                {availableCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.chip,
                      activeFilters.categories.includes(category) && styles.chipActive
                    ]}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text style={[
                      styles.chipText,
                      activeFilters.categories.includes(category) && styles.chipTextActive
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.clearButton} onPress={clearAllFilters}>
            <Text style={styles.clearButtonText}>{t('Clear All')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.applyButton} 
            onPress={() => setShowFilterModal(false)}
          >
            <Text style={styles.applyButtonText}>{t('Apply Filters')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <Filter size={24} color="#333" />
        </TouchableOpacity>
      </View>

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
          <TouchableOpacity onPress={openImagePicker}>
          <Camera size={24} color="#333" />
        </TouchableOpacity>
        </View>
      </View>

      {/* عرض الفلاتر النشطة */}
      {(activeFilters.brands.length > 0 || activeFilters.categories.length > 0 || 
        activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 10000) && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activeFilters.brands.map((brand) => (
              <View key={brand} style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{brand}</Text>
                <TouchableOpacity onPress={() => toggleBrand(brand)}>
                  <X size={16} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
            {activeFilters.categories.map((category) => (
              <View key={category} style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{category}</Text>
                <TouchableOpacity onPress={() => toggleCategory(category)}>
                  <X size={16} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
            {(activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < 10000) && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>
                  {activeFilters.priceRange.min} - {activeFilters.priceRange.max}
                </Text>
                <TouchableOpacity onPress={() => updateFilters({
                  priceRange: { min: 0, max: 10000 }
                })}>
                  <X size={16} color="#666" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#36c7f6" />
        </View>
      ) : (
        <FlatList
          data={filteredResults}
          renderItem={renderProduct}
          keyExtractor={(item) => `search-${item.id}`}
          contentContainerStyle={styles.resultsContainer}
          ListFooterComponent={renderLoadMoreButton}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('No products found')}</Text>
              <Text style={styles.emptySubText}>{t('Try different keywords or adjust your filters')}</Text>
            </View>
          }
        />
      )}

      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff',
  },
  searchContainer: { padding: 16, backgroundColor: '#fff' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5',
    borderRadius: 25, paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: '#e0e0e0',
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  activeFiltersContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#1976d2',
    marginRight: 6,
  },
  resultsContainer: { padding: 16 },
  productCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 12,
    flexDirection: 'row', alignItems: 'center', ...Shadows.card,
  },
  productImage: {
    width: 80, height: 80, borderRadius: 8, backgroundColor: '#f4f4f4', marginRight: 12,
  },
  productInfo: { flex: 1 },
  productTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  productBrand: { fontSize: 14, color: '#666', marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#36c7f6' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 8 },
  emptySubText: { fontSize: 14, color: '#999', textAlign: 'center' },
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
    fontWeight: 'bold',
  },
  loadMoreLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreLoadingText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  priceSeparator: {
    marginHorizontal: 12,
    fontSize: 16,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  chipActive: {
    backgroundColor: '#36c7f6',
    borderColor: '#36c7f6',
  },
  chipText: {
    fontSize: 14,
    color: '#666',
  },
  chipTextActive: {
    color: '#fff',
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#36c7f6',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SearchScreen;
