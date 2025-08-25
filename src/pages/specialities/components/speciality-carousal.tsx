import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {adjust} from '../../../utils/common-functions';
import {pallette} from '../../../constants/constants';

const {width: screenWidth} = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.3;

const SpecialtyCarousal = ({
  specialties,
  activeIndex,
  onLeftPress,
  onRightPress,
  onTabPress,
}: {
  specialties: {speciality_id: number; name: string}[];
  activeIndex: number;
  onLeftPress: () => void;
  onRightPress: () => void;
  onTabPress: (index: number, specialityId: number) => void;
}) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollIndex = useRef(activeIndex);

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (specialties.length > 0) {
      setData([{key: 'left-spacer'}, ...specialties, {key: 'right-spacer'}]);
    }
  }, [specialties]);

  useEffect(() => {
    if (flatListRef.current && specialties.length > 0 && data.length > 0) {
      flatListRef.current.scrollToIndex({
        index: activeIndex,
        animated: true,
      });
      scrollIndex.current = activeIndex;
    }
  }, [activeIndex, specialties, data]);

  const handleLeftPress = () => {
    if (scrollIndex.current > 0) {
      const newIndex = scrollIndex.current - 1;
      scrollIndex.current = newIndex;
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
      onLeftPress();
      onTabPress(newIndex, specialties[newIndex].speciality_id);
    }
  };

  const handleRightPress = () => {
    if (scrollIndex.current < specialties.length - 1) {
      const newIndex = scrollIndex.current + 1;
      scrollIndex.current = newIndex;
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: true,
      });
      onRightPress();
      onTabPress(newIndex, specialties[newIndex].speciality_id);
    }
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    if (!item || item.key === 'left-spacer' || item.key === 'right-spacer') {
      return <View key={item.key} style={{width: ITEM_WIDTH}} />;
    }

    const inputRange = [
      (index - 2) * ITEM_WIDTH,
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.75, 1, 0.75],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp',
    });

    const adjustedIndex = index - 1;

    return (
      <Animated.View
        style={[styles.itemWrapper, {transform: [{scale}], opacity}]}>
        <TouchableOpacity
          onPress={() => onTabPress(adjustedIndex, item.speciality_id)}
          style={[
            styles.itemContainer,
            adjustedIndex === activeIndex && styles.activeItemContainer,
          ]}>
          <Text
            style={[
              styles.tabText,
              adjustedIndex === activeIndex && styles.activeTabText,
            ]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Left Arrow */}
      <TouchableOpacity onPress={handleLeftPress}>
        <Text style={styles.arrow}>{'<<'}</Text>
      </TouchableOpacity>

      {/* List */}
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(_, index) => 'qq' + index.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        bounces={false}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        onMomentumScrollEnd={event => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / ITEM_WIDTH,
          );
          const adjustedIndex = Math.max(0, index - 1); // adjust for left spacer
          scrollIndex.current = adjustedIndex;
        }}
        onScrollToIndexFailed={info => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          }, 100);
        }}
      />

      {/* Right Arrow */}
      <TouchableOpacity onPress={handleRightPress}>
        <Text style={styles.arrow}>{'>>'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SpecialtyCarousal;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemWrapper: {
    width: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: pallette.light_grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeItemContainer: {
    backgroundColor: pallette.app_light_green,
  },
  tabText: {
    fontSize: adjust(12),
    color: pallette.dark_grey,
  },
  activeTabText: {
    color: pallette.app_green,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  arrow: {
    fontSize: adjust(16),
    color: pallette.app_green,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});
