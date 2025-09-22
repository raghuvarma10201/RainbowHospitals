import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import React, {useCallback, useState} from 'react';
import {Text} from 'react-native-paper';
import Header from '../../components/header';
import Footer from '../../components/footer';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useApp} from '../../context/app-context';
import {getAppointments} from '../../services/common';
import {ToastService} from '../../utils/service-handlers';
import {formatAppointmentDateTime} from '../../utils/common-functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainStackParamList} from '../../types/navigation';
import {pallette} from '../../constants/constants';
import {adjust} from '../../utils/common-functions';
import NotFound from '../../components/empty-text';

const MyAppointments: React.FC = () => {
  const w = Dimensions.get('window').width;
  const h = Dimensions.get('window').height;

  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const {branch} = useApp();

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, []),
  );

  const loadAppointments = async () => {
    try {
      const payload = {
        patientId: await AsyncStorage.getItem('mrn'),
        OrganisationUID: branch?.organisation?.organisationid.toString(),
      };

      setLoading(true);
      const response = await getAppointments(payload);
      if (response && response.status == 200) {
        setLoading(false);
        setAppointments(response.data);
      } else {
        setLoading(false);
        ToastService.error('Error', response.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Failed to load Appointments', error);
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
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.doctorItem}
                  onPress={() =>
                    navigation.navigate('MyAppointmentDetails', {
                      appointmentData: appointment,
                    })
                  }
                  // onPress={() => startVideoCall()}
                >
                  <Image
                    source={
                      appointment.image
                        ? {uri: `${appointment.image}`}
                        : {
                            uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png',
                          }
                    }
                    style={styles.doctorImg}
                  />
                  <View>
                    <Text
                      style={[
                        styles.docName,
                        {
                          fontSize: adjust(10),
                          color: pallette.dark_purple,
                          fontFamily: 'ProximaNovaA-Semibold',
                          marginBottom: 2,
                        },
                      ]}>
                      #{appointment?.appointmentnumber ?? 'N/A'}
                    </Text>

                    <Text
                      style={[
                        styles.docName,
                        {
                          fontSize: adjust(12),
                          color: '#4CC2BF',
                          fontFamily: 'ProximaNovaA-Bold',
                          marginBottom: 2,
                        },
                      ]}>
                      {appointment?.CareProviderName ?? 'Doctor Name'}
                    </Text>

                    <Text
                      style={[
                        styles.docName,
                        {
                          fontSize: adjust(10),
                          color: pallette.black,
                          fontFamily: 'ProximaNovaA-Regular',
                          marginBottom: 5,
                        },
                      ]}>
                      {appointment?.SpecialtyName ?? 'Specialization'}
                    </Text>

                    <Text
                      style={[
                        styles.consultationText,
                        {fontFamily: 'ProximaNovaA-Semibold'},
                      ]}>
                      {appointment?.AppointmentType ?? 'Consultation Type'}
                    </Text>
                    <View style={styles.row}>
                      <Text
                        style={[
                          styles.docName,
                          {
                            color: pallette.black,
                            fontSize: adjust(10),
                            fontFamily: 'ProximaNovaA-Semibold',
                            marginBottom: 2,
                          },
                        ]}>
                        {formatAppointmentDateTime(appointment?.SlotStartDttm)}
                      </Text>
                      <Image
                        source={require('../../../assets/images/right-arrow.png')}
                        style={styles.rightArrow}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <NotFound
                text={'No appointments scheduled in this branch.'}
                margin={h * 0.35}
              />
            )}
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
};

export default MyAppointments;

const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: pallette.white,
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
    fontSize: adjust(10),
    color: pallette.black,
    width: w * 0.7,
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
    fontSize: adjust(10),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Regular',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: pallette.white,
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
    fontSize: adjust(10),
    color: pallette.black,
    width: 'auto',
    fontFamily: 'ProximaNovaA-Regular',
    marginBottom: 5,
  },
});
