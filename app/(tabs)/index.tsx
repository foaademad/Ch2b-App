import { useLanguage } from '@/src/context/LanguageContext';
import styles from '@/styles/home';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Shadows } from '../../constants/Shadows';
import { getProducts } from '../../src/store/api/productApi';
import { AppDispatch, RootState } from '../../src/store/store';
import { ProductDto } from '../../src/store/utility/interfaces/productInterface';
import EnhancedCarousel from '../home/banners/Banners';
import BestSellers from '../home/bestSellers/BestSellers';
import Categories from '../home/categories/Categories';
import DailyDeals from '../home/dailyDeals/DailyDeals';
import NewArrivals from '../home/newArrivals/NewArrivals';

function AnimatedSearchBar({ onChangeText }: { onChangeText: (text: string) => void }) {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const widthAnim = useRef(new Animated.Value(0.85)).current;
  const [value, setValue] = useState('');

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(widthAnim, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(widthAnim, {
      toValue: 0.85,
      useNativeDriver: false,
    }).start();
  };

  const handleChange = (text: string) => {
    setValue(text);
    onChangeText(text);
  };

  return (
    <View style={searchStyles.container}>
      <Animated.View
        style={[
          searchStyles.animatedBar,
          {
            width: widthAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["70%", "100%"],
            }),
            backgroundColor: isFocused ? "#f0f8ff" : "#fff",
            ...(isFocused ? Shadows.primary : Shadows.medium),
          },
        ]}
      >
        <TextInput
          style={searchStyles.searchText}
          placeholder={t("searchProducts")}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={handleChange}
        />
        <TouchableOpacity>
          <Search size={22} color={isFocused ? "#36c7f6" : "#666"} style={searchStyles.icon} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const searchStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 16,
  },
  animatedBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 8,
    ...Shadows.primary,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#2c3e50",
    paddingVertical: 6,
  },
  icon: {
    marginLeft: 8,
  },
});

const HomeScreen = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { currentCategory, productsBest, productsNew } = useSelector((state: RootState) => state.product);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<ProductDto[]>([]);
  const [dailyDealsProducts, setDailyDealsProducts] = useState<ProductDto[]>([]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const dynamicSearchContainerStyle = {
    ...styles.searchContainer,
    flexDirection: language === 'ar' ? 'row-reverse' : 'row' as 'row-reverse' | 'row',
  };

  const dynamicSearchBarStyle = {
    ...styles.searchBar,
    flexDirection: language === 'ar' ? 'row-reverse' : 'row' as 'row-reverse' | 'row',
  };

  const dynamicSearchIconStyle = {
    ...styles.searchIcon,
    marginRight: language === 'ar' ? 0 : 8,
    marginLeft: language === 'ar' ? 8 : 0,
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      setSearchResults([]);
      return;
    }
    const lower = text.toLowerCase();
    // Combine products and remove duplicates based on id
    const allProducts = [...productsBest, ...productsNew, ...dailyDealsProducts];
    const uniqueProducts = allProducts.filter((item, index, self) => 
      index === self.findIndex(p => p.id === item.id)
    );
    const filtered = uniqueProducts.filter(
      (item) =>
        item.title?.toLowerCase().includes(lower) ||
        item.name?.toLowerCase().includes(lower) ||
        item.brandName?.toLowerCase().includes(lower)
    );
    setSearchResults(filtered);
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchResults([]);
  };

  const renderProduct = ({ item }: { item: ProductDto }) => (
    <TouchableOpacity
      style={{
        margin: 8,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 10,
        ...Shadows.card,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      activeOpacity={0.85}
      onPress={() => {
        clearSearch();
        router.push(`/product/${item.id}`);
      }}
    >
      <Image
        source={{ uri: item.mainPictureUrl }}
        style={{
          width: 70,
          height: 70,
          borderRadius: 12,
          backgroundColor: '#f4f4f4',
          marginRight: 12,
        }}
        resizeMode="cover"
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 2 }} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={{ color: '#888', fontSize: 13, marginBottom: 2 }}>{item.brandName}</Text>
        <Text style={{ color: '#36c7f6', fontWeight: 'bold', fontSize: 15 }}>
          {item.price?.convertedPriceList?.internal?.sign} {item.price?.convertedPriceList?.internal?.price}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <AnimatedSearchBar onChangeText={handleSearch} />
      {searchText ? (
        <FlatList
          data={searchResults}
          renderItem={renderProduct}
          keyExtractor={(item) => `search-${item.id}`}
          contentContainerStyle={{ padding: 10 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#888', marginTop: 30 }}>{t('No products found')}</Text>}
        />
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <EnhancedCarousel />
            <Categories />
            <NewArrivals />
            <BestSellers />
            <DailyDeals onProductsChange={setDailyDealsProducts} />
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default HomeScreen;