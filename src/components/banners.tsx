// ---------- MODULE IMPORTS ----------
import React, {FC, useEffect, useRef, useState} from 'react';
import {FlatList, Image, StyleSheet, View, Animated} from 'react-native';

// ---------- TYPE IMPORTS ----------
import {BannerProps} from '../types/components';

// ---------- INTERVAL ----------
const AUTO_SCROLL_INTERVAL = 3000;

// ---------- COMPONENT ----------
const Banners: FC<BannerProps> = ({
  images,
  activeindex,
  setActiveindex,
  height,
  width,
  marginVertical,
  resizeMode = 'contain',
  autoScrollEnabled = true,
  itemWidth,
}) => {
  // ---------- REF ----------
  const flatListRef = useRef<FlatList>(null);
  const scrollIndex = useRef(activeindex);
  // ---------- STATE ----------
  const [currentIndex, setCurrentIndex] = useState(activeindex);

  // ---------- EFFECTS ----------
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

  // ---------- RENDER ----------
  return (
    <View style={styles.itemContainer}>
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
                  marginHorizontal: 30,
                }}
              />
            </View>
          ) : null
        }
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width}
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

// ---------- STYLES ----------
const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
