import styles from '@/styles/home';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../../src/context/LanguageContext';
import featuredBrands from './featuredBrandsData';

const BrandItem = ({ item }: { item: any }) => {
  return (
    <TouchableOpacity
      style={{
        width: 140,
        marginRight: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        marginBottom: 16,
      }}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: item.logo }}
          style={{ width: '100%', height: 100 }}
          resizeMode="cover"
        />
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: '#ff3b30',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
            {item.discount}
          </Text>
        </View>
      </View>
      <View style={{ padding: 12, alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'Poppins-SemiBold',
            color: '#333',
          }}
        >
          {item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const FeaturedBrands = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const renderBrandItem = ({ item }: { item: any }) => <BrandItem item={item} />;

  return (
    <View style={{ marginVertical: 16 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 10,
        }}
      >
        <Text style={styles.sectionTitle}>{t('Featured Brands')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.seeAll}>{t('See All')}</Text>
          <ChevronRight
            size={16}
            color="#36c7f6"
            style={{
              transform: [{ rotate: language === 'ar' ? '180deg' : '0deg' }],
            }}
          />
        </View>
      </View>
      <FlatList
        data={featuredBrands}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBrandItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
};

export default FeaturedBrands; 