import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {TextInput, Text} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import Header from '../components/Header';
import Banners from '../components/Slider';
import moment from 'moment';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../navigation/types';
import {getAppointments} from '../services/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {upcomingApointment} from '../utils/types';
import {h, pallette, w} from '../Constants/Constant';
import QuickActions from '../components/QuickActions';
import UpcomingAppointmentCard from '../components/UpcomingAppointmentCard';
import {useApp} from '../context/AppContext';
import {ToastService} from '../utils/ToastService';

const local_data = [
  {value: '1', lable: 'location'},
  {value: '2', lable: 'location2'},
];

const images = {
  banner: require('../../assets/images/slide1.png'),
  search: require('../../assets/images/search-icon.png'),
  location: require('../../assets/images/map-icon.png'),
  call: require('../../assets/images/call-icon.png'),
};
const banners = Array(3).fill(images.banner);

const Dashboard: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('1');
  const [appointments, setAppointments] = useState<upcomingApointment[]>([]);
  const {profile} = useApp();
  const [activeindex, setActiveindex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      fetchMyAppointments(moment().format('YYYY-MM-DD'));
    }, []),
  );

  const fetchMyAppointments = async (date: string) => {
    try {
      const mrn = await AsyncStorage.getItem('mrn');
      const {data = []} = await getAppointments({mrn, date});
      setAppointments(
        data
          .filter((item: upcomingApointment) =>
            moment(item.SlotStartDttm).isSameOrAfter(date, 'day'),
          )
          .sort((a: upcomingApointment, b: upcomingApointment) =>
            moment(a.SlotStartDttm).diff(moment(b.SlotStartDttm)),
          ),
      );
    } catch {
      ToastService.error('Error', 'Unable to fetch upcoming appointments');
      setAppointments([]);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header showLocation showBack={false} title="home" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <View style={styles.helloCard}>
            <View style={styles.searchLocationBlock}>
              <View style={styles.searchBlock}>
                <TextInput
                  mode="flat"
                  style={styles.searchFormInput}
                  placeholder="search"
                  value={search}
                  onChangeText={setSearch}
                  placeholderTextColor={pallette.white}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  theme={{
                    colors: {
                      text: 'white',
                      placeholder: 'white',
                      background: 'transparent',
                    },
                  }}
                />
                <Image source={images.search} style={styles.formInputIcon} />
              </View>
              <View style={styles.searchBlock}>
                <Dropdown
                  style={styles.dropdownSelect}
                  selectedTextStyle={styles.selectedTextContry}
                  placeholderStyle={styles.placeholderCountry}
                  maxHeight={200}
                  value={country}
                  data={local_data}
                  valueField="value"
                  labelField="lable"
                  placeholder="Select Location"
                  containerStyle={styles.dropdownList}
                  activeColor={pallette.white}
                  onChange={e => setCountry(e.value)}
                />
                <Image source={images.location} style={styles.formInputIcon} />
              </View>
            </View>
            <View style={styles.textHelloCard}>
              <Text style={styles.helloSmall}>Hello,</Text>
              <Text style={styles.helloName}>{profile?.PatientName}</Text>
              <Text style={styles.helloSmall}>We are here to help!</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled>
            {appointments.map((appointment, index) => (
              <UpcomingAppointmentCard
                key={index}
                appointment={appointment}
                navigation={navigation}
              />
            ))}
          </ScrollView>
          <QuickActions navigation />
        </View>
        <Banners
          images={banners}
          activeindex={activeindex}
          setActiveindex={setActiveindex}
          height={h * 0.2}
          resizeMode="cover"
          width={w * 0.95}
          marginVertical={w * 0.01}
        />
        <View style={styles.bannerDots}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeindex && {backgroundColor: pallette.app_green},
              ]}
            />
          ))}
        </View>
      </ScrollView>
      <View style={styles.footerCall}>
        <TouchableOpacity style={styles.footerCallButton}>
          <View style={styles.footerCallButtonIcon}>
            <Image
              source={images.call}
              style={styles.footerCallButtonIconImage}
            />
          </View>
          <Text style={styles.footerCallButtonText}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: pallette.white,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: h * 0.08,
  },
  container: {
    flex: 1,
    paddingHorizontal: w * 0.02,
  },
  helloCard: {
    backgroundColor: pallette.app_green,
    borderRadius: w * 0.03,
    paddingVertical: h * 0.02,
    paddingHorizontal: w * 0.03,
    marginTop: h * 0.01,
  },
  searchLocationBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  searchBlock: {
    height: h * 0.05,
    backgroundColor: pallette.app_medium_green,
    borderRadius: w * 0.1,
    paddingHorizontal: w * 0.02,
    justifyContent: 'center',
  },
  searchFormInput: {
    height: h * 0.05,
    borderRadius: w * 0.1,
    paddingLeft: w * 0.03,
    fontSize: 13,
    color: pallette.white,
    backgroundColor: 'transparent',
    fontFamily: 'ProximaNovaA-Regular',
    width: w * 0.4,
  },
  formInputIcon: {
    width: w * 0.04,
    height: h * 0.02,
    position: 'absolute',
    left: w * 0.03,
    tintColor: pallette.white,
  },
  dropdownSelect: {
    height: h * 0.02,
    paddingLeft: w * 0.07,
    width: w * 0.4,
  },
  placeholderCountry: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 13,
    color: pallette.white,
  },
  selectedTextContry: {
    fontSize: 13,
    color: pallette.white,
  },
  dropdownList: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 13,
    marginLeft: 0,
    marginRight: 5,
    padding: 0,
    textAlign: 'right',
  },
  textHelloCard: {
    marginTop: h * 0.02,
    paddingHorizontal: w * 0.03,
  },
  helloSmall: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 16,
    color: pallette.white,
  },
  helloName: {
    fontFamily: 'ProximaNovaA-Semibold',
    fontSize: 20,
    color: pallette.white,
  },
  footerCall: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerCallButton: {
    alignItems: 'center',
    paddingVertical: 10,
    width: w * 0.25,
    height: h * 0.06,
    backgroundColor: pallette.app_green,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  footerCallButtonText: {
    color: pallette.white,
    fontSize: 13,
    fontFamily: 'ProximaNovaA-Regular',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingTop: 8,
  },
  footerCallButtonIcon: {
    backgroundColor: pallette.app_purple,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: pallette.white,
    width: w * 0.1,
    height: w * 0.1,
    position: 'absolute',
    top: -(h * 0.025),
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerCallButtonIconImage: {
    width: w * 0.05,
    height: w * 0.05,
  },
  bannerDots: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: h * 0.02,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 5,
    backgroundColor: pallette.dark_grey,
    marginHorizontal: w * 0.01,
  },
});
