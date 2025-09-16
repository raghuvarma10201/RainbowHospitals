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
import {MainStackParamList} from '../../../types/navigation';
import PaginationDots from '../../../components/pagination-dots';
import {adjust} from '../../../utils/common-functions';
import {h, pallette, w} from '../../../constants/constants';
import {useApp} from '../../../context/app-context';

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
  const {category} = useApp();

  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [];
  for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
    pages.push(items.slice(i, i + ITEMS_PER_PAGE));
  }

  const navigateToDoctors = async (
    specialityId: number,
    specialityName: string,
  ) => {
    console.log(specialityId);

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

  const renderPage = (page: any, pageIndex: any) => (
    <View key={pageIndex} style={styles.page}>
      {page.map((item: any) => (
        <TouchableOpacity
          key={item.icon_image}
          onPress={() => navigateToDoctors(item.id, item?.name)}>
          <View style={styles.itemContainer}>
            <View
              style={[
                styles.iconBox,
                {
                  borderColor:
                    category?.name == 'Child Care'
                      ? pallette.medium_turquoise
                      : pallette.amethyst,
                  backgroundColor:
                    category?.name == 'Child Care'
                      ? pallette.pale_turquoise
                      : pallette.light_amethyst,
                },
                item.isSpecial && styles.specialItem,
              ]}>
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
              <Text numberOfLines={3} style={styles.itemText}>
                {item.name}
              </Text>
            </View>
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
    width: w * 0.96,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: w * 0.01,
  },
  itemContainer: {
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
  },

  iconBox: {
    width: w * 0.29,
    height: w * 0.39,
    backgroundColor: '#E1F1F2',
    borderWidth: 1.2,
    borderColor: pallette.light_rainbow,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomEndRadius: w * 0,
    borderTopStartRadius: w * 0.05,
    borderBottomStartRadius: w * 0.05,
    borderTopEndRadius: w * 0.05,
    paddingHorizontal: w * 0.01,
    paddingVertical: h * 0.015,
    marginLeft: w * 0.015,
  },
  specialItem: {
    backgroundColor: '#00bcd4',
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
    paddingBottom: h * 0.005,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
});

export default SpecialityGrid;
