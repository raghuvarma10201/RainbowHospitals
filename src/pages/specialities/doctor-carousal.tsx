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
import {IMG_BASE_URL} from '../../utils/environment';
import FastImage from 'react-native-fast-image';
import {pallette} from '../../Constants/Constant';
import {routes} from '../../utils/enums';
import {adjust, navigateTo} from '../../utils/commonFunctions';
import {MainStackParamList} from '../../navigation/types';

const {width: screenWidth} = Dimensions.get('window');
const ITEM_WIDTH = screenWidth * 0.4;
const SPACER_WIDTH = (screenWidth - ITEM_WIDTH) / 2;
const AUTO_SCROLL_INTERVAL = 3000;

const DoctorCarousal = ({
  doctors,
  activeindex,
  setActiveindex,
  height,
  autoScrollEnabled = true,
  nav,
  type,
  organizationId,
}: {
  doctors: any;
  activeindex: number;
  setActiveindex: (index: number) => void;
  height: number;
  autoScrollEnabled?: boolean;
  nav: any;
  type: string;
  organizationId: string | undefined;
}) => {
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollIndex = useRef(activeindex);

  const [data, setData] = useState<any>([]);

  useEffect(() => {
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
            navigateTo(nav, routes.DoctorSlots as keyof MainStackParamList, {
              doctorId: item.id,
              appointmentType: type,
              OrganisationID: organizationId,
            })
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
            style={[styles.banner, {height}]}
            resizeMode="cover"
          />
          <View style={styles.doctorDetails}>
            <Text style={styles.docName}>{item?.name}</Text>
            <Text style={[styles.docName, {fontSize: adjust(10)}]}>
              {item?.designation}
            </Text>
            <Text
              style={[
                styles.docName,
                {fontSize: adjust(9), fontFamily: 'ProximaNovaA-Regular'},
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

export default DoctorCarousal;

const styles = StyleSheet.create({
  itemContainer: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: pallette.app_purple,
    borderRadius: 10,
    marginTop: 10,
  },
  banner: {
    width: ITEM_WIDTH,
  },
  doctorDetails: {
    padding: 8,
    backgroundColor: pallette.app_purple,
    width: ITEM_WIDTH,
  },
  docName: {
    fontSize: adjust(12),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Semibold',
  },
});
