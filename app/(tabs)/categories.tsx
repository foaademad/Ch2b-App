import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Shadows } from '../../constants/Shadows';
import { getCategoriesApi } from '../../src/store/api/categoryApi';
import { getallProductByCategoryId } from '../../src/store/api/productApi';
import { RootState } from '../../src/store/store';
import { CategoryDto } from '../../src/store/utility/interfaces/categoryInterface';

interface CategoryItemProps {
  category: CategoryDto;
  level: number;
  onPress: (category: CategoryDto) => void;
}

interface CategoryItemProps {
  category: CategoryDto;
  level: number;
  onPress: (category: CategoryDto) => void;
  isSearchMode?: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, level, onPress, isSearchMode = false }) => {
  const [isExpanded, setIsExpanded] = useState(isSearchMode);
  const hasChildren = category.children && category.children.length > 0;

  const handlePress = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      onPress(category);
    }
  };

  return (
    <View style={styles.categoryContainer}>
      <TouchableOpacity
        style={[
          styles.categoryItem,
          { 
            backgroundColor: level === 0 ? '#fff' : '#eaf6fb', 
            borderRadius: 18, 
            marginVertical: 6,
            ...Shadows.primaryMedium,
          },
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.categoryContent}>
          <Ionicons name={hasChildren ? 'folder-open-outline' : 'pricetag-outline'} size={22} color={level === 0 ? '#36c7f6' : '#2c3e50'} style={{ marginRight: 10 , marginLeft: 16}} />
          <Text style={styles.categoryName}>
            {category.nameEn || category.name}
          </Text>
          {hasChildren && (
            <Ionicons
              name={isExpanded ? 'chevron-down' : 'chevron-forward'}
              size={20}
              color="#36c7f6"
            />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && hasChildren && (
        <View style={styles.subCategoriesContainer}>
          {category.children.map((child, index) => (
            <CategoryItem
              key={child.id || `${category.id}-child-${index}`}
              category={child}
              level={level + 1}
              onPress={onPress}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default function CategoriesScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { categories, loading, error } = useSelector((state: RootState) => state.category);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const mainCategoriesWithChildren = useMemo(
    () =>
      categories.filter(
        (category) =>
          !category.parentId && category.children && category.children.length > 0
      ),
    [categories]
  );

  // دالة للبحث في جميع الفئات (الرئيسية والفرعية)
  const searchInAllCategories = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      return mainCategoriesWithChildren;
    }

    const lowerSearchTerm = searchTerm.trim().toLowerCase();
    const results: CategoryDto[] = [];

    // البحث في الفئات الرئيسية
    categories.forEach(category => {
      if (!category.parentId) {
        const matchesSearch = 
          (category.nameEn && category.nameEn.toLowerCase().includes(lowerSearchTerm)) ||
          (category.name && category.name.toLowerCase().includes(lowerSearchTerm));

        if (matchesSearch) {
          // إذا كانت الفئة الرئيسية تطابق البحث، أضفها مع أطفالها
          results.push(category);
        } else if (category.children && category.children.length > 0) {
          // البحث في الفئات الفرعية
          const matchingChildren = category.children.filter(child =>
            (child.nameEn && child.nameEn.toLowerCase().includes(lowerSearchTerm)) ||
            (child.name && child.name.toLowerCase().includes(lowerSearchTerm))
          );

          if (matchingChildren.length > 0) {
            // إذا وجدت فئات فرعية تطابق البحث، أضف الفئة الرئيسية مع الفئات الفرعية المطابقة فقط
            const categoryWithMatchingChildren = {
              ...category,
              children: matchingChildren
            };
            results.push(categoryWithMatchingChildren);
          }
        }
      }
    });

    return results;
  };

  const [search, setSearch] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchAnimation = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);
  const [filteredCategories, setFilteredCategories] = useState(mainCategoriesWithChildren);

  useEffect(() => {
    const searchResults = searchInAllCategories(search);
    setFilteredCategories(searchResults);
  }, [search, categories]);

  useEffect(() => {
    // عند أول تحميل الصفحة
    setCurrentPage(1);
    setHasMore(true);
    dispatch(getCategoriesApi(1, 20, false) as any);
  }, [dispatch]);

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

  const handleCategoryPress = (category: CategoryDto) => {
    if (!category.children?.length) {
      const categoryId = category.id;
      console.log("Selected categoryId: ", categoryId);
      if (categoryId) {
        dispatch(getallProductByCategoryId(categoryId, 1, 20, false, category.name, category.nameEn) as any);
        router.push('category-products' as any);
      }
    }
  };

  const renderCategory = ({ item }: { item: CategoryDto }) => (
    <CategoryItem
      category={item}
      level={0}
      onPress={handleCategoryPress}
      isSearchMode={search.length > 0}
    />
  );

  // زر تحميل المزيد
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || search.length > 0) return;
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    // جلب الصفحة التالية
    await dispatch<any>(getCategoriesApi(nextPage, 20, true));
    setCurrentPage(nextPage);
    // إذا كانت النتائج أقل من 20، لا يوجد المزيد
    if (categories.length % 20 !== 0) {
      setHasMore(false);
    }
    setLoadingMore(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#36c7f6" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading categories: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(getCategoriesApi() as any)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="grid-outline" size={28} color="#36c7f6" style={{ position: 'absolute', left: 24, top: 32 }} />
        <Text style={styles.headerTitle}>Categories</Text>
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
            placeholder="Search for a category..."
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

      {filteredCategories.length > 0 ? (
        <>
          {search.length > 0 && (
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsText}>
                Found {filteredCategories.length} category{filteredCategories.length !== 1 ? 'ies' : ''}
              </Text>
            </View>
          )}
          <FlatList
            data={filteredCategories}
            renderItem={renderCategory}
            keyExtractor={(item, index) => item.id || `category-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={
              !search.length && hasMore ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{ backgroundColor: '#36c7f6', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 }}
                    onPress={handleLoadMore}
                    disabled={loadingMore}
                    activeOpacity={0.8}
                  >
                    {loadingMore ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Poppins-Medium', fontWeight: 'bold' }}>Load More Categories</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="grid-outline" size={64} color="#36c7f6" style={{ marginBottom: 8 }} />
          <Text style={styles.emptyText}>
            {search.length > 0 ? 'No matching categories found' : 'No categories available'}
          </Text>
          <Text style={styles.emptySubText}>
            {search.length > 0 ? 'Try searching with a different name' : 'Check if categories exist'}
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
    padding: 20,
    paddingTop: 30,
  
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    // shadowColor: '#36c7f6',
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.18,
    // shadowRadius: 8,
    // elevation: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    textAlign: 'center',
    letterSpacing: 1,
  },
  searchBarContainer: {

    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: -24,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#2c3e50',
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
    color: '#e74c3c',
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
  listContainer: {
    paddingBottom: 20,
    paddingTop: 8,
  },
  categoryContainer: {
    marginBottom: 2,
  },
  categoryItem: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingRight: 20,
    borderBottomWidth: 0,
    marginHorizontal: 16,
    marginVertical: 2,
    borderRadius: 18,
    ...Shadows.primaryMedium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  categoryName: {
    fontSize: 17,
    fontFamily: 'Poppins-Medium',
    color: '#2c3e50',
    flex: 1,
    marginLeft: 2,
  },
  subCategoriesContainer: {
    backgroundColor: '#eaf6fb',
    marginHorizontal: 24,
    marginTop: 2,
    borderRadius: 12,

    borderLeftWidth: 2,
    borderLeftColor: '#36c7f6',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  searchIconButton: {
    position: 'absolute',
    right: 24,
    top: 32,
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
  clearButton: {
    padding: 5,
  },
  searchResultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchResultsText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#36c7f6',
    textAlign: 'center',
  },
});
