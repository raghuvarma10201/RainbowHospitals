import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import {gridData} from '../Constants/data';

const {width} = Dimensions.get('window');
const ITEMS_PER_PAGE = 9;

// const data = Array.from({ length: 27 }, (_, i) => ({
//   id: `${i}`,
//   title: `Pediatric ${i + 1}`,
//   // Placeholder icon, replace with actual icons or require('...') paths
//   icon: 'https://via.placeholder.com/50x50.png?text=Icon',
//   isSpecial: i === 4 // Just for demo (the teal-colored one in your screenshot)
// }));

const data = gridData;

const PaginatedGrid = () => {
  const scrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [];
  for (let i = 0; i < data.length; i += ITEMS_PER_PAGE) {
    pages.push(data.slice(i, i + ITEMS_PER_PAGE));
  }

  const handleScroll = (event: any) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(pageIndex);
  };

  const renderPage = (page: any, pageIndex: any) => (
    <View key={pageIndex} style={styles.page}>
      {page.map((item: any) => (
        <View key={item.id} style={styles.itemContainer}>
          <View style={[styles.iconBox, item.isSpecial && styles.specialItem]}>
            <Image source={item.img} style={styles.icon} />
          </View>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
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
    width: width * 0.8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  itemContainer: {
    width: width / 4,
    alignItems: 'center',
    marginVertical: 12,
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
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  itemText: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
    width: '50%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
