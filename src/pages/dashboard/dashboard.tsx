// ---------- MODULE IMPORTS ----------
import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
  FlatList,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
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
import {MainStackParamList} from '../../types/navigation';
import CategorySelection from '../../components/category-selection';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getAppointments} from '../../services/common';
import {ToastService} from '../../utils';
import {upcomingApointment} from '../../utils/types';
import moment from 'moment';

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
  const [appointments, setAppointments] = useState<upcomingApointment[]>([]);
  const [activeAppointmentIndex, setActiveAppointmentIndex] = useState(0);

  const fetchMyAppointments = useCallback(
    async (date: string) => {
      try {
        const mrn = await AsyncStorage.getItem('mrn');
        console.log('Patient MRN ====>', mrn);

        const {data = []} = await getAppointments({
          mrn,
          date,
          OrganisationUID: branch?.organisation?.organisationid.toString(),
        });
        setAppointments(
          data
            .filter((item: upcomingApointment) =>
              moment(item.SlotStartDttm).isSameOrAfter(date, 'day'),
            )
            .sort((a: upcomingApointment, b: upcomingApointment) =>
              moment(a.SlotStartDttm).diff(moment(b.SlotStartDttm)),
            ),
        );
      } catch (error: any) {
        console.error('Error fetching appointments:', error);
        ToastService.error(
          'Error',
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong',
        );
        setAppointments([]);
      }
    },
    [branch],
  );

  useFocusEffect(
    useCallback(() => {
      fetchMyAppointments(moment().format('YYYY-MM-DD'));
    }, [fetchMyAppointments]),
  );

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
          <View style={styles.appointentsContainer}>
            <FlatList
              data={appointments}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item}) => (
                <UpcomingAppointmentCard
                  appointment={item}
                  navigation={navigation}
                />
              )}
              onMomentumScrollEnd={handleScrollEnd}
            />
            {appointments.length > 1 && (
              <PaginationDots
                data={appointments}
                activeIndex={activeAppointmentIndex}
              />
            )}
          </View>
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
  appointentsContainer: {
    marginVertical: h * 0.02,
  },
});
