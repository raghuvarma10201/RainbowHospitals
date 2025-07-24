import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Card,
  Searchbar,
  TextInput,
  Icon,
  Text,
  Banner,
  Modal,
  Portal,
} from 'react-native-paper';
import {Dropdown} from 'react-native-element-dropdown';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../App';
import {getDoctors, getSpecialities} from '../services/common';
import {ToastService} from '../utils/ToastService';
import {IMG_BASE_URL} from '../utils/environment';

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

const doctors = [
  {
    name: 'Dr. Ramesh K',
    designation: 'Senior Consultant',
    speciality: 'Neurology',
    image: require('../../assets/images/doc-img.png'),
  },
  {
    name: 'Dr. Sirisha R',
    designation: 'Senior Consultant',
    speciality: 'Cardiology',
    image: require('../../assets/images/doc-img-2.jpg'),
  },
  {
    name: 'Dr. Prashant B',
    designation: 'Senior Consultant',
    speciality: 'Pulmonology',
    image: require('../../assets/images/doc-img-3.jpg'),
  },
];

const DoctorsList: React.FC<any> = ({route}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {specialityId, appointmentType} = route.params;
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('1');
  const banners = [
    require('../../assets/images/slide1.png'),
    require('../../assets/images/slide1.png'),
    require('../../assets/images/slide1.png'),
  ];
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadDoctors();
  }, []);

  const navigateTo = (path: keyof MainStackParamList, params: any) => {
    navigation.navigate(path, params);
  };

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const response = await getDoctors(
        '',
        specialityId,
        '',
        '',
        appointmentType,
        1,
        10,
      );
      if (response && response.status == 200) {
        setLoading(false);
        setDoctors(response.data.doctors);
      } else {
        setLoading(false);
        ToastService.error('Error', response.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Failed to load Doctors:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.mainContainer}>
         <Header showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
     
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/doctors-list-img.png')}
            style={styles.banner}
          />
          <View style={styles.searchLocationBlock}>
            <View style={styles.searchBlock}>
              <TextInput
                mode="flat"
                style={[styles.searchFormInput, {color: 'white'}]}
                placeholder="search"
                value={search}
                onChangeText={setSearch}
                placeholderTextColor="#fff"
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
              <Image
                source={require('../../assets/images/search-icon.png')}
                style={styles.formInputIcon}
              />
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
              <Image
                source={require('../../assets/images/map-icon.png')}
                style={styles.formInputIcon}
              />
            </View>
          </View>
          <View style={styles.doctorsListContainer}>
            {doctors.map((doctor, index) => (
              <View key={index} style={styles.doctorContainer}>
                <Image
                  source={
                    doctor.small_image
                      ? {uri: `${IMG_BASE_URL}${doctor.small_image}`}
                      : {
                          uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png',
                        }
                  }
                  style={styles.doctorImg}
                />
                <View>
                  <Text style={[styles.docName, {color: '#4CC2BF', fontFamily:'ProximaNovaA-Semibold', marginBottom:2}]}>
                    {doctor?.name}
                  </Text>
                  <Text style={[styles.docName, {fontSize: 11, fontFamily:'ProximaNovaA-Regular',}]}>
                    {doctor?.designation}
                  </Text>
                  <Text
                    style={[styles.docName, {fontSize: 11, fontFamily:'ProximaNovaA-Regular',}]}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {doctor?.doctor_specialities[0].speciality.name}
                  </Text>
                  <Text
                    style={[styles.docName, {fontSize: 12, fontFamily:'ProximaNovaA-Regular', color: '#4CC2BF', marginTop:2}]}>
                    {`Experience 15 Years`}
                  </Text>
                  <TouchableOpacity
                    style={[styles.payBtn, {backgroundColor: '#3C2871'}]}>
                    <Text style={styles.payBtnTxt}>Book Appointment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default DoctorsList;

const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
  },

  scrollContent: {
    padding: 0,
    paddingBottom: 100,
  },

  container: {
    flex: 1,
    paddingBottom: 10,
    paddingTop: 0,
  },
  banner: {
    height: h * 0.29,
    width: '100%',
    resizeMode: 'contain',
  },
  searchLocationBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
    top: h * 0.2,
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
  doctorsListContainer: {
   paddingHorizontal:15,
  },
  doctorContainer: {
    width: '70%',
    paddingVertical: h * 0.01,
    marginTop: h * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
    gap: w * 0.05,
  },
  doctorImg: {
    height: h * 0.12,
    width: h * 0.12,
    resizeMode: 'cover',
    borderRadius: w,
   borderWidth:1,
   borderColor:'#E2EDEC',
  },
  docName: {
    fontSize: 11,
    color: '#000',

  },
  payBtn: {
  paddingVertical:5,
  paddingHorizontal:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:50,
    maxWidth: w * 0.4,
    marginTop:10,
  },
  payBtnTxt: {
    fontSize: 12, 
    color: '#fff',
    fontFamily:'ProximaNovaA-Regular',
  },
});
