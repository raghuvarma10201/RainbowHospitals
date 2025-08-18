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

const {width: screenWidth} = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.4; // width of each text item
const SPACER_WIDTH = (screenWidth - ITEM_WIDTH) / 2; // half remaining width for perfect centering

const SpecialtyHighlight = ({
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

  // Add spacers for center snapping
  useEffect(() => {
    setData([{key: 'left-spacer'}, ...specialties, {key: 'right-spacer'}]);
  }, [specialties]);

  // Scroll to the current active index when it changes
  useEffect(() => {
    if (flatListRef.current && specialties.length > 0) {
      flatListRef.current.scrollToOffset({
        offset: (activeIndex + 1) * ITEM_WIDTH - SPACER_WIDTH,
        animated: true,
      });
      scrollIndex.current = activeIndex;
    }
  }, [activeIndex]);

  // Handle left arrow click
  const handleLeftPress = () => {
    if (scrollIndex.current > 0) {
      const newIndex = scrollIndex.current - 1;
      scrollIndex.current = newIndex;
      flatListRef.current?.scrollToOffset({
        offset: (newIndex + 1) * ITEM_WIDTH - SPACER_WIDTH,
        animated: true,
      });
      onLeftPress();
      onTabPress(newIndex, specialties[newIndex].speciality_id);
    }
  };

  // Handle right arrow click
  const handleRightPress = () => {
    if (scrollIndex.current < specialties.length - 1) {
      const newIndex = scrollIndex.current + 1;
      scrollIndex.current = newIndex;
      flatListRef.current?.scrollToOffset({
        offset: (newIndex + 1) * ITEM_WIDTH - SPACER_WIDTH,
        animated: true,
      });
      onRightPress();
      onTabPress(newIndex, specialties[newIndex].speciality_id);
    }
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    if (!item || item.key === 'left-spacer' || item.key === 'right-spacer') {
      return <View key={item.key} style={{width: SPACER_WIDTH}} />;
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

    const adjustedIndex = index - 1; // because of left spacer

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
          // onTabPress(adjustedIndex, specialties[adjustedIndex].speciality_id);
        }}
      />

      {/* Right Arrow */}
      <TouchableOpacity onPress={handleRightPress}>
        <Text style={styles.arrow}>{'>>'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SpecialtyHighlight;

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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeItemContainer: {
    borderColor: '#00A2A2',
    backgroundColor: '#e6fafa',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#00A2A2',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  arrow: {
    fontSize: 18,
    color: '#00A2A2',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});
