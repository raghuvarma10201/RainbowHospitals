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
  specialties: any;
  activeIndex: number;
  onLeftPress: () => void;
  onRightPress: () => void;
  onTabPress: (index: number) => void;
}) => {
  const flatListRef = useRef<FlatList>(null);
  console.log(specialties);
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: activeIndex,
        animated: true,
        viewPosition: 0.5, // Center the active item
      });
    }
  }, [activeIndex]);

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <TouchableOpacity onPress={() => onTabPress(index)}>
      <Text
        style={[styles.tabText, index === activeIndex && styles.activeTabText]}>
        {item.name}
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

  },
  arrow: {
    fontSize:15,
    color: '#00A2A2',
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  tabText: {
    width: 'auto',
    textAlign: 'center',
    fontSize: 13,
    color: '#999',
    fontWeight: 'normal',
    marginHorizontal: 10,
  },
  activeTabText: {
    color: '#00A2A2',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
