import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {IMG_BASE_URL} from '../../../utils/enums';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../../navigation/types';
import PaginationDots from '../../../components/pagination-dots';
import {adjust} from '../../../utils/common-functions';
import {pallette, w} from '../../../constants/constants';

const ITEMS_PER_PAGE = 9;

export interface ItemsProps {
  items: any[];
  type: string;
}
const SpecialityGrid: React.FC<ItemsProps> = ({items, type}) => {
  type AppNavigationProp = NativeStackNavigationProp<
    MainStackParamList,
    'DoctorsList'
  >;
  const navigation = useNavigation<AppNavigationProp>();

  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [];
  for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
    pages.push(items.slice(i, i + ITEMS_PER_PAGE));
  }

  const navigateToDoctors = async (specialityId: number) => {
    navigation.navigate('DoctorsList', {
      specialityId: specialityId,
      appointmentType: type,
    });
  };

  const handleScroll = (event: any) => {
    const pageIndex = Math.round(
      event.nativeEvent.contentOffset.x / (w * 0.95),
    );
    setCurrentPage(pageIndex);
  };

  const renderPage = (page: any, pageIndex: any) => (
    <View key={pageIndex} style={styles.page}>
      {page.map((item: any) => (
        <TouchableOpacity
          key={item.icon_image}
          onPress={() => navigateToDoctors(item.id)}>
          <View style={styles.itemContainer}>
            <View
              style={[styles.iconBox, item.isSpecial && styles.specialItem]}>
              <Image
                source={
                  item.icon_image
                    ? {uri: `${IMG_BASE_URL}${item.icon_image}`}
                    : {
                        uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png',
                      }
                }
                style={styles.icon}
              />
            </View>
            <Text style={styles.itemText}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
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
      {/* Pagination dots */}
      <PaginationDots data={pages} activeIndex={currentPage} />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: w * 0.95,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  itemContainer: {
    width: w * 0.25,
    alignItems: 'center',
    marginVertical: 10,
  },
  iconBox: {
    width: w * 0.15,
    height: w * 0.15,
    backgroundColor: pallette.dark_purple,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialItem: {
    backgroundColor: '#00bcd4',
  },
  icon: {
    width: 40,
    height: 40,
    tintColor: 'white',
  },
  itemText: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: adjust(10),
    color: pallette.black,
    width: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
});

export default SpecialityGrid;
