// ---------- MODULE IMPORTS ----------
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------- COMPONENT IMPORTS ----------
import {SlotSelection} from '.';
import {useDoctorSlots} from './components/functions';
import {Footer, Header, Loader} from '../../components';

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
import {AppointmentPayload, FamilyMember} from '../../utils/types';
import {h, pallette, w} from '../../constants/constants';
import {adjust} from '../../utils/common-functions';
import DoctorDetailsCard from '../../components/doctor-details-card';
import {Dropdown} from 'react-native-element-dropdown';
import {useSettings} from '../../context/settings-context';
import {useTimer} from '../../context/timer-context';

// ---------- COMPONENT ----------
const DoctorSlotSelection: React.FC = ({route}: any) => {
  // ---------- STATE AND CONTEXT DECLARATION ----------
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {
    doctorId,
    appointmentType,
    OrganisationID,
    appointmentnumber,
    details,
  } = route.params;
  console.log(details);

  const {branch, updateAppointment} = useApp();
  const {settings} = useSettings();
  const {startTimer} = useTimer();
  const [typeOfAppointment, setTypeOfAppointment] = useState(appointmentType);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedD, setSelectedD] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loadingCall, setLoadingCall] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | undefined>(
    details?.PatientID || '',
  );
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [consultationFee, setConsultationFee] = useState<number>(0);
  const [registrationFee, setRegistrationFee] = useState<number>(0);

  // ---------- LIFECYCLE ----------
  const {
    doctorDetail,
    doctorSpecialities,
    sessions,
    slots,
    selectedDate,
    loadSlots,
    loading,
  } = useDoctorSlots(doctorId, typeOfAppointment);

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
    } catch (error) {
      console.error('Failed to load Family Members:', error);
    } finally {
    }
  }, []);

  useEffect(() => {
    (async () => {
      const storedNumber = await AsyncStorage.getItem('mobileNumber');
      if (storedNumber) {
        setPhoneNumber(storedNumber);
        await getFamilyMembers(storedNumber);
      }
    })();
  }, [getFamilyMembers]);

  const getConsultationFee = useCallback(
    async (mrn: string | undefined, date: any, slot: any) => {
      if (!branch) return;
      try {
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
        } else {
          ToastService.error(
            'Error',
            response?.message || 'Unable to fetch fee',
          );
        }
      } catch (error) {
        console.error('Failed to load Consultation Fee:', error);
      } finally {
      }
    },
    [branch, doctorDetail, updateAppointment],
  );

  // ---------- EVENT HANDLERS ----------
  const proceedPayment = async (paymenttype?: boolean) => {
    if (!selectedSlot) return;
    setLoadingPayment(true);
    const txnid = `TXN_${Date.now()}`;
    try {
      const commonPayload = {
        slotid: selectedSlot,
        date: selectedDate,
        time: selectedTime,
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
          mrn: selectedPatient ?? '',
          OrganisationUID: branch?.organisation?.organisationid.toString(),
          transaction_id: paymenttype ? txnid ?? '' : '',
          price: consultationFee ?? 0,
          payment_type: paymenttype ? 'PayU' : 'PAYATHOSPITAL',
          orgcode: branch?.organisation?.code || '',
          Visittype: 'First Visit',
          careprovider_code: doctorDetail.new_doctor_UID,
          expirytime:
            (paymenttype
              ? settings?.onlineBookingInterval ?? 0
              : settings?.physicalBookingInterval ?? 0) / 60,
          ...commonPayload,
        };

        try {
          const response = await bookAppointment(blockPayload);
          console.log(response);

          if (response && response.status == 200 && response.success == true) {
            if (paymenttype) {
              // startTimer(settings?.onlineBookingInterval || 10);
              startTimer(1);
              navigation.navigate('PayUWebView', {
                finalPayload: {...blockPayload, registrationFee},
                bookingId: response?.data?.his_booking_id,
                payuUrl: 'https://test.payu.in/_payment',
              });
            } else {
              updatePayment(
                {...blockPayload, registrationFee},
                response?.data?.his_booking_id,
              );
            }
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
          console.log(error);
        } finally {
        }
      }
    } catch (error) {
      console.error('Error in proceedPayment:', error);
      ToastService.error('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoadingPayment(false);
    }
  };

  const updatePayment = useCallback(
    async (finalPayload: any, bookingId: any) => {
      const payload = {
        orgcode: finalPayload?.orgcode ?? '40FD',
        mrn: finalPayload?.mrn ?? 'BAHTMP-761149',
        paidby: finalPayload?.payment_type == 'CASH' ? 'PAYATHOSPOTAL' : 'PAYU',
        ConsultationFee: finalPayload?.price.toString() ?? '0',
        RegistrationFee: finalPayload.registrationFee.toString() ?? '0',
        comments: `Transaction ID:${''},Booking Number:${bookingId},`,
        AppointmentNumber: bookingId ?? 'BAHOP-2972192',
        transaction_id: '',
      };
      console.log(payload);
      setLoadingCall(true);
      try {
        const response = await advancePay(payload);
        console.log(response, payload);
        if (response && response?.status == 200 && response?.success == true) {
          setLoadingCall(false);
          ToastService.success('appointment Booked Successfully');
          navigation.navigate('AppointmentConfirmed');
        } else {
          setLoadingCall(false);
          ToastService.error(response.message);
          // navigation.navigate('Dashboard');
        }
      } catch (error: any) {
        setLoadingCall(false);
        console.log(error);
      } finally {
      }
    },
    [],
  );

  const updateSlot = (slot: any) => {
    setSelectedSlot(slot);
    getConsultationFee(selectedPatient, selectedDate, slot);
  };

  // ---------- RENDER ----------
  return (
    <View style={styles.mainContainer}>
      {/* COMMON HEADER */}
      <Header showLocation />
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
              <Text style={[styles.flexHead, {fontSize: adjust(12)}]}>
                {branch?.name}
              </Text>
            </View>
          </View>
          {/* PATIENT DROPDOWN */}
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
                {appointmentnumber ? 'Re-Scheduling' : 'Booking'} for
              </Text>
              <Dropdown
                style={styles.dropdownSelect}
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
                activeColor={pallette.pale_turquoise}
                onChange={(item: FamilyMember) => {
                  setSelectedPatient(item.PatientID);
                  // getConsultationFee(item.PatientID);
                }}
              />
            </View>
          </View>
        </View>
        {/* SESSIONS AND SLOTS COMPONENT */}
        {selectedPatient && (
          <SlotSelection
            sessions={sessions}
            slots={slots}
            selectedTime={selectedTime}
            selectedSlot={selectedSlot}
            onDateClick={loadSlots}
            onSelectSlot={(slotId: string, time: string) => {
              updateSlot(slotId);
              setSelectedTime(time);
            }}
            styles={styles}
          />
        )}

        {/* PAYMENT SUMMARY */}
        {selectedSlot && (
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
        {/* PROCEED BUTTON */}
        {appointmentnumber ? (
          <TouchableOpacity
            disabled={!selectedSlot}
            onPress={() => proceedPayment()}
            style={[
              styles.formButton,
              {backgroundColor: selectedSlot ? pallette.dark_purple : 'grey'},
            ]}>
            <Text style={styles.formButtonText}>Confirm Reschedule</Text>
          </TouchableOpacity>
        ) : (
          selectedSlot && (
            <View style={styles.payBtnsContainer}>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    'Confirmation',
                    'Please confirm if you want to proceed to payment.',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {
                          return;
                        },
                      },
                      {
                        text: 'Confirm',
                        onPress: () => proceedPayment(true),
                      },
                    ],
                  )
                }
                style={[
                  styles.payBtn,
                  {backgroundColor: pallette.dark_purple},
                ]}>
                <Text style={styles.payBtnTxt}>Pay Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => proceedPayment(false)}
                style={[styles.payBtn, {backgroundColor: 'grey'}]}>
                <Text style={styles.payBtnTxt}>Pay At Hospital</Text>
              </TouchableOpacity>
            </View>
          )
        )}
      </ScrollView>
      {/* COMMON FOOTER */}
      <Footer />
      {/* LOADER */}
      {(loading || loadingPayment || loadingCall) && <Loader />}
    </View>
  );
};

export default DoctorSlotSelection;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: pallette.white,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    minHeight: h,
  },
  patientContainer: {
    backgroundColor: pallette.light_grey,
    width: '90%',
    alignSelf: 'center',
    paddingBottom: h * 0.03,
  },
  calenderContainer: {
    backgroundColor: pallette.light_grey,
    width: '90%',
    alignSelf: 'center',
    borderBottomLeftRadius: w * 0.1,
    borderBottomRightRadius: w * 0.1,
    paddingBottom: h * 0.03,
  },
  timeBtn: {
    width: 65,
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
    color: pallette.medium_turquoise,
  },
  centeredTxt: {
    color: pallette.dark_purple,
    textAlign: 'center',
    fontSize: adjust(14),
    fontFamily: 'ProximaNovaA-Semibold',
  },
  timeList: {
    width: '90%',
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
    paddingHorizontal: 10,
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
