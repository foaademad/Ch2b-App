import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLanguage } from "../../src/context/LanguageContext";

const { width: windowWidth } = Dimensions.get('window');

type CarouselItem = {
  id: number;
  image: string;
  title: string;
};

type CarouselProps = {
  data: CarouselItem[];
  autoPlay?: boolean;
  interval?: number;
};

const Carousel: React.FC<CarouselProps> = ({ 
  data, 
  autoPlay = true, 
  interval = 5000 
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Safety check for data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.slide}>
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      </View>
    );
  }
  
  useEffect(() => {
    if (autoPlay && data.length > 1) {
      const timer = setInterval(() => {
        const nextIndex = (activeIndex + 1) % data.length;
        setActiveIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * windowWidth,
          animated: true,
        });
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [activeIndex, autoPlay, data.length, interval]);
  
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / windowWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };
  
  const handleDotPress = (index: number) => {
    setActiveIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * windowWidth,
      animated: true,
    });
  };

  const styles = StyleSheet.create({
    container: {
      height: 180,
      width: windowWidth,
    },
    scrollContainer: {
      height: 180,
    },
    slide: {
      width: windowWidth,
      height: 180,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: windowWidth - 32,
      height: 180,
      borderRadius: 12,
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
      textAlign: language === 'ar' ? 'right' : 'left',
    },
    pagination: {
      position: 'absolute',
      bottom: 16,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    activeDot: {
      width: 12,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
      backgroundColor: '#fff',
    },
    noDataText: {
      fontSize: 16,
      color: '#666',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollContainer}
      >
        {data.map((item, index) => (
          <View key={item.id} style={styles.slide}>
            <Image 
              source={{ uri: item.image }} 
              style={styles.image} 
              resizeMode="cover" 
            />
            <View style={styles.textOverlay}>
              <Text style={styles.title}>{t(item.title)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      
      {data.length > 1 && (
        <View style={styles.pagination}>
          {data.map((_, index) => (
            <TouchableOpacity
              key={`dot-${index}`}
              style={index === activeIndex ? styles.activeDot : styles.dot}
              onPress={() => handleDotPress(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default Carousel;