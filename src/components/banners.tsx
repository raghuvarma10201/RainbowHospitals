import React, {FC, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  ImageResizeMode,
} from 'react-native';

interface BannerProps {
  images: any[];
  activeindex: number;
  setActiveindex: (index: number) => void;
  height: number;
  width: number;
  marginVertical?: number;
  resizeMode?: ImageResizeMode | undefined;
  autoScrollEnabled?: boolean;
  itemWidth?: number;
}
const AUTO_SCROLL_INTERVAL = 3000; // Auto-scroll every 3 seconds

const Banners: FC<BannerProps> = ({
  images,
  activeindex,
  setActiveindex,
  height,
  width,
  marginVertical,
  resizeMode = 'contain',
  autoScrollEnabled = true, // Toggle auto-scroll on/off
  itemWidth,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollIndex = useRef(activeindex);
  const [currentIndex, setCurrentIndex] = useState(activeindex);

  // **Auto-scroll function**
  useEffect(() => {
    if (!images.length || !autoScrollEnabled) return;

    const autoScroll = setInterval(() => {
      scrollIndex.current = (scrollIndex.current + 1) % images.length;

      flatListRef.current?.scrollToOffset({
        offset: scrollIndex.current * width,
        animated: true,
      });

      setCurrentIndex(scrollIndex.current);
      setActiveindex(scrollIndex.current);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(autoScroll);
  }, [images, autoScrollEnabled]);

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Animated.FlatList
        ref={flatListRef}
        data={images}
        renderItem={({item}) =>
          item ? (
            <View style={[styles.itemContainer, {width}]}>
              <Image
                source={item}
                style={{
                  height,
                  width: itemWidth || width * 0.95,
                  marginVertical,
                  resizeMode,
                  borderRadius: Dimensions.get('window').width * 0.04,
                }}
              />
            </View>
          ) : null
        }
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width} // Ensures smooth snapping
        snapToAlignment="center"
        decelerationRate="fast"
        bounces={false}
        initialScrollIndex={currentIndex}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onMomentumScrollEnd={event => {
          const newIndex = Math.round(
            event.nativeEvent.contentOffset.x / width,
          );
          setCurrentIndex(newIndex);
          setActiveindex(newIndex);
          scrollIndex.current = newIndex;
        }}
      />
    </View>
  );
};

export default Banners;

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
