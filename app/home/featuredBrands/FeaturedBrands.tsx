import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { Shadows } from '../../../constants/Shadows';
import { useLanguage } from '../../../src/context/LanguageContext';
import featuredBrands from './featuredBrandsData';

const BrandItem = ({ item }: { item: any }) => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 8,
        alignItems: 'center',
        ...Shadows.small,
      }}
    >
      <Image
        source={{ uri: item.logo }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          marginBottom: 8,
        }}
        resizeMode="cover"
      />
      <Text
        style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: '#333',
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        {item.name}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: '#36c7f6',
          fontWeight: '600',
        }}
      >
        {item.discount}
      </Text>
    </TouchableOpacity>
  );
};

const FeaturedBrands = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const renderBrandItem = ({ item }: { item: any }) => (
    <BrandItem item={item} />
  );

  return (
    <View style={{ marginVertical: 16 }}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#333',
          marginBottom: 16,
          paddingHorizontal: 16,
          textAlign: language === 'ar' ? 'right' : 'left',
        }}
      >
        {t('featuredBrands.title')}
      </Text>
      <FlatList
        data={featuredBrands}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBrandItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}
      />
    </View>
  );
};

export default FeaturedBrands; 