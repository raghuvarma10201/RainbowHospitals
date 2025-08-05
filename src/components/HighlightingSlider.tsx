import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  ViewStyle,
  Text,
  TouchableOpacity,
} from 'react-native';
import {IMG_BASE_URL} from '../utils/environment';
import FastImage from 'react-native-fast-image';

const {width: screenWidth} = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.4;
const SPACER_WIDTH = (screenWidth - ITEM_WIDTH) / 2;
const AUTO_SCROLL_INTERVAL = 3000;

const Highlight = ({
  doctors,
  activeindex,
  setActiveindex,
  height,
  autoScrollEnabled = true,
  nav,
}: {
  doctors: any;
  activeindex: number;
  setActiveindex: (index: number) => void;
  height: number;
  autoScrollEnabled?: boolean;
  nav: any;
}) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollIndex = useRef(activeindex);

  const [data, setData] = useState<any>([]);

  useEffect(() => {
    // Add spacers to both ends
    //console.log(doctors);
    setData([{key: 'left-spacer'}, ...doctors, {key: 'right-spacer'}]);
  }, [doctors]);

  useEffect(() => {
    if (!autoScrollEnabled || doctors.length === 0) return;

    const autoScroll = setInterval(() => {
      scrollIndex.current = (scrollIndex.current + 1) % doctors.length;
      flatListRef.current?.scrollToOffset({
        offset: (scrollIndex.current + 1) * ITEM_WIDTH,
        animated: true,
      });
      setActiveindex(scrollIndex.current);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(autoScroll);
  }, [doctors, autoScrollEnabled]);

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

    return (
      <Animated.View style={[{transform: [{scale}], opacity}]}>
        <TouchableOpacity
          onPress={() =>
            nav('DoctorSlots', {doctorId: item.id, appointmentType: 'video'})
          }
          style={styles.itemContainer}>
          <FastImage
            source={
              item?.small_image
                ? {uri: `${IMG_BASE_URL}${item?.small_image}`, priority: 'high'}
                : {
                    uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png',
                    priority: 'high',
                  }
            }
            style={[styles.banner, {height, width: ITEM_WIDTH}]}
            resizeMode="cover"
          />
          <View style={styles.doctorDetails}>
            <Text style={styles.docName}>{item?.name}</Text>
            <Text style={[styles.docName, {fontSize: 12}]}>
              {item?.designation}
            </Text>
            <Text
              style={[
                styles.docName,
                {fontSize: 10, fontFamily: 'ProximaNovaA-Regular'},
              ]}>
              {item?.speciality}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={data}
      keyExtractor={(_, index) => 'qq' + '' + index.toString()}
      renderItem={renderItem}
      horizontal
      scrollEnabled={true}
      showsHorizontalScrollIndicator={false}
      snapToInterval={ITEM_WIDTH}
      decelerationRate="fast"
      bounces={false}
      onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
        useNativeDriver: true,
      })}
      onMomentumScrollEnd={event => {
        const index = Math.round(
          event.nativeEvent.contentOffset.x / ITEM_WIDTH,
        );
        const adjustedIndex = Math.max(0, index - 1); // account for spacer
        scrollIndex.current = adjustedIndex;
        setActiveindex(adjustedIndex);
      }}
    />
  );
};

export default Highlight;

const styles = StyleSheet.create({
  itemContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3C2871',
    borderRadius: 10,
    marginTop: 10,
  },
  banner: {},
  doctorDetails: {
    padding: 8,
    backgroundColor: '#3C2871',
    width: ITEM_WIDTH,
  },
  docName: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'ProximaNovaA-Semibold',
  },
});
