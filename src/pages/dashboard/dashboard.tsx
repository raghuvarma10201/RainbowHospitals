// ---------- MODULE IMPORTS ----------
import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// ---------- COMPONENT IMPORTS ----------
import {QuickActions} from '.';
import {
  Header,
  Banners,
  PaginationDots,
  SearchLocationBlock,
  Footer,
} from '../../components';

// ---------- OTHER IMPORTS ----------
import {useApp} from '../../context/app-context';
import {h, pallette, w} from '../../constants/constants';
import {MainStackParamList} from '../../types/navigation';
import CategorySelection from '../../components/category-selection';

// ---------- STATIC DATA OUTSIDE COMPONENT ----------
const images = {
  women_banner: require('../../../assets/images/womancare-img.png'),
  child_banner: require('../../../assets/images/childcare-img.png'),
  fertility_banner: require('../../../assets/images/fertilitycare-img.png'),
  search: require('../../../assets/images/search-icon.png'),
  location: require('../../../assets/images/map-icon.png'),
  call: require('../../../assets/images/call-icon.png'),
  childCare: require('../../../assets/images/birth-icon.png'),
};

// ---------- COMPONENT ----------
const Dashboard: React.FC = () => {
  // ---------- STATE AND CONTEXT DECLARATION ----------
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {branch, category} = useApp();
  const banners = Array(3).fill(
    category?.name == 'Child Care'
      ? images.child_banner
      : category?.name == 'Women Care'
      ? images.women_banner
      : images.fertility_banner,
  );
  const [activeindex, setActiveindex] = useState(0);

  // ---------- RENDER ----------
  return (
    <View style={styles.mainContainer}>
      {/* COMMON HEADER */}
      <Header showLocation showBack={false} title="home" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageBackground
          source={require('../../../assets/images/bottombg.png')}
          style={{
            height: h * 0.4,
            width: '100%',
            position: 'absolute',
            bottom: -(h * 0.1),
            right: 0,
            left: 0,
          }}
          resizeMode="cover"
        />
        <View style={styles.container}>
          <SearchLocationBlock style={styles.searchLocationBlock} />
          <CategorySelection />
          <QuickActions navigation={navigation} />
          <Banners
            images={banners}
            activeindex={activeindex}
            setActiveindex={setActiveindex}
            height={h * 0.35}
            width={w * 0.96}
            itemWidth={w * 0.8}
            resizeMode={'cover'}
          />
          <PaginationDots data={banners} activeIndex={activeindex} />
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default Dashboard;

// ---------- STYLES ----------
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: pallette.white,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: h * 0.09,
  },
  container: {
    flex: 1,
    paddingHorizontal: w * 0.02,
  },
  searchLocationBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: h * 0.02,
    width: w * 0.9,
    alignSelf: 'center',
  },
});
