import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const ITEM_WIDTH = 100; // Approximate width of each item

const SpecialtySlider = ({
  specialties,
  activeIndex,
  onLeftPress,
  onRightPress,
  onTabPress,
}: {
  specialties: string[];
  activeIndex: number;
  onLeftPress: () => void;
  onRightPress: () => void;
  onTabPress: (index: number) => void;
}) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: activeIndex,
        animated: true,
        viewPosition: 0.5, // Center the active item
      });
    }
  }, [activeIndex]);

  const renderItem = ({item, index}: {item: string; index: number}) => (
    <TouchableOpacity onPress={() => onTabPress(index)}>
      <Text
        style={[styles.tabText, index === activeIndex && styles.activeTabText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onLeftPress}>
        <Text style={styles.arrow}>{'<<'}</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={specialties}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH,
          offset: ITEM_WIDTH * index,
          index,
        })}
      />

      <TouchableOpacity onPress={onRightPress}>
        <Text style={styles.arrow}>{'>>'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SpecialtySlider;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  arrow: {
    fontSize: 20,
    color: '#00A2A2',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  tabText: {
    width: ITEM_WIDTH,
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    fontWeight: 'normal',
  },
  activeTabText: {
    color: '#00A2A2',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
