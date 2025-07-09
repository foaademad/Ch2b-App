import React from 'react';
import { View, Image, Text } from 'react-native';
import Carousel from '@/components/common/Carousel';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../src/context/LanguageContext';
import banners from './bannersData';

const EnhancedCarousel = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <View style={{ marginBottom: 16 }}>
      <Carousel
        data={banners}
        autoPlay={true}
        autoPlayInterval={3000}
        paginationStyle={{
          dotStyle: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ccc' },
          activeDotStyle: { backgroundColor: '#1abc9c' },
        }}
        renderItem={({ item }) => (
          <View style={{
            borderRadius: 16,
            overflow: 'hidden',
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}>
            <Image
              source={{ uri: item.image }}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
            <View style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              backgroundColor: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))',
            }} />
            <Text style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              color: '#fff',
              fontFamily: 'Poppins-SemiBold',
              fontSize: 18,
            }}>
              {t(item.title)}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default EnhancedCarousel;