import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {gridData} from '../Constants/data';
import {IMG_BASE_URL} from '../utils/environment';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../navigation/types';

const {width} = Dimensions.get('window');
const ITEMS_PER_PAGE = 9;

const data = gridData;

export interface ItemsProps {
  items: [];
}
const PaginatedGrid: React.FC<ItemsProps> = ({items}) => {
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
      appointmentType: 'video',
    });
  };

  const handleScroll = (event: any) => {
    const pageIndex = Math.round(
      event.nativeEvent.contentOffset.x / (width * 0.8),
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
      <View style={styles.paginationContainer}>
        {pages.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentPage === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    width: width * 0.95,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  itemContainer: {
    width: width / 4,
    alignItems: 'center',
    marginVertical: 10,
  },
  iconBox: {
    width: 60,
    height: 60,
    backgroundColor: '#4527a0',
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
    fontSize: 12,
    color: '#333',
    width: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4527a0',
  },
});

export default PaginatedGrid;
