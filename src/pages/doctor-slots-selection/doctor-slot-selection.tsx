// ---------- MODULE IMPORTS ----------
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CommonActions,
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------- COMPONENT IMPORTS ----------
import {SlotSelection} from '.';
import {useDoctorSlots} from './components/functions';
import {Footer, Header, Loader, NotFound} from '../../components';

// ---------- OTHER IMPORTS ----------
import {
  advancePay,
  bookAppointment,
  fetchConsultationFee,
  fetchFamilyMembers,
} from '../../services/common';
import {useApp} from '../../context/app-context';
import {ToastService} from '../../utils/service-handlers';
import {MainStackParamList} from '../../types/navigation';
import {routes} from '../../utils/enums';
import {
  AppointmentPayload,
  AppointmentType,
  FamilyMember,
} from '../../utils/types';
import {h, pallette, w} from '../../constants/constants';
import {adjust} from '../../utils/common-functions';
import DoctorDetailsCard from '../../components/doctor-details-card';
import {Dropdown} from 'react-native-element-dropdown';
import {useSettings} from '../../context/settings-context';
import {useTimer} from '../../context/timer-context';
import CountdownCircle from '../../components/animated-timer';

const payment_types = [
  {value: '1', label: 'Pay Now'},
  {value: '2', label: 'Pay At Hospital'},
];

interface payload {
  final: AppointmentPayload;
  bookingID: any;
}

// ---------- COMPONENT ----------
const DoctorSlotSelection: React.FC = ({route}: any) => {
  // ---------- STATE AND CONTEXT DECLARATION ----------
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const isFocused = useIsFocused(); // NEW: Track if screen is focused

  const {
    doctorId,
    appointmentType,
    OrganisationID,
    appointmentnumber,
    patientId,
    paid,
  } = route.params;
  const headerRef = useRef<any>();
  const scrollRef = useRef<ScrollView>(null);

  const {branch, profile, updateAppointment} = useApp();
  const {settings} = useSettings();
  const {startTimer, secondsLeft, clearTimers} = useTimer();
  const [typeOfAppointment, setTypeOfAppointment] = useState<AppointmentType>(
    appointmentnumber ? appointmentType : '',
  );
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedD, setSelectedD] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [loadingCall, setLoadingCall] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(
    patientId || '',
  );
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(
    appointmentnumber ? OrganisationID : '',
  );
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [consultationFee, setConsultationFee] = useState<number>(0);
  const [registrationFee, setRegistrationFee] = useState<number>(0);
  const [typeOfPayment, setTypeOfPayment] = useState<string>(paid ? '1' : '');
  const [selectedPayment, setSelectedPayment] = useState<string>(
    paid ? 'Pay Now' : '',
  );

  const [payloadState, setPayloadState] = useState<payload>({
    final: {
      orgcode: '',
      mrn: '',
      payment_type: undefined,
      price: undefined,
      registrationFee: undefined,
      doctor_name: '',
    },
    bookingID: '',
  });

  // ---------- LIFECYCLE ----------
  const {
    doctorDetail,
    doctorSpecialities,
    sessions,
    slots,
    locations,
    selectedDate,
    loadSlots,
    loading,
  } = useDoctorSlots(doctorId, typeOfAppointment);

  const resetState = useCallback(() => {
    setTypeOfAppointment('');
    setSelectedSlot('');
    setSelectedD('');
    setSelectedTime('');
    setSelectedLocation('');
    setLoadingPayment(false);
    setLoadingCall(false);
    setSelectedPatient(patientId || '');
    setConsultationFee(0);
    setRegistrationFee(0);
    setTypeOfPayment('');
    setTimerStarted(false);
    clearTimers();
  }, [patientId]);

  const didMount = useRef(false);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    if (isFocused && secondsLeft === 0) {
      resetState();
      ToastService.error('Session expired. Please book again.');
    }
    if (!isFocused && secondsLeft === 0) {
      resetState();
    }
  }, [secondsLeft, isFocused, resetState]);

  // Reset on unmount (silent reset)
  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  // ---------- CALLBACK FUNCTIONS ----------
  const getFamilyMembers = useCallback(async (mobile: string) => {
    try {
      const response = await fetchFamilyMembers({MobileNo: mobile});

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
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        const storedNumber = await AsyncStorage.getItem('mobileNumber');
        if (storedNumber && isActive) {
          setPhoneNumber(storedNumber);
          await getFamilyMembers(storedNumber);
        }
      };

      fetchData();

      return () => {
        isActive = false; // cleanup to prevent state updates if screen is unfocused
      };
    }, [getFamilyMembers]),
  );

  const getConsultationFee = useCallback(
    async (
      mrn: string | undefined,
      date: any,
      slot: any,
      paymenttype: string,
      time: any,
    ) => {
      if (!branch) return;
      try {
        setLoadingCall(true);
        const payload = {
          orgcode: branch.organisation?.code || '11MN',
          OrganisationUID: branch?.organisation?.organisationid?.toString(),
          Uhid: mrn || 'MAHTMP-182297',
          Departmentcode: '11MNPAGP',
          VisitDate: new Date(date).toISOString().split('T')[0],
          DoctorId: doctorDetail.new_doctor_UID ?? '',
        };
        const response = await fetchConsultationFee(payload);
        if (response?.status === 200) {
          const fee =
            response.data.ConsultationFee || response.data.RegistrationFee || 0;
          const regFee = response.data.RegistrationFee || 0;
          setConsultationFee(fee);
          setRegistrationFee(regFee);
          proceedPayment(paymenttype, slot, time, mrn, fee, regFee);
        } else {
          ToastService.error(
            'Error',
            response?.message || 'Unable to fetch fee',
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
        setLoadingCall(false);
      }
    },
    [branch, doctorDetail, updateAppointment],
  );

  // ---------- EVENT HANDLERS ----------
  const proceedPayment = async (
    paymenttype?: string,
    slot?: any,
    time?: any,
    mrn?: any,
    cons_fee?: any,
    reg_fee?: any,
  ) => {
    if (!slot) return;
    setLoadingPayment(true);
    const txnid = `TXN_${Date.now()}`;
    try {
      const commonPayload = {
        slotid: slot,
        date: selectedDate,
        time: time,
        AppointmentType: typeOfAppointment,
      };
      if (appointmentnumber) {
        const mrn = (await AsyncStorage.getItem('mrn')) || '';
        const reschedulePayload: AppointmentPayload = {
          status: 'RESCHEDULE',
          appointmentnumber,
          comment: '',
          mrn,
          OrganisationUID: OrganisationID,
          ...commonPayload,
        };

        const response = await bookAppointment(reschedulePayload);
        if (response?.status === 200 && response?.success) {
          ToastService.success(
            'Success',
            'Appointment Rescheduled Successfully',
          );
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: routes.Dashboard as keyof MainStackParamList}],
            }),
          );
        } else {
          ToastService.error(
            'Error',
            response?.message || 'Failed to reschedule',
          );
        }
      } else {
        const blockPayload: AppointmentPayload = {
          status: 'BLOCK',
          comment: '',
          mrn: mrn ?? '',
          OrganisationUID: branch?.organisation?.organisationid.toString(),
          transaction_id: paymenttype == 'Pay Now' ? txnid ?? '' : '',
          price: cons_fee ?? 0,
          payment_type: paymenttype == 'Pay Now' ? 'PayU' : 'PAYATHOSPITAL',
          orgcode: branch?.organisation?.code || '',
          Visittype: 'First Visit',
          careprovider_code: doctorDetail.new_doctor_UID,
          expirytime:
            (paymenttype == 'Pay Now'
              ? settings?.onlineBookingInterval ?? 0
              : settings?.physicalBookingInterval ?? 0) / 60,
          ...commonPayload,
        };
        console.log(blockPayload);

        try {
          const response = await bookAppointment(blockPayload);
          if (response && response.status == 200 && response.success == true) {
            ToastService.success('Success', 'Slot Blocked Successfully.');
            if (paymenttype == 'Pay Now') {
              startTimer(settings?.onlineBookingInterval || 600);
              setTimerStarted(true);
            } else {
              startTimer(settings?.physicalBookingInterval || 180);
              setTimerStarted(true);
            }
            setPayloadState({
              final: {
                ...blockPayload,
                registrationFee: reg_fee,
                doctor_name: doctorDetail?.name,
              },
              bookingID: response?.data?.his_booking_id,
            });
          } else {
            ToastService.error(response.message);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: routes.Dashboard}],
              }),
            );
          }
        } catch (error: any) {
          ToastService.error(
            'Error',
            error?.response?.data?.message ||
              error?.message ||
              'Something went wrong',
          );
        }
      }
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
    } finally {
      setLoadingPayment(false);
    }
  };

  const updatePayment = async (paymenttype: string) => {
    if (paymenttype == 'Pay Now') {
      navigation.navigate('PayUWebView', {
        finalPayload: payloadState.final,
        bookingId: payloadState.bookingID,
        payuUrl: 'https://test.payu.in/_payment',
      });
    } else {
      const payload = {
        orgcode: payloadState?.final?.orgcode ?? '40FD',
        mrn: payloadState?.final?.mrn ?? 'BAHTMP-761149',
        paidby:
          payloadState?.final?.payment_type == 'PAYATHOSPITAL'
            ? 'PAYATHOSPITAL'
            : 'PAYU',
        ConsultationFee: payloadState?.final?.price?.toString() ?? '0',
        RegistrationFee: payloadState?.final.registrationFee.toString() ?? '0',
        comments: `Transaction ID:${''},Booking Number:${
          payloadState?.bookingID
        },`,
        AppointmentNumber: payloadState?.bookingID ?? 'BAHOP-2972192',
        transaction_id: '',
      };
      setLoadingCall(true);
      console.log(payload);

      try {
        const response = await advancePay(payload);
        console.log(response, payload);

        if (response && response?.status == 200 && response?.success == true) {
          setLoadingCall(false);
          ToastService.success('Appointment Booked Successfully');
          navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {name: routes.Dashboard},
                {
                  name: routes.AppointmentConfirmed,
                  params: {
                    mrn: payloadState?.final?.mrn || 'BAHTMP-761149',
                    appointment: {
                      ...payloadState?.final,
                      doctor_name: doctorDetail?.name,
                      bookingId: payloadState?.bookingID,
                    },
                  },
                },
              ],
            }),
          );
        } else {
          setLoadingCall(false);
          ToastService.error(response.message);
        }
      } catch (error: any) {
        setLoadingCall(false);
        ToastService.error(
          'Error',
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong',
        );
      }
    }
  };

  const updateSlot = (slot: any, paymenttype: string, time: any) => {
    setSelectedSlot(slot);
    if (!appointmentnumber) {
      getConsultationFee(
        selectedPatient,
        selectedDate,
        slot,
        paymenttype,
        time,
      );
    }
  };

  // ---------- RENDER ----------
  return (
    <View style={styles.mainContainer}>
      {/* COMMON HEADER */}
      <Header showLocation ref={headerRef} />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent}>
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
        {/* DOCTOR DETAILS CARD */}
        <DoctorDetailsCard
          doctorDetail={doctorDetail}
          doctorSpecialitites={doctorSpecialities}
          appointmentType={typeOfAppointment}
          onConsultationPress={setTypeOfAppointment}
          about
        />
        {/* BRANCH DETAILS */}
        <View
          style={[
            styles.patientContainer,
            {
              borderBottomLeftRadius: !selectedPatient ? w * 0.1 : 0,
              borderBottomRightRadius: !selectedPatient ? w * 0.1 : 0,
            },
          ]}>
          {typeOfAppointment ? (
            <View style={styles.flex}>
              <Image
                source={require('../../../assets/images/map-icon.png')}
                style={styles.flexImg}
              />
              <View>
                <Text
                  style={[
                    styles.flexHead,
                    {fontFamily: 'ProximaNovaA-Semibold'},
                  ]}>
                  Location
                </Text>
                {/* <Text style={[styles.flexHead, {fontSize: adjust(12)}]}>
                {branch?.name}
              </Text> */}

                <Dropdown
                  style={styles.dropdownSelect}
                  iconColor={
                    appointmentnumber ? pallette.pale_turquoise : pallette.black
                  }
                  selectedTextStyle={styles.selectedTextContry}
                  placeholderStyle={styles.placeholderCountry}
                  maxHeight={200}
                  disable={appointmentnumber}
                  value={selectedLocation}
                  data={locations}
                  valueField={'value'}
                  labelField={'label'}
                  placeholder="Select Location"
                  containerStyle={styles.dropdownList}
                  itemTextStyle={styles.selectedTextContry}
                  activeColor={pallette.pale_turquoise}
                  onChange={(item: FamilyMember) => {
                    setSelectedLocation(item?.value);
                    scrollRef.current?.scrollToEnd();
                    // getConsultationFee(item.PatientID);
                  }}
                />
              </View>
            </View>
          ) : (
            <Text
              style={[
                styles.flexHead,
                {
                  fontFamily: 'ProximaNovaA-Semibold',
                  marginVertical: h * 0.02,
                  textAlign: 'center',
                },
              ]}>
              Please select an appointment type.
            </Text>
          )}
          {/* PATIENT DROPDOWN */}
          {selectedLocation && (
            <View style={styles.flex}>
              <Image
                source={require('../../../assets/images/booked-for-icon.png')}
                style={styles.flexImg}
              />
              <View style={{flex: 1}}>
                <Text
                  style={[
                    styles.flexHead,
                    {fontFamily: 'ProximaNovaA-Semibold'},
                  ]}>
                  {appointmentnumber ? 'Re-Scheduling' : 'Booking'} for
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 5,
                  }}>
                  <Dropdown
                    style={[styles.dropdownSelect, {flex: 1}]}
                    iconColor={
                      appointmentnumber
                        ? pallette.pale_turquoise
                        : pallette.black
                    }
                    selectedTextStyle={styles.selectedTextContry}
                    placeholderStyle={styles.placeholderCountry}
                    maxHeight={200}
                    disable={appointmentnumber}
                    value={selectedPatient}
                    data={familyMembers}
                    valueField="PatientID"
                    labelField="PatientName"
                    placeholder="Select Patient"
                    containerStyle={styles.dropdownList}
                    itemTextStyle={styles.selectedTextContry}
                    activeColor={pallette.pale_turquoise}
                    onChange={(item: FamilyMember) => {
                      setSelectedPatient(item.PatientID);
                      scrollRef.current?.scrollToEnd();
                    }}
                  />

                  {/* Add Patient Button */}
                  <TouchableOpacity
                    style={styles.addPatientBtn}
                    onPress={() =>
                      navigation.navigate(routes.AddFamily as never)
                    }>
                    <Text style={styles.addPatientTxt}>+ Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          {/* PAYMENT TYPE DROPDOWN */}
          {selectedPatient && (
            <View style={styles.flex}>
              <Image
                source={require('../../../assets/images/booked-for-icon.png')}
                style={styles.flexImg}
              />
              <View>
                <Text
                  style={[
                    styles.flexHead,
                    {fontFamily: 'ProximaNovaA-Semibold'},
                  ]}>
                  Payment Type
                </Text>
                <Dropdown
                  style={styles.dropdownSelect}
                  iconColor={pallette.black}
                  selectedTextStyle={styles.selectedTextContry}
                  placeholderStyle={styles.placeholderCountry}
                  maxHeight={200}
                  value={typeOfPayment}
                  data={
                    typeOfAppointment == 'Video'
                      ? payment_types.slice(0, -1)
                      : payment_types
                  }
                  valueField="value"
                  labelField="label"
                  placeholder="Select Payment Type"
                  containerStyle={styles.dropdownList}
                  itemTextStyle={styles.selectedTextContry}
                  activeColor={pallette.pale_turquoise}
                  onChange={item => {
                    setTypeOfPayment(item?.value);
                    setSelectedPayment(item?.label);
                    scrollRef.current?.scrollToEnd();
                  }}
                />
              </View>
            </View>
          )}
        </View>

        {/* SESSIONS AND SLOTS COMPONENT */}
        {typeOfPayment &&
          (sessions.length ? (
            <SlotSelection
              sessions={sessions}
              slots={slots}
              selectedTime={selectedTime}
              selectedSlot={selectedSlot}
              onDateClick={loadSlots}
              onSelectSlot={(slotId: string, time: string) => {
                updateSlot(slotId, selectedPayment, time);
                setSelectedTime(time);
                scrollRef.current?.scrollToEnd();
              }}
              styles={styles}
            />
          ) : (
            <NotFound
              text="No Sessions Found"
              margin={h * 0.05}
              change={() => headerRef.current?.openModal()}
            />
          ))}

        {/* PAYMENT SUMMARY */}
        {selectedSlot && !appointmentnumber && (
          <View style={{marginVertical: h * 0.02}}>
            <View
              style={[styles.paymentBlock, {backgroundColor: pallette.teal}]}>
              <Text style={[styles.paymentTxt, {color: pallette.white}]}>
                Total Charges
              </Text>
            </View>
            <View
              style={[
                styles.paymentBlock,
                {backgroundColor: pallette.pale_turquoise},
              ]}>
              <Text
                style={[
                  styles.paymentTxt,
                  {
                    color: pallette.black,
                    fontFamily: 'ProximaNovaA-Semibold',
                  },
                ]}>
                Consultation Fee
              </Text>
              <Text
                style={[
                  styles.paymentTxt,
                  {
                    color: pallette.black,
                    fontFamily: 'ProximaNovaA-Semibold',
                  },
                ]}>
                ₹ {consultationFee}
              </Text>
            </View>
          </View>
        )}

        {/* Sticky Timer */}
        {isFocused && secondsLeft > 0 && timerStarted && (
          <View style={styles.timerContainer}>
            <Text
              style={{
                fontSize: adjust(12),
                fontWeight: 'bold',
                color: pallette.black,
                textAlign: 'center',
              }}>
              You have{' '}
              <Text style={{fontWeight: 'condensedBold', color: pallette.red}}>
                {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
                {String(secondsLeft % 60).padStart(2, '0')}
              </Text>{' '}
              seconds to confirm this booking.
            </Text>
          </View>
        )}

        {/* PROCEED BUTTON */}
        {appointmentnumber && (
          <TouchableOpacity
            disabled={!selectedSlot}
            onPress={() =>
              proceedPayment(
                selectedPayment,
                selectedSlot,
                selectedTime,
                patientId,
              )
            }
            style={[
              styles.formButton,
              {backgroundColor: selectedSlot ? pallette.dark_purple : 'grey'},
            ]}>
            <Text style={styles.formButtonText}>Confirm Reschedule</Text>
          </TouchableOpacity>
        )}
        {selectedSlot && !appointmentnumber && (
          <TouchableOpacity
            disabled={!selectedSlot}
            onPress={() => updatePayment(selectedPayment)}
            style={[
              styles.formButton,
              {backgroundColor: pallette.dark_purple},
            ]}>
            <Text style={styles.formButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Footer />
      {(loading || loadingPayment || loadingCall) && <Loader />}
    </View>
  );
};

export default DoctorSlotSelection;

// ---------- STYLES ----------
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: pallette.white,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    minHeight: h * 0.8,
  },
  patientContainer: {
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    paddingBottom: h * 0.03,
  },
  calenderContainer: {
    backgroundColor: pallette.white,
    width: '90%',
    alignSelf: 'center',
    borderBottomLeftRadius: w * 0.1,
    borderBottomRightRadius: w * 0.1,
    paddingBottom: h * 0.03,
  },
  timeBtn: {
    width: w * 0.18,
    height: h * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: w * 0.02,
  },
  timeTxt: {
    color: pallette.black,
    lineHeight: 20,
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Regular',
    marginHorizontal: w * 0.02,
    textAlign: 'center',
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  selectedTime: {
    color: pallette.white,
  },
  centeredTxt: {
    color: pallette.dark_purple,
    textAlign: 'center',
    fontSize: adjust(14),
    fontFamily: 'ProximaNovaA-Semibold',
  },
  timeList: {
    width: '100%',
    alignItems: 'flex-start',
    alignSelf: 'center',
    marginVertical: 10,
    gap: w * 0.02,
  },
  viewToggle: {
    marginTop: h * 0.02,
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    borderBottomWidth: 1,
    borderBottomColor: pallette.white,
    width: 90,
    paddingBottom: 5,
    textAlign: 'center',
    alignSelf: 'center',
  },
  noSlots: {
    marginTop: h * 0.02,
    fontFamily: 'ProximaNovaA-Regular',
    fontSize: adjust(12),
    borderBottomWidth: 1,
    borderBottomColor: pallette.white,
    paddingBottom: 5,
    textAlign: 'center',
    alignSelf: 'center',
    color: pallette.dark_purple,
  },
  formButton: {
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
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
  flex: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: w * 0.02,
    marginTop: h * 0.01,
    paddingHorizontal: w * 0.02,
  },
  flexImg: {
    height: h * 0.05,
    width: w * 0.1,
    resizeMode: 'contain',
  },
  flexHead: {
    fontSize: adjust(12),
    color: pallette.black,
    fontFamily: 'ProximaNovaA-Regular',
  },
  paymentBlock: {
    paddingVertical: h * 0.01,
    paddingStart: w * 0.1,
    paddingEnd: w * 0.05,
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentTxt: {
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Regular',
  },
  payBtnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: h * 0.02,
    width: '90%',
    alignSelf: 'center',
  },
  payBtn: {
    padding: w * 0.03,
    justifyContent: 'center',
    alignItems: 'center',
    width: '48%',
    borderRadius: w * 0.04,
    backgroundColor: pallette.dark_purple,
  },
  payBtnTxt: {
    fontSize: adjust(12),
    color: pallette.white,
    fontFamily: 'ProximaNovaA-Semibold',
  },
  dropdownSelect: {
    backgroundColor: pallette.pale_turquoise,
    height: 30,
    marginTop: 5,
    width: w * 0.6,
    paddingHorizontal: w * 0.04,
    borderRadius: w * 0.1,
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
  timerContainer: {
    width: w * 0.9,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: w * 0.02,
    backgroundColor: '#e5e5e5',
  },
  timerText: {
    color: pallette.white,
    fontSize: adjust(12),
    fontFamily: 'ProximaNovaA-Bold',
  },
  addPatientBtn: {
    backgroundColor: pallette.dark_purple,
    paddingHorizontal: w * 0.03,
    paddingVertical: h * 0.01,
    borderRadius: w * 0.05,
    marginLeft: w * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPatientTxt: {
    color: pallette.white,
    fontSize: adjust(11),
    fontFamily: 'ProximaNovaA-Semibold',
  },
});
