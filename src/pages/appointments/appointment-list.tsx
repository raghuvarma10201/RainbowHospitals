import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import React, {useCallback, useRef, useState} from 'react';
import {Text} from 'react-native-paper';
import {Header} from '../../components';
import Footer from '../../components/footer';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useApp} from '../../context/app-context';
import {fetchFamilyMembers, getAppointments} from '../../services/common';
import {ToastService} from '../../utils/service-handlers';
import {
  formatAppointmentDateTime,
  isPreviousDay,
} from '../../utils/common-functions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainStackParamList} from '../../types/navigation';
import {pallette} from '../../constants/constants';
import {adjust} from '../../utils/common-functions';
import NotFound from '../../components/empty-text';
import {Appointment, FamilyMember} from '../../utils/types';
import {Dropdown} from 'react-native-element-dropdown';
import moment from 'moment';

const MyAppointments: React.FC = ({route}: any) => {
  const w = Dimensions.get('window').width;
  const h = Dimensions.get('window').height;
  const {mrn} = route?.params;
  const headerRef = useRef<any>();

  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(
    mrn || '',
  );
  const [loading, setLoading] = useState(false);
  const {branch} = useApp();

  useFocusEffect(
    useCallback(() => {
      loadAppointments(mrn);
      getFamilyMembers();
    }, [branch]),
  );

  const loadAppointments = async (id: string | undefined) => {
    try {
      const payload = {
        patientId: id || 'MAHTMP-182297',
        startdate: '2000-01-01',
      };

      setLoading(true);
      const response = await getAppointments(payload);
      if (response && response.status == 200) {
        setLoading(false);
        setAppointments(
          response.data.sort((a: Appointment, b: Appointment) =>
            moment(b.SlotStartDttm).diff(moment(a.SlotStartDttm)),
          ),
        );
      } else {
        setLoading(false);
        ToastService.error('Error', response.message);
      }
    } catch (error: any) {
      setLoading(false);
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  const getFamilyMembers = useCallback(async () => {
    try {
      const response = await fetchFamilyMembers({
        MobileNo: await AsyncStorage.getItem('mobileNumber'),
      });

      if (response?.status === 200) {
        setFamilyMembers(response.data);
      } else {
        ToastService.error(
          'Error',
          response?.message || 'Unable to fetch patients',
        );
      }
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
    }
  }, []);
  return (
    <View style={styles.mainContainer}>
      <Header ref={headerRef} showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Dropdown
            style={styles.dropdownSelect}
            selectedTextStyle={styles.selectedTextContry}
            placeholderStyle={styles.placeholderCountry}
            maxHeight={200}
            value={selectedPatient}
            data={familyMembers}
            valueField="PatientID"
            labelField="PatientName"
            placeholder="Select Patient"
            containerStyle={styles.dropdownList}
            itemTextStyle={styles.selectedTextContry}
            activeColor={pallette.pale_turquoise}
            iconColor={pallette.black}
            onChange={(item: FamilyMember) => {
              setSelectedPatient(item.PatientID);
              loadAppointments(item.PatientID);
            }}
          />
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
                          color: !isPreviousDay(appointment?.SlotStartDttm)
                            ? pallette.dark_purple
                            : '#4CC2BF',
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
                        {
                          fontFamily: 'ProximaNovaA-Semibold',
                          backgroundColor: !isPreviousDay(
                            appointment?.SlotStartDttm,
                          )
                            ? pallette.light_amethyst
                            : '#E2EDEC',
                        },
                      ]}>
                      {isPreviousDay(appointment?.SlotStartDttm)
                        ? `Completed ${appointment?.AppointmentType} Consultation`
                        : `Upcoming ${appointment?.AppointmentType} Consultation`}
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
                text={'No appointments found.'}
                margin={h * 0.35}
                hideBtn={true}
                // change={() => headerRef.current?.openModal()}
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    fontSize: adjust(10),
    color: pallette.black,
    width: 'auto',
    fontFamily: 'ProximaNovaA-Regular',
    marginBottom: 5,
  },
  dropdownSelect: {
    backgroundColor: pallette.white,
    borderWidth: 1,
    borderColor: pallette.dark_grey,
    height: h * 0.05,
    marginTop: 5,
    width: w * 0.95,
    alignSelf: 'center',
    paddingHorizontal: w * 0.04,
    borderRadius: w * 0.05,
  },
  placeholderCountry: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    color: pallette.black,
  },
  selectedTextContry: {
    fontSize: adjust(12),
    color: pallette.black,
  },
  dropdownList: {
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    backgroundColor: pallette.white,
  },
});
