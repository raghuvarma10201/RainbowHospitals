import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, } from 'react-native-paper';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useJitsi } from '../context/JitsiContext';
import { useApp } from '../context/AppContext';
import { getAppointments } from '../services/common';
import { ToastService } from '../utils/ToastService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainStackParamList } from '../navigation/types';

const MyAppointments: React.FC = () => {
  const w = Dimensions.get('window').width;
  const h = Dimensions.get('window').height;

  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const navigateTo = (path: keyof MainStackParamList, params: any) => {
    navigation.navigate(path, params);
  };
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { branch } = useApp();
  const { showJitsi } = useJitsi();

  useEffect(() => {
    loadAppointments();
  }, []);

  const startVideoCall = () => {
    showJitsi({
      roomName: 'DemoRoom123',
      token: '', // Optional if not using JWT auth
      serverURL: 'https://dev.rb.vc.demos.im/', // Optional (defaults if not passed)
      userInfo: {
        displayName: 'Sunny',
        email: 'sunny@example.com',
        // avatar: 'https://yourdomain.com/avatar.png',
      },
    });
  };
  const loadAppointments = async () => {
    try {
      const payload = {
        patientId: AsyncStorage.getItem('mrn'),
        startdate: "2025-06-18"
      }
      setLoading(true);
      const response = await getAppointments(payload);
      console.log(response);
      if (response && response.status == 200) {
        setLoading(false);
        setAppointments(response.data.doctors);
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
          <View style={styles.doctorsListContainer}>
            <TouchableOpacity style={styles.doctorItem}
              //onPress={() => navigation.navigate('MyAppointmentDetails')}
              onPress={() => navigation.navigate('JitsiCall', { roomName: 'test' })}
            >
              <Image source={require('../../assets/images/doc-img-2.png')}
                style={styles.doctorImg}
              />
              <View>
                <Text style={[styles.docName, { fontSize: 11, color: '#3C2871', fontFamily: 'ProximaNovaA-Semibold', marginBottom: 2 }]}>
                  #34543
                </Text>
                <Text style={[styles.docName, { fontSize: 14, color: '#4CC2BF', fontFamily: 'ProximaNovaA-Bold', marginBottom: 2 }]}>
                  Dr. Ramesh Konanki
                </Text>
                <Text style={[styles.docName, { fontSize: 11, color: '#000', fontFamily: 'ProximaNovaA-Regular', marginBottom: 5 }]}>
                  Senior Consultant - Pediatric Neurologist
                </Text>

                <Text style={[styles.consultationText, { fontFamily: 'ProximaNovaA-Semibold', }]}>
                  Physical Consultation
                </Text>

                <View style={styles.row}>
                  <Text style={[styles.docName, { color: '#000', fontSize: 12, fontFamily: 'ProximaNovaA-Semibold', marginBottom: 2 }]}>
                    2025-08-01 at 10:00 AM
                  </Text>

                  <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
                </View>



              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.doctorItem}>
              <Image source={require('../../assets/images/doc-img-2.png')}
                style={styles.doctorImg}
              />
              <View>
                <Text style={[styles.docName, { fontSize: 11, color: '#3C2871', fontFamily: 'ProximaNovaA-Semibold', marginBottom: 2 }]}>
                  #34543
                </Text>
                <Text style={[styles.docName, { fontSize: 14, color: '#4CC2BF', fontFamily: 'ProximaNovaA-Bold', marginBottom: 2 }]}>
                  Dr. Ramesh Konanki
                </Text>
                <Text style={[styles.docName, { fontSize: 11, color: '#000', fontFamily: 'ProximaNovaA-Regular', marginBottom: 5 }]}>
                  Senior Consultant - Pediatric Neurologist
                </Text>

                <Text style={[styles.consultationText, { fontFamily: 'ProximaNovaA-Semibold', }]}>
                  Physical Consultation
                </Text>


                <View style={styles.row}>
                  <Text style={[styles.docName, { color: '#000', fontSize: 12, fontFamily: 'ProximaNovaA-Semibold', marginBottom: 2 }]}>
                    2025-08-01 at 10:00 AM
                  </Text>

                  <Image source={require('../../assets/images/right-arrow.png')} style={styles.rightArrow} />
                </View>
              </View>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>


  );
}

export default MyAppointments

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


  doctorsListContainer: {
    paddingHorizontal: 15,
  },
  doctorItem: {
    paddingVertical: h * 0.01,
    marginTop: h * 0.01,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#E2EDEC',
    paddingBottom: 15,

  },

  doctorImg: {
    height: 72,
    width: 72,
    resizeMode: 'cover',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E2EDEC',
    marginRight: 10,
  },
  docName: {
    fontSize: 11,
    color: '#000',

  },
  payBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    maxWidth: w * 0.4,
    marginTop: 10,
  },
  payBtnTxt: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'ProximaNovaA-Regular',
  },
  row: {

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginTop: 4,




  },

  rightArrow: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },

  consultationText: {
    backgroundColor: '#E2EDEC',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    fontSize: 12,
    color: '#000',
    fontFamily: 'ProximaNovaA-Regular',
    marginBottom: 5,
  }
}); 