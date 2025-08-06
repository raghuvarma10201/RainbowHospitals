import { Dimensions, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, } from 'react-native'
import React, { useEffect, useState } from 'react';
import { Card, Searchbar, TextInput, Icon, Text } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import Header from '../components/Header';
import Banners from '../components/Slider';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { getAppointments } from '../services/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
const local_data = [
  {
    value: '1',
    lable: 'location',

  },
  {
    value: '2',
    lable: 'location2',

  },
];

const Dashboard: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('1');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const banners = [
    require('../../assets/images/slide1.png'),
    require('../../assets/images/slide1.png'),
    require('../../assets/images/slide1.png'),
  ];
  const [loading, setLoading] = useState<boolean>(false);
  const [activeindex, setActiveindex] = useState(0);
  const w = Dimensions.get('window').width;
  const h = Dimensions.get('window').height;

  useEffect(() => {
    const today = new Date();
    const formattedToday = moment(today).format('YYYY-MM-DD');
    setSelectedDate(today);
    fetchMyAppointments(formattedToday);
  }, []);

  const navigateTo = (path: keyof MainStackParamList, data : any) => {
    navigation.navigate(path as any, data);
  };


  const fetchMyAppointments = async (date: string) => {
    try {
      setLoading(true);
      const payload = {
        mrn: await AsyncStorage.getItem('mrn'),
        date: date,
      };
      const response = await getAppointments(payload);
      console.log("---------",response);
      const filtered = response.data.filter((item: any) => {
        const slotDate = moment(item.SlotStartDttm).format('YYYY-MM-DD');
        return slotDate >= date;
      });

      const sortedAppointments = filtered.sort((a: any, b: any) => {
        const aTime = moment(a.SlotStartDttm).valueOf();
        const bTime = moment(b.SlotStartDttm).valueOf();
        return aTime - bTime;
      });
      setAppointments(sortedAppointments);
      console.log("---------",sortedAppointments);
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Header showLocation showBack={false} title={'home'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <View style={styles.container}>
          <View style={styles.helloCard}>
            <View style={styles.searchLocationBlock}>
              <View style={styles.searchBlock}>
                <TextInput
                  mode="flat"
                  style={[styles.searchFormInput, { color: 'white', }]}
                  placeholder='search'
                  value={search}
                  onChangeText={setSearch}
                  placeholderTextColor='#fff'
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                  theme={{ colors: { text: 'white', placeholder: 'white', background: 'transparent' } }}
                />
                <Image source={require('../../assets/images/search-icon.png')} style={styles.formInputIcon} />
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
                  activeColor="#fff"
                  onChange={e => setCountry(e.value)}
                />
                <Image source={require('../../assets/images/map-icon.png')} style={styles.formInputIcon} />
              </View>
            </View>

            <View style={styles.textHelloCard}>
              <Text style={{ fontFamily: 'ProximaNovaA-Regular', fontSize: 16, color: '#fff', }}>Hello,</Text>
              <Text style={{ fontFamily: 'ProximaNovaA-Semibold', fontSize: 20, color: '#fff', }}>Amberwati</Text>
              <Text style={{ fontFamily: 'ProximaNovaA-Regular', fontSize: 11, color: '#fff', }}>We are here to help! </Text>
            </View>
          </View>



          <Card.Content style={[styles.upcomingAppBlockcard, { elevation: 0, }]}>
            <View style={styles.row}>
              <Image
                source={require('../../assets/images/doc-img.png')} // replace with actual image
                style={styles.docImage}
              />
              <View style={styles.upcomingAppBlockcontent}>
                <Text style={styles.upcomingAppTitle}> UPCOMING APPOINTMENTS </Text>
                <Text style={{ fontFamily: 'ProximaNovaA-Regular', fontSize: 12, color: '#3C2469', }}>Dr. Ramesh Konanki</Text>
                <Text style={{ fontFamily: 'ProximaNovaA-Regular', fontSize: 8, color: '#3C2469', }}>Senior Consultant - Pediatric Neurologist</Text>
                <Text style={styles.upcomingTime}>THU 10 JUL, 04:27 PM</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 2, }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginRight: 15, }}>
                    <Image source={require('../../assets/images/user-icon.png')} style={{ width: 11, height: 11, marginRight: 1, }} />
                    <Text style={{ fontFamily: 'ProximaNovaA-Regular', fontSize: 11, color: '#3C2469', }}> In Person</Text>
                  </View>
                  <Text style={{ fontFamily: 'ProximaNovaA-Regular', fontSize: 11, color: '#3C2469', }}> #1023456</Text>
                </View>
                <View style={styles.bottomUABlock}>
                  <TouchableOpacity onPress={() => navigation.navigate('DoctorSlots', { doctorId: 1, appointmentType: 'video' })}>
                    <Text style={[styles.rescheduleBt, { fontFamily: 'ProximaNovaA-Regular', fontSize: 11, color: '#fff', }]}>Reschedule</Text>
                  </TouchableOpacity>

                  <TouchableOpacity  >
                    <Text style={{ fontFamily: 'ProximaNovaA-Regular', fontSize: 11, color: '#fff', paddingLeft: 5 }}> Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Card.Content>


          <View style={styles.quickActions}>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigateTo('Specialities',{appointmentType : 'Physical'})}>
              <Image source={require('../../assets/images/physical-consultation-icon.png')} style={styles.iconAction} />
              <Text style={styles.actionText}>Book Physical Consultation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigateTo('Specialities',{appointmentType : 'Video'})}>
              <Image source={require('../../assets/images/video-consultation-icon.png')} style={styles.iconAction} />
              <Text style={styles.actionText}> Book Video Consultation</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigateTo('BookVaccination',{})}>
              <Image source={require('../../assets/images/vaccine-icon.png')} style={styles.iconAction} />
              <Text style={styles.actionText}> Book Vaccination</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.activeActionItem}>
              <Image source={require('../../assets/images/physical-consultation-icon.png')} style={styles.activeIconAction} />
              <Text style={styles.activeActionText}> Book Vaccination</Text>
            </TouchableOpacity> */}


          </View>


          <View style={[styles.quickActions, { justifyContent: 'center', marginTop: 5 }]}>
            <TouchableOpacity style={[styles.actionItem, { marginRight: '5.5%' }]} onPress={() => navigateTo('BookScan',{})}>
              <Image source={require('../../assets/images/book-scan.png')} style={styles.iconAction} />
              <Text style={styles.actionText}> Book Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={() => navigateTo('MedicalRecord',{})}>
              <Image source={require('../../assets/images/view-report.png')} style={styles.iconAction} />
              <Text style={styles.actionText}> View Report </Text>
            </TouchableOpacity>
          </View>
        </View>

        <>
          <Banners
            images={banners}
            activeindex={activeindex}
            setActiveindex={setActiveindex}
            height={h * 0.2}
            resizeMode="cover"
            width={w * 0.95}
            marginVertical={w * 0.01}
          />
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: h * 0.02,
            }}>
            {banners?.map((banner, index) => (
              <View
                style={{
                  height: 8,
                  width: 8,
                  borderRadius: 5,
                  backgroundColor: index == activeindex ? '#00B3AE' : 'grey',
                  marginHorizontal: w * 0.01,
                }}
                key={index}
              />
            ))}
          </View>
        </>

      </ScrollView>

      <View style={styles.footerCall}>
        <TouchableOpacity style={styles.footerCallButton}>
          <View style={styles.footerCallButtonIcon}>
            <Image source={require('../../assets/images/call-icon.png')} style={styles.footerCallButtonIconImage} />
          </View>
          <Text style={styles.footerCallButtonText}>Call</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

export default Dashboard

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
    // marginTop: StatusBar.currentHeight
  },

  scrollContent: {
    padding: 0,
    paddingBottom: 100, // space so content doesn't hide behind footer
  },

  container: {
    flex: 1,
    paddingBottom: 10,
    paddingTop: 0,
    paddingHorizontal: 10,
  },

  //Header
  header: {
    backgroundColor: '#3C2871',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },


  profileIconBlock: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },

  headerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  //Header End


  helloCard: {
    backgroundColor: '#00B3AE',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,

    marginTop: 10,
  },

  searchLocationBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBlock: {
    height: 44,
    backgroundColor: '#4CC2BF',
    borderRadius: 100,
    paddingRight: 10,
    marginTop: 0,
    fontSize: 15,
    fontWeight: 400,
    color: '#fff',
    fontFamily: 'ProximaNovaA-Regular',

  },

  searchFormInput: {
    height: 44,
    borderWidth: 0,
    borderRadius: 100,
    paddingRight: 20,
    paddingLeft: 15,
    marginTop: 0,
    fontSize: 13,
    fontWeight: 400,
    color: '#fff',
    backgroundColor: 'transparent',
    fontFamily: 'ProximaNovaA-Regular',
    width: Dimensions.get('window').width * 0.4,

  },

  formInputIcon: {
    width: 16,
    height: 16,
    position: 'absolute',
    top: 14,
    left: 10,
    tintColor: '#fff',
  },

  //

  dropdownSelect: {
    height: 30,
    paddingHorizontal: 10,
    paddingLeft: 30,
    marginTop: 5,
    color: '#fff',
    width: Dimensions.get('window').width * 0.4,

  },

  placeholderCountry: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 13,
    color: '#fff',
  },
  selectedTextContry: {
    fontSize: 13,
    color: '#fff',

  },

  dropdownList: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 13,
    marginLeft: 0,
    marginRight: 5,
    padding: 0,
    textAlign: 'left',
  },

  textHelloCard: {
    marginTop: 15,
    paddingHorizontal: 20,
  },



  // upcomingAppBlockcard

  // upcomingAppBlock:{
  //     flex:1,

  //        marginTop:10,
  //        backgroundColor:'#E2DEEF',
  //        borderRadius:10,
  //        paddingHorizontal:10,
  //        paddingBottom:10,

  //      },
  leftUABlock: {
    width: 110,
    height: 110,
    backgroundColor: '#fff',
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: 40,
    marginBottom: -50,
    marginRight: 10,
  },
  rightUABlock: {

  },

  rightUABlockInner: {
    width: Dimensions.get('window').width * 0.75,
    backgroundColor: 'red',
  },
  bottomUABlock: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#3C2871',
    padding: 7,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: 10,
    marginBottom: -50,
    textAlign: 'center',
    marginHorizontal: 10,
  },

  upcomingAppTitle: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#3C2871',
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 0,
    marginTop: -10,
    marginBottom: 7,
    textAlign: 'center',


  },

  upcomingTime: {
    fontFamily: 'ProximaNovaA-Regular', fontSize: 11, backgroundColor: '#fff', color: '#3C2469',
    textAlign: 'center',
    padding: 4,
    marginVertical: 7,
    borderRadius: 4,
  },

  upcomingAppBlockcard: {
    flex: 1,
    marginTop: 16,
    marginBottom: 16,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#EFEAF6',
    marginHorizontal: 2,
    elevation: 0,
    borderWidth: 0,

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docImage: {
    width: 110,
    height: 110,
    borderRadius: 100,
    marginRight: 12,
    marginTop: 40,
    marginBottom: -40,

  },
  upcomingAppBlockcontent: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 7,
  },

  rescheduleBt: { borderRightWidth: 1, borderColor: '#4CC2BF', paddingEnd: 10, },
  // upcomingAppBlockcard End



  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 30,

  },

  actionItem: {
    backgroundColor: '#B7E1E0',
    borderRadius: 10,
    padding: 10,
    paddingTop: 15,
    alignItems: 'center',
    width: '30%',
    marginVertical: 10,
  },




  iconAction: {
    width: 40,
    height: 40,
  },


  actionText: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },

  activeActionItem: {
    backgroundColor: '#3C2871',
    borderRadius: 10,
    padding: 10,
    paddingTop: 15,
    alignItems: 'center',
    width: '30%',
    marginVertical: 10,
  },

  activeActionText: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
  },
  activeIconAction: {
    width: 40,
    height: 40,
    tintColor: '#fff',
  },
  //   footer
  footerCall: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,

    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 0,
  },
  footerCallButton: {
    position: 'relative',
    color: '#fff',
    alignItems: 'center',
    paddingVertical: 10,
    width: 100,
    height: 45,
    backgroundColor: '#00B3AE',

    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'ProximaNovaA-Regular',
    fontWeight: 'bold',


  },
  footerCallButtonText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'ProximaNovaA-Regular',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingTop: 8,
  },

  footerCallButtonIcon: {
    backgroundColor: '#3C2871',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#fff',
    width: 30,
    height: 30,
    position: 'absolute',
    top: -15,
    left: 35,


    justifyContent: 'center',
    alignItems: 'center',
  },
  footerCallButtonIconImage: {
    width: 15,
    height: 15,
  },

})