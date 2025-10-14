import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {API_IMG_URL} from '../../../utils/enums';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../../types/navigation';
import PaginationDots from '../../../components/pagination-dots';
import {adjust} from '../../../utils/common-functions';
import {h, pallette, w} from '../../../constants/constants';
import {useApp} from '../../../context/app-context';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // ✅ For pin icon

const ITEMS_PER_PAGE = 9;

export interface ItemsProps {
  items: any[];
  type: string;
  onPinPress?: (item: any) => void; // ✅ new optional callback
}

const SpecialityGrid: React.FC<ItemsProps> = ({items, type, onPinPress}) => {
  type AppNavigationProp = NativeStackNavigationProp<
    MainStackParamList,
    'DoctorsList'
  >;
  const navigation = useNavigation<AppNavigationProp>();
  const {category} = useApp();

  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [];
  for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
    pages.push(items.slice(i, i + ITEMS_PER_PAGE));
  }

  const navigateToDoctors = (specialityId: number, specialityName: string) => {
    navigation.navigate('DoctorsList', {
      specialityId: specialityId,
      specialityName: specialityName,
      appointmentType: type,
    });
  };

  const handleScroll = (event: any) => {
    const pageIndex = Math.round(
      event.nativeEvent.contentOffset.x / (w * 0.96),
    );
    setCurrentPage(pageIndex);
  };

  const renderPage = (page: any, pageIndex: number) => (
    <View key={pageIndex} style={styles.page}>
      {page.map((item: any) => (
        <View key={item.id} style={styles.itemContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigateToDoctors(item.id, item.name)}>
            <View
              style={[
                styles.iconBox,
                {
                  borderColor:
                    category?.name === 'Child Care'
                      ? pallette.medium_turquoise
                      : pallette.amethyst,
                  backgroundColor:
                    category?.name === 'Child Care'
                      ? pallette.pale_turquoise
                      : pallette.light_amethyst,
                },
                item.isFavourite && styles.pinnedHighlight,
              ]}>
              {/* ✅ Pin Icon */}
              <TouchableOpacity
                style={styles.pinButton}
                onPress={() => onPinPress && onPinPress(item)}>
                <Icon
                  name={item.isFavourite ? 'pin' : 'pin-outline'}
                  size={20}
                  color={item.isFavourite ? pallette.red : pallette.black}
                  style={styles.pinIcon} // ✅ added style here
                />
              </TouchableOpacity>

              {/* Image */}
              <FastImage
                source={{uri: item.icon_image}}
                style={styles.icon}
                resizeMode="contain"
              />

              <Text numberOfLines={3} style={styles.itemText}>
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View>
      <View>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}>
          {pages.map((page, index) => renderPage(page, index))}
        </ScrollView>
        <PaginationDots data={pages} activeIndex={currentPage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: w * 0.96,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: w * 0.01,
  },
  itemContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  iconBox: {
    width: w * 0.29,
    height: w * 0.39,
    borderWidth: 1.2,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: w * 0.05,
    paddingHorizontal: w * 0.01,
    paddingVertical: h * 0.015,
    marginLeft: w * 0.015,
    position: 'relative', // ✅ required for absolute pin
  },
  icon: {
    width: w * 0.2,
    height: w * 0.2,
    tintColor: pallette.dark_purple,
  },
  itemText: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: adjust(10),
    color: pallette.black,
    width: '100%',
  },
  pinButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 10,
    padding: 4,
  },
  pinIcon: {
    transform: [{rotate: '45deg'}], // ✅ rotation here
  },
  pinnedHighlight: {
    borderColor: pallette.red,
    backgroundColor: '#FFF6DA',
  },
});

export default SpecialityGrid;
