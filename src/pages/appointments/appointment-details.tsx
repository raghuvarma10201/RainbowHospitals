import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {Text, Modal, Portal, TextInput} from 'react-native-paper';
import Header from '../../components/header';
import Footer from '../../components/footer';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParamList} from '../../types/navigation';
import {
  formatAppointmentDate,
  formatAppointmentTime,
  isBeforeTwoHours,
} from '../../utils/common-functions';
import {bookAppointment, uploadPatientVitals} from '../../services/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ToastService} from '../../utils/service-handlers';
import {pallette} from '../../constants/constants';
import Loader from '../../components/loader';
import {adjust} from '../../utils/common-functions';
import {useJitsi} from '../../context/jitsi-context';
import {AppointmentPayload} from '../../utils/types';
import moment from 'moment';

const MyAppointmentDetails: React.FC<any> = ({route}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {appointmentData, cancel} = route.params;
  console.log(appointmentData);
  const dateTime = moment().format();
  console.log(dateTime);

  const [visible, setVisible] = React.useState(cancel || false);
  const [vitalsModalVisible, setvitalsModalVisible] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const {showJitsi} = useJitsi();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const showVitalsModal = () => setvitalsModalVisible(true);
  const hideVitalsModal = () => setvitalsModalVisible(false);

  const [bank_details, setBank_details] = useState({
    bank_name: 'T',
    account_number: 't',
    ifsc_code: 't',
    account_holder_name: 't',
    branch_name: 't',
  });
  const [vitals, setVitals] = useState({
    height: appointmentData?.vitals?.height || '',
    weight: appointmentData?.vitals?.weight || '',
    temperature: appointmentData?.vitals?.temperature || '',
  });
  const vitalFields = [
    {key: 'height', label: 'Height (in cm)'},
    {key: 'weight', label: 'Weight (in Kgs)'},
    {key: 'temperature', label: 'Temperature (in °F)'},
  ];

  const cancelAppointment = async () => {
    const obj: AppointmentPayload = {
      status: 'CANCEL',
      appointmentnumber: appointmentData?.BookingUID,
      comment: '',
      mrn: (await AsyncStorage.getItem('mrn')) || '',
      OrganisationUID: appointmentData?.OrganisationUID,
      AppointmentType: appointmentData?.AppointmentType,
      bank_details,
    };
    try {
      const response = await bookAppointment(obj);
      if (response?.status == 200 && response?.success) {
        setLoading(false);
        ToastService.success('Success', 'Appointment Cancelled Successfully');
        navigation.goBack();
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

  const uploadVitals = async () => {
    const obj = {
      appointmentnumber: appointmentData?.BookingUID,
      mrn: (await AsyncStorage.getItem('mrn')) || '',
      OrganisationUID: appointmentData?.OrganisationUID,
      height: vitals.height ? parseFloat(vitals.height) : undefined,
      weight: vitals.weight ? parseFloat(vitals.weight) : undefined,
      temperature: vitals.temperature
        ? parseFloat(vitals.temperature)
        : undefined,
    };
    console.log(obj);

    try {
      const response = await uploadPatientVitals(obj);
      console.log(response);

      if (response?.status == 200 && response?.success) {
        setLoading(false);
        ToastService.success('Success', 'Vitals Uploaded Successfully');
        navigation.goBack();
      } else {
        setLoading(false);
        ToastService.error('Error', response.message);
      }
    } catch (error: any) {
      setLoading(false);
      ToastService.error(
        'Error Uploading Vitals',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  const startVideoCall = () => {
    showJitsi({
      roomName: appointmentData?.roomId || 'SampleJitsiCall',
      token: '',
      serverURL: 'https://dev.rb.vc.demos.im/',
      patient: {
        name: appointmentData?.PatientName,
        mobile: appointmentData?.patient?.mobile_no,
        email: appointmentData?.patient?.email_id,
        time: formatAppointmentTime(appointmentData?.SlotStartDttm),
      },
      doctor: {
        name: appointmentData?.SessionName,
        time: formatAppointmentTime(appointmentData?.SlotStartDttm),
      },
    });
  };

  // ---- Radial Menu State ----
  const [menuOpen, setMenuOpen] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const toggleMenu = () => {
    if (menuOpen) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => setMenuOpen(false));
    } else {
      setMenuOpen(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  // Pre-calculate positions for 3 buttons in a 90° arc
  const radius = 100;
  const options = [
    {
      label: 'Chat',
      angle:
        appointmentData?.AppointmentType.toLowerCase() == 'physical'
          ? -90
          : -75,
      img: require('../../../assets/images/chat-icon.png'),
      action: () => {
        navigation.navigate('AppointmentChat', {
          bookingId: appointmentData.appointmentnumber,
          doctor: appointmentData.CareProviderName,
        }),
          toggleMenu();
      },
    },
    {
      label: 'Upload Vitals',
      angle:
        appointmentData?.AppointmentType.toLowerCase() == 'physical'
          ? -180
          : -130,
      img: require('../../../assets/images/vitals.png'),
      action: () => {
        toggleMenu(), showVitalsModal();
      },
    },
    {
      label: 'Join Call',
      angle: -190,
      img: require('../../../assets/images/videocall-icon.png'),
      action: () => {
        toggleMenu(), startVideoCall();
      },
    },
  ];

  return (
    <View style={styles.mainContainer}>
      <Header showLocation title={undefined} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          {/* doctor details */}
          <View style={styles.doctorDetailsContainer}>
            <View style={styles.doctorImgContainer}>
              <Image
                source={
                  appointmentData.image
                    ? {uri: `${appointmentData.image}`}
                    : {
                        uri: 'https://cdn-icons-png.flaticon.com/512/387/387561.png',
                      }
                }
                style={styles.docImg}
              />
              <View style={styles.dotContainer}>
                <View style={styles.dot} />
              </View>
            </View>
            <View style={styles.doctorDetails}>
              <Text
                style={[
                  styles.docName,
                  {
                    fontSize: adjust(14),
                    color: '#4CC2BF',
                    fontFamily: 'ProximaNovaA-Semibold',
                  },
                ]}>
                {appointmentData?.CareProviderName ?? 'Doctor Name'}
              </Text>
              <Text
                style={[styles.docName, {fontSize: adjust(10), marginTop: 3}]}>
                {appointmentData?.SpecialtyName ?? 'Specialization'}
              </Text>

              <View style={styles.location}>
                <Image
                  source={require('../../../assets/images/map-icon.png')}
                  style={{width: 15, height: 15}}
                />
                <Text style={styles.locationText}>
                  {appointmentData?.OrganisationName ?? ''}
                </Text>
              </View>
            </View>
          </View>

          {/* patient info */}
          <View style={styles.patientInfo}>
            <Text style={styles.patientInfoHeaderText}>Patient Info</Text>
            <View>
              <View style={styles.patientItem}>
                <Image
                  source={require('../../../assets/images/user-icon.png')}
                  style={styles.patientImg}
                />
                <View>
                  <Text
                    style={{
                      fontSize: adjust(12),
                      color: '#6651AF',
                      fontFamily: 'ProximaNovaA-Bold',
                      marginBottom: 2,
                    }}>
                    #{appointmentData?.BookingUID ?? ''}
                  </Text>
                  <Text
                    style={{
                      fontSize: adjust(14),
                      color: '#6651AF',
                      fontFamily: 'ProximaNovaA-Semibold',
                      marginBottom: 6,
                    }}>
                    {appointmentData?.PatientName ?? ''}
                  </Text>
                  <View style={styles.patientReports}>
                    <Text style={styles.reports}>MRI Report</Text>
                    <Text style={styles.reports}>Blood Reports</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* time/date */}
          <View style={[styles.patientInfo, {marginTop: 15, borderRadius: 10}]}>
            <Text style={styles.patientInfoHeaderText}>Time Date</Text>
            <View style={styles.timeDateItem}>
              <View style={styles.timeFlexRow}>
                <Image
                  source={require('../../../assets/images/footer-calendar-icon.png')}
                  style={styles.timeIcon}
                />
                <Text
                  style={{
                    fontSize: adjust(12),
                    color: '#6651AF',
                    fontFamily: 'ProximaNovaA-Semibold',
                    marginBottom: 2,
                  }}>
                  {formatAppointmentDate(appointmentData?.SlotStartDttm)}
                </Text>
              </View>
              <View>
                <View style={styles.timeFlexRow}>
                  <Image
                    source={require('../../../assets/images/time-icon.png')}
                    style={styles.timeIcon}
                  />
                  <Text
                    style={{
                      fontSize: adjust(12),
                      color: '#6651AF',
                      fontFamily: 'ProximaNovaA-Semibold',
                      marginBottom: 2,
                    }}>
                    {formatAppointmentTime(appointmentData?.SlotStartDttm)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* cancel + reschedule */}
          <View style={styles.payBtnsContainer}>
            <TouchableOpacity
              // disabled={
              //   !isBeforeTwoHours(dateTime, appointmentData?.SlotStartDttm)
              // }
              onPress={() => showModal()}
              style={[
                styles.payBtn,
                {
                  backgroundColor: isBeforeTwoHours(
                    dateTime,
                    appointmentData?.SlotStartDttm,
                  )
                    ? pallette.dark_purple
                    : pallette.dark_grey,
                },
              ]}>
              <Text style={styles.payBtnTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={
                !isBeforeTwoHours(dateTime, appointmentData?.SlotStartDttm)
              }
              onPress={() =>
                navigation.navigate('DoctorSlots', {
                  doctorId: appointmentData?.id,
                  appointmentType: appointmentData?.AppointmentType,
                  appointmentnumber: appointmentData?.appointmentnumber,
                  OrganisationID: appointmentData?.OrganisationUID,
                  patientId: appointmentData?.PatientID,
                })
              }
              style={[
                styles.payBtn,
                {
                  backgroundColor: isBeforeTwoHours(
                    dateTime,
                    appointmentData?.SlotStartDttm,
                  )
                    ? pallette.dark_purple
                    : pallette.dark_grey,
                },
              ]}>
              <Text style={styles.payBtnTxt}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Footer />

      {/* Floating Options Button */}
      <View style={{position: 'absolute', bottom: h * 0.12, right: w * 0.05}}>
        {menuOpen &&
          (appointmentData?.AppointmentType.toLowerCase() != 'physical'
            ? options
            : options.slice(0, -1)
          ).map((opt, index) => {
            const x = Math.cos((opt.angle * Math.PI) / 180) * radius;
            const y = Math.sin((opt.angle * Math.PI) / 180) * radius;

            return (
              <Animated.View
                key={index}
                style={{
                  position: 'absolute',
                  transform: [
                    {
                      translateX: anim.interpolate({
                        inputRange: [0, 1.2],
                        outputRange: [0, x],
                      }),
                    },
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1.2],
                        outputRange: [0, y],
                      }),
                    },
                  ],
                  opacity: anim,
                }}>
                <TouchableOpacity style={styles.radialBtn} onPress={opt.action}>
                  <Image source={opt?.img} style={styles.radialBtnImg} />
                </TouchableOpacity>
                <Text style={styles.radialBtnText}>{opt.label}</Text>
              </Animated.View>
            );
          })}

        <TouchableOpacity style={styles.optionsBtn} onPress={toggleMenu}>
          <Image
            source={
              menuOpen
                ? require('../../../assets/images/close.png')
                : require('../../../assets/images/options.png')
            }
            style={styles.optBtnImg}
          />
          {/* <Text style={{color: 'white', fontSize: 40}}>⋮</Text> */}
        </TouchableOpacity>
      </View>

      {/* Cancel Modal */}
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalWrapp}>
          <Text style={styles.formTitle}>Cancel Appointment</Text>
          <Text style={styles.formSubTitle}>
            Need Bank Details to refund the amount
          </Text>

          <View style={styles.formContainer}>
            {[
              'bank_name',
              'account_number',
              'ifsc_code',
              'account_holder_name',
              'branch_name',
            ].map((field, idx) => (
              <View style={styles.formRow} key={idx}>
                <Text style={styles.formLabel}>{field.replace(/_/g, ' ')}</Text>
                <TextInput
                  mode="flat"
                  underlineColor="transparent"
                  style={styles.formInput}
                  onChangeText={text => {
                    console.log(text),
                      setBank_details(prev => ({
                        ...prev,
                        [field]: text,
                      }));
                  }}
                />
              </View>
            ))}

            <View style={styles.formRowBtn}>
              <TouchableOpacity
                onPress={() => hideModal()}
                style={[styles.formButton, {backgroundColor: 'grey'}]}>
                <Text style={styles.formButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => cancelAppointment()}
                style={styles.formButton}>
                <Text style={styles.formButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>

      {/* Upload Vitals Modal */}
      <Portal>
        <Modal
          visible={vitalsModalVisible}
          onDismiss={hideVitalsModal}
          contentContainerStyle={styles.modalWrapp}>
          <Text style={styles.formTitle}>Upload Vitals</Text>
          <Text style={styles.formSubTitle}>
            Need Vital Details For Diagnosis
          </Text>

          <View style={styles.formContainer}>
            {vitalFields.map(({key, label}, idx) => (
              <View style={styles.formRow} key={idx}>
                <Text style={styles.formLabel}>{label}</Text>
                <TextInput
                  mode="flat"
                  underlineColor="transparent"
                  value={vitals[key] ? String(vitals[key]) : ''}
                  style={styles.formInput}
                  keyboardType={'decimal-pad'}
                  onChangeText={text =>
                    setVitals(prev => ({
                      ...prev,
                      [key]: text, // ✅ always updates correct key
                    }))
                  }
                />
              </View>
            ))}

            <View style={styles.formRowBtn}>
              <TouchableOpacity
                onPress={() => hideVitalsModal()}
                style={[styles.formButton, {backgroundColor: 'grey'}]}>
                <Text style={styles.formButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => uploadVitals()}
                style={styles.formButton}>
                <Text style={styles.formButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Portal>

      {loading && <Loader />}
    </View>
  );
};

export default MyAppointmentDetails;

const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: pallette.white,
    flex: 1,
  },
  scrollContent: {padding: 0, paddingBottom: 0},
  container: {flex: 1, paddingBottom: 50, paddingTop: 0, position: 'relative'},

  doctorDetailsContainer: {
    backgroundColor: pallette.dark_purple,
    paddingHorizontal: 15,
    alignSelf: 'center',
    marginTop: h * 0.12,
    borderTopLeftRadius: w * 0.1,
    borderTopRightRadius: w * 0.1,
    width: '90%',
  },
  doctorImgContainer: {
    width: 100,
    height: 100,
    backgroundColor: pallette.white,
    borderRadius: h * 0.1,
    marginHorizontal: 'auto',
    borderWidth: 0.3,
    borderColor: 'grey',
    padding: 5,
    marginTop: -50,
    position: 'relative',
    marginBottom: 10,
  },
  docImg: {
    width: 100,
    height: 100,
    borderRadius: h * 0.1,
    resizeMode: 'cover',
  },
  dotContainer: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: pallette.white,
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {height: 13, width: 13, borderRadius: 100, backgroundColor: '#4CC2BF'},
  doctorDetails: {
    padding: 8,
    backgroundColor: pallette.dark_purple,
    width: '100%',
  },
  docName: {
    fontSize: adjust(18),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Regular',
    textAlign: 'center',
  },

  patientInfo: {
    backgroundColor: '#F5F5FF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    width: '90%',
    alignSelf: 'center',
  },
  patientInfoHeaderText: {
    fontSize: adjust(14),
    marginTop: 10,
    fontFamily: 'ProximaNovaA-Bold',
    color: pallette.dark_purple,
    textAlign: 'left',
  },
  location: {
    borderTopWidth: 1,
    borderTopColor: '#5B52A3',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    justifyContent: 'center',
    marginTop: 13,
    marginBottom: 10,
    paddingTop: 10,
  },
  locationText: {
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Semibold',
    color: pallette.white,
    textAlign: 'left',
  },
  patientItem: {marginTop: 15, flexDirection: 'row', alignItems: 'flex-start'},
  patientImg: {
    height: w * 0.1,
    width: w * 0.1,
    resizeMode: 'contain',
    borderRadius: w,
    borderWidth: 1,
    borderColor: pallette.dark_purple,
    marginRight: 10,
  },
  patientReports: {marginTop: 5, flexDirection: 'row', gap: 10},
  reports: {
    backgroundColor: '#E2EDEC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
    fontSize: adjust(10),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Regular',
    marginBottom: 10,
  },
  timeIcon: {width: 30, height: 30, resizeMode: 'contain', marginRight: 5},
  timeDateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  timeFlexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  payBtn: {
    padding: w * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    borderRadius: 100,
    fontFamily: 'ProximaNovaA-Regular',
  },
  payBtnTxt: {
    fontSize: adjust(12),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Semibold',
  },

  modalWrapp: {
    backgroundColor: pallette.white,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'flex-start',
  },
  formTitle: {
    fontSize: adjust(16),
    textAlign: 'center',
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    color: pallette.black,
    marginBottom: 5,
  },
  formSubTitle: {
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    marginBottom: 10,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: pallette.white,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  formRow: {marginBottom: 15},
  formLabel: {
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Regular',
    color: pallette.black,
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  formInput: {
    height: 36,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 6,
    backgroundColor: pallette.pale_turquoise,
  },
  formRowBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  formButton: {
    backgroundColor: pallette.dark_purple,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: '45%',
  },
  formButtonText: {
    color: pallette.white,
    textAlign: 'center',
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Bold',
    fontWeight: 'bold',
    padding: 5,
    borderRadius: 10,
  },

  optionsBtn: {
    backgroundColor: pallette.teal,
    borderRadius: h * 0.06,
    width: h * 0.08,
    height: h * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: pallette.medium_turquoise,
  },
  optBtnImg: {
    height: '30%',
    width: '30%',
    resizeMode: 'contain',
    tintColor: pallette.white,
  },

  radialBtn: {
    backgroundColor: pallette.medium_turquoise,
    borderRadius: w,
    padding: w * 0.01,
    height: h * 0.07,
    width: h * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radialBtnImg: {
    height: '70%',
    width: '70%',
    resizeMode: 'contain',
    tintColor: pallette.white,
  },
  radialBtnText: {
    color: pallette.black,
    fontSize: adjust(10),
    fontFamily: 'ProximaNovaA-Semibold',
    textAlign: 'center',
  },
});
