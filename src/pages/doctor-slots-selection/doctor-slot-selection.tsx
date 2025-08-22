// ---------- MODULE IMPORTS ----------
import React, {useState} from 'react';
import {
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
import {bookAppointment} from '../../services/common';
import {useApp} from '../../context/app-context';
import {ToastService} from '../../utils/ToastService';
import {MainStackParamList} from '../../navigation/types';
import {routes} from '../../utils/enums';
import {AppointmentPayload} from '../../types/Appointment';
import {h, pallette, w} from '../../Constants/Constant';
import {adjust} from '../../utils/commonFunctions';
import DoctorDetailsCard from '../../components/doctor-details-card';

// ---------- COMPONENT ----------
const DoctorSlotSelection: React.FC = ({route}: any) => {
  // ---------- STATE AND CONTEXT DECLARATION ----------
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {doctorId, appointmentType, OrganisationID, appointmentnumber} =
    route.params;
  const {appointment, branch, updateAppointment} = useApp();
  const [typeOfAppointment, setTypeOfAppointment] = useState(appointmentType);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);

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

  // ---------- EVENT HANDLERS ----------
  const proceedPayment = async () => {
    if (!selectedSlot) return;
    setLoadingPayment(true);
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
            CommonActions.reset({index: 0, routes: [{name: routes.Dashboard}]}),
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
          comment: appointment?.comment ?? '',
          mrn: appointment?.mrn ?? '',
          OrganisationUID: branch?.organisation?.organisationid.toString(),
          transaction_id: appointment?.transaction_id ?? '',
          price: appointment?.price ?? 0,
          payment_type: appointment?.payment_type ?? 'CASH',
          orgcode: branch?.organisation?.code || '',
          ...commonPayload,
        };
        await updateAppointment(blockPayload);
        navigation.navigate('SlotConfirmation', {
          doctor: doctorDetail,
          doctorSpecialitites: doctorSpecialities,
        });
      }
    } catch (error) {
      console.error('Error in proceedPayment:', error);
      ToastService.error('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoadingPayment(false);
    }
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
        {/* SESSIONS AND SLOTS COMPONENT */}
        <SlotSelection
          sessions={sessions}
          slots={slots}
          selectedTime={selectedTime}
          selectedSlot={selectedSlot}
          onDateClick={loadSlots}
          onSelectSlot={(slotId: string, time: string) => {
            setSelectedSlot(slotId);
            setSelectedTime(time);
          }}
          styles={styles}
        />
        {/* PROCEED BUTTON */}
        <TouchableOpacity
          disabled={!selectedSlot}
          onPress={proceedPayment}
          style={[
            styles.formButton,
            {backgroundColor: selectedSlot ? pallette.app_purple : 'grey'},
          ]}>
          <Text style={styles.formButtonText}>
            {appointmentnumber ? 'Confirm Reschedule' : 'Proceed To Confirm'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {/* COMMON FOOTER */}
      <Footer />
      {/* LOADER */}
      {(loading || loadingPayment) && <Loader />}
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
    color: pallette.app_medium_green,
  },
  centeredTxt: {
    color: pallette.app_purple,
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
    color: pallette.app_purple,
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
});
