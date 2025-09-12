// ---------- MODULE IMPORTS ----------
import React, {useCallback, useState} from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
} from 'react-native';
import {Text} from 'react-native-paper';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// ---------- COMPONENT IMPORTS ----------
import {QuickActions, UpcomingAppointmentCard} from '.';
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
import {getAppointments} from '../../services/common';
import {MainStackParamList} from '../../types/navigation';
import {ToastService} from '../../utils/service-handlers';
import {upcomingApointment} from '../../utils/types';
import {adjust} from '../../utils/common-functions';
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
    category == 'Child Care'
      ? images.child_banner
      : category == 'Women Care'
      ? images.women_banner
      : images.fertility_banner,
  );
  const [appointments, setAppointments] = useState<upcomingApointment[]>([]);
  const [activeindex, setActiveindex] = useState(0);
  const [activeAppointmentIndex, setActiveAppointmentIndex] = useState(0);

  // ---------- CALLBACKS ----------
  const fetchMyAppointments = useCallback(
    async (date: string) => {
      try {
        const mrn = await AsyncStorage.getItem('mrn');
        const {data = []} = await getAppointments({
          mrn,
          date,
          OrganisationUID: branch?.organisation?.organisationid.toString(),
        });
        console.log(data);

        setAppointments(
          data
            .filter((item: upcomingApointment) =>
              moment(item.SlotStartDttm).isSameOrAfter(date, 'day'),
            )
            .sort((a: upcomingApointment, b: upcomingApointment) =>
              moment(a.SlotStartDttm).diff(moment(b.SlotStartDttm)),
            ),
        );
      } catch (err) {
        console.error('Error fetching appointments:', err);
        ToastService.error('Error', 'Unable to fetch upcoming appointments');
        setAppointments([]);
      }
    },
    [branch],
  );

  // ---------- LIFECYCLE ----------
  useFocusEffect(
    useCallback(() => {
      fetchMyAppointments(moment().format('YYYY-MM-DD'));
    }, [fetchMyAppointments]),
  );

  // ---------- EVENT HANDLERS ----------
  const handleScrollEnd = useCallback((event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / w);
    setActiveAppointmentIndex(newIndex);
  }, []);

  // ---------- RENDER ----------
  return (
    <View style={styles.mainContainer}>
      {/* COMMON HEADER */}
      <Header showLocation showBack={false} title="home" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <SearchLocationBlock style={styles.searchLocationBlock} />
          <CategorySelection />
          <QuickActions navigation={navigation} />
          <Banners
            images={banners}
            activeindex={activeindex}
            setActiveindex={setActiveindex}
            height={h * 0.3}
            width={w * 0.96}
            itemWidth={w * 0.7}
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
    width: w * 0.8,
    alignSelf: 'center',
  },
});
