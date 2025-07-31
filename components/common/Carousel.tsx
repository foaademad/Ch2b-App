import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getImageDynamic } from '../../src/store/api/imageDynamicApi';
import { RootState } from '../../src/store/store';
import { styles } from './CarouselStyle';

type CarouselProps = {
  autoPlay?: boolean;
  interval?: number;
};

const Carousel: React.FC<CarouselProps> = ({ 
  autoPlay = true, 
  interval = 5000 
}) => {
 
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width: windowWidth } = Dimensions.get('window');
  const dispatch = useDispatch();
  const { image, loading, error } = useSelector((state: RootState) => state.imageDynamic);

  useEffect(() => {
    dispatch(getImageDynamic() as any);
    // console.log("image", image?.images);
  }, []);

  useEffect(() => {
    if (autoPlay && image && Array.isArray(image) && image.length > 1) {
      const timer = setInterval(() => {
        const nextIndex = (activeIndex + 1) % image.length;
        setActiveIndex(nextIndex);
        scrollViewRef.current?.scrollTo({
          x: nextIndex * windowWidth,
          animated: true,
        });
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [activeIndex, autoPlay, image, interval, windowWidth]);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / windowWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  return (
    <View style={styles.container}>
      {(!image || !Array.isArray(image) || image.length === 0) ? (
        <View style={styles.slide}>
          <Text style={styles.noDataText}>No data available</Text>
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollContainer}
        >
          {image
            ?.filter((item: any) => item?.imageDto && item.imageDto.url)
            .map((item: any, index: number) => (
              <View key={item.id} style={styles.slide}>
                <Image 
                  source={{ uri: item.imageDto.url }} 
                  style={styles.image} 
                  resizeMode="cover" 
                />
              </View>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Carousel;