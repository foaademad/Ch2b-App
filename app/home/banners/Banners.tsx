import Carousel from '@/components/common/Carousel';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Shadows } from '../../../constants/Shadows';
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
        renderItem={({ item }) => (
          <View style={styles.bannerContainer}>
            <Image
              source={{ uri: item.image }}
              style={{
                width: '100%',
                height: 180,
                borderRadius: 12,
              }}
              resizeMode="cover"
            />
            <View style={styles.textOverlay}>
              <Text style={styles.title}>{t(item.title)}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EnhancedCarousel;