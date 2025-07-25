import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CommonHeader from '../components/Header';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Footer from '../components/Footer';
import DynamicWeekWithMonth from '../components/WeeklyCalender';
import {useNavigation} from '@react-navigation/native';
import {MainStackParamList} from '../../App';
import { getDoctorDetail, getDoctors } from '../services/common';
import { ToastService } from '../utils/ToastService';
import { IMG_BASE_URL } from '../utils/environment';

const DoctorSlots: React.FC<any> = ({route}) => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {doctorId, appointmentType} = route.params;

  const [doctorDetail, setDoctorDetail] = useState<any>([]);
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
      const response = await getDoctorDetail(doctorId);
      console.log(response.data);
      if (response && response.status == 200) {
        setLoading(false);
        setDoctorDetail(response.data);
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
  const doctor = route?.params;
  const availabletimings = ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'];
  console.log(doctor);





  return (
    <View style={styles.mainContainer}>
        <CommonHeader showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
      
        <View style={styles.doctorDetailsContainer}>
          <View style={styles.doctorImgContainer}>
            <Image
              source={doctorDetail.small_image
                                  ? {uri: `${IMG_BASE_URL}${doctorDetail.small_image}`}
                                  : {
                                      uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png',
                                    }}
              style={styles.docImg}
            />
            <View style={styles.dotContainer}>
              <View style={styles.dot} />
            </View>
          </View>
          <View style={styles.doctorDetails}>
            <Text style={[styles.docName, {fontSize: 16, color: '#4CC2BF', fontFamily: 'ProximaNovaA-Semibold'}]}>
              {doctor?.name}
            </Text>
            <Text style={[styles.docName, {fontSize: 12, marginTop: 3,}]}>
              {doctor?.designation}
            </Text>
            <Text style={[styles.docName, {fontSize: 12, }]}>
              {doctor?.speciality}
            </Text>
            <Text style={[styles.docName, {fontSize: 13, color: '#4CC2BF', marginTop: 3, marginBottom: 5}]}>
              {`Experience ${doctorDetail?.experience ?? '0'} Years`}
            </Text>
            <View style={styles.consultBtnsContainer}>
              <TouchableOpacity style={styles.consultBtn}>
                <Text
                  style={styles.consultBtnTxt}>{`Physical Consultation`}</Text>
                <View style={styles.iconContainer}>
                  <Image
                    source={require('../../assets/images/physical-consultation-icon.png')}
                    style={styles.consultBtnImg}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.consultBtn}>
                <Text style={styles.consultBtnTxt}>{`Video Consultation`}</Text>
                <View style={styles.iconContainer}>
                  <Image
                    source={require('../../assets/images/video-consultation-icon.png')}
                    style={styles.consultBtnImg}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <Text
              style={[
                styles.docName,
                {fontSize: 16, color: '#4CC2BF', marginBottom: 5},
              ]}>{`About`}</Text>
            <Text
              style={[
                styles.docName,
                {fontSize: 12},
              ]}>{`${doctor?.name} is a top specialist in ${doctor?.speciality} in Secunderabad, Hyderabad. He has graduated MBBS from the...Read More`}</Text>
          </View>
        </View>
        <View style={styles.calenderContainer}>
          <DynamicWeekWithMonth />
          <View>
            <Text style={styles.centeredTxt}>Available Time</Text>
            <FlatList
              data={availabletimings}
              numColumns={4}
              contentContainerStyle={styles.timeList}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item, index}) => (
                <Text style={styles.timeTxt}>{item}</Text>
              )}
            />
            <TouchableOpacity>
              <Text
                style={[
                  styles.centeredTxt,
                  {
                    marginTop: h * 0.02,
                    fontFamily: 'ProximaNovaA-Regular',
                    fontSize: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: '#fff',
                    width: 90,
                    paddingBottom: 5,
                    textAlign: 'center',
                    marginHorizontal: 'auto',
                  },
                ]}>
                View More
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigateTo('SlotConfirmation', doctor)}
          style={styles.formButton}>
          <Text style={styles.formButtonText}>Proceed To Confirm</Text>
        </TouchableOpacity>

        <Footer />
      </ScrollView>
    </View>
  );
};

export default DoctorSlots;

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
    minHeight: h,
  },
  doctorDetailsContainer: {
    backgroundColor: '#3C2871',
    paddingTop: h * 0.1,
    paddingHorizontal: w * 0.02,
    width:'90%',
    alignSelf: 'center',
    marginTop: h * 0.12,
    borderTopLeftRadius: w * 0.1,
    borderTopRightRadius: w * 0.1,
  },
  doctorImgContainer: {
    height: h * 0.2,
    width: h * 0.2,
    backgroundColor: '#fff',
    position: 'absolute',
    borderRadius: h * 0.1,
    top: -(h * 0.1),
    left: w * 0.2,
    borderWidth: 0.3,
    borderColor: 'grey',
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docImg: {
    height: h * 0.19,
    width: h * 0.19,
    borderRadius: h * 0.1,
    resizeMode: 'cover',
  },
  dotContainer: {
    height: w * 0.05,
    width: w * 0.05,
    borderRadius: w * 0.1,
    backgroundColor: '#fff',
    position: 'absolute',
    right: w * 0.02,
    top: h * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: w * 0.035,
    width: w * 0.035,
    borderRadius: w * 0.1,
    backgroundColor: '#4CC2BF',
  },
  calenderContainer: {
    backgroundColor: '#e6e4ef',
    width:'90%',
    alignSelf: 'center',
    borderBottomLeftRadius: w * 0.1,
    borderBottomRightRadius: w * 0.1,
    paddingBottom: h * 0.03,
  },
  doctorDetails: {
    padding: 8,
    backgroundColor: '#3C2871',
    width: '100%',
  },
  docName: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'ProximaNovaA-Regular',
  },
  consultBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical:10,
    
  },
  consultBtn: {
    paddingVertical: w * 0.03,
    paddingHorizontal: w * 0.02,
    justifyContent: 'center',
    backgroundColor: '#b6e7e6ff',
    width: '48%',
  },
  consultBtnTxt: {
    fontSize: 11,
    color: '#000',
    textAlign: 'left',
    fontFamily: 'ProximaNovaA-Regular',
    paddingLeft: 32,
  },
  iconContainer: {
    height:Dimensions.get('window').height * 0.08,
    width: 30,
    position: 'absolute',
    backgroundColor: '#4CC2BF',
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  consultBtnImg: {
    height: '80%',
    width: '80%',
    resizeMode: 'contain',
    tintColor: 'white',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#b6e7e6ff',
    marginVertical: 10,
  },
  timeTxt: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'ProximaNovaA-Regular',
    marginHorizontal: w * 0.02,
  },
  centeredTxt: {
    color: '#3C2871',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: 'ProximaNovaA-Semibold',
  },
  timeList: {
    alignItems: 'center',
    marginVertical: h * 0.01,
    fontFamily: 'ProximaNovaA-Semibold',
  },
  formButton: {
    backgroundColor: '#3C2871',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
    
  },
  formButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 10,
  },
});
