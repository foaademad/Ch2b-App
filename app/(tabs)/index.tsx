import { useLanguage } from '@/src/context/LanguageContext';
import { ProductDto } from '@/src/store/utility/interfaces/productInterface';
import styles from '@/styles/home';
import { useRouter } from 'expo-router';
import { Camera, Search } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Shadows } from '../../constants/Shadows';
import { getProducts } from '../../src/store/api/productApi';
import { AppDispatch, RootState } from '../../src/store/store';
import EnhancedCarousel from '../home/banners/Banners';
import BestSellers from '../home/bestSellers/BestSellers';
import Categories from '../home/categories/Categories';
import DailyDeals from '../home/dailyDeals/DailyDeals';
import NewArrivals from '../home/newArrivals/NewArrivals';

function AnimatedSearchBar() {
 const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const router = useRouter();
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

  const handleSearchPress = () => {
    // Navigate to search page
    router.push('/search');
  };

  const handleChange = (text: string) => {
    setValue(text);
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
        <TouchableOpacity 
          style={[searchStyles.searchTouchable, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
          onPress={handleSearchPress}
          activeOpacity={0.8}
        >
          <TextInput
            style={[searchStyles.searchText, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('search.placeholder')}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor="#aaa"
            value={value}
            onChangeText={handleChange}
            editable={false}
          />
          <TouchableOpacity onPress={handleSearchPress}>
            <Camera size={24} color="#333" />
          </TouchableOpacity>
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
  searchTouchable: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
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
  const { currentCategory } = useSelector((state: RootState) => state.product);
  const [dailyDealsProducts, setDailyDealsProducts] = useState<ProductDto[]>([]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <AnimatedSearchBar />
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
    </View>
  );
};

export default HomeScreen;