// ---------- MODULE IMPORTS ----------
import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
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
import CommonHeader from '../../components/Header';
import Footer from '../../components/Footer';
import {DynamicWeekWithMonth} from '../../components/WeeklyCalender';
import Loader from '../../components/Loader';
import DoctorDetailsCard from '../../components/DoctorDetailsCard';

// ---------- OTHER IMPORTS ----------
import {
  bookAppointment,
  getDoctorDetail,
  getDoctorSessions,
  getDoctorSlots,
} from '../../services/common';
import {ToastService} from '../../utils/ToastService';
import {useApp} from '../../context/AppContext';
import {useTimer} from '../../context/TimeContext';
import {MainStackParamList} from '../../navigation/types';
import {routes} from '../../utils/enums';
import {h, pallette, w} from '../../Constants/Constant';
import {adjust} from '../../utils/commonFunctions';
import {AppointmentPayload} from '../../types/Appointment';

// ---------- TYPES ----------
interface DoctorSession {
  SessionDate: string;
  SessionDefinitionUID1: string;
}

interface Slot {
  SlotID: string;
  SessionStartDttm: string;
}

// ---------- COMPONENT ----------
const DoctorSlotSelection: React.FC = ({route}: any) => {
  // ---------- STATE AND CONTEXT DECLARATION ----------
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {doctorId, appointmentType, OrganisationID, appointmentnumber} =
    route.params;
  const {branch, appointment, updateAppointment} = useApp();
  const [doctorDetail, setDoctorDetail] = useState<any>({});
  const [doctorSessions, setDoctorSessions] = useState<DoctorSession[]>([]);
  const [doctorSlots, setDoctorSlots] = useState<Slot[]>([]);
  const [doctorSpecialities, setDoctorSpecialities] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [viewAll, setViewAll] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // ---------- LIFECYCLE ----------
  useEffect(() => {
    loadDoctor();
  }, []);

  // ---------- CALLBACK FUNCTIONS ----------
  const loadDoctor = async () => {
    try {
      setLoading(true);
      const response = await getDoctorDetail(doctorId);

      if (response?.status === 200 && response?.data) {
        const detail = response.data;
        setDoctorDetail(detail);
        const specialityNames = detail.doctor_specialities
          .map((item: any) => item.speciality?.name)
          .filter(Boolean)
          .join(', ');
        setDoctorSpecialities(specialityNames);

        await getSessions(detail);
      } else {
        ToastService.error(
          'Error',
          response?.message || 'Failed to load doctor',
        );
      }
    } catch (error) {
      console.error('Failed to load doctor:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSessions = async (docData: any) => {
    try {
      setLoading(true);
      const payload = {
        CareproviderCode: docData.new_doctor_UID,
        OrganisationUID: branch?.id?.toString(),
        AppointmentType: appointmentType,
        noofdays: '30',
      };
      const response = await getDoctorSessions(payload);
      if (response?.status === 200 && response.data?.length) {
        const uniqueSessions = response.data.filter(
          (session: DoctorSession, index: number, self: DoctorSession[]) =>
            index ===
            self.findIndex(s => s.SessionDate === session.SessionDate),
        );
        setDoctorSessions(uniqueSessions);
        if (uniqueSessions?.length) {
          getSlots(
            uniqueSessions[0].SessionDate,
            uniqueSessions[0].SessionDefinitionUID1,
          );
        }
      } else {
        setDoctorSessions([]);
        ToastService.error('Error', 'No Sessions Available');
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSlots = async (sessionDate: string, sessionId: string) => {
    setDoctorSlots([]);
    setSelectedSlot('');
    setSelectedTime('');
    setViewAll(false);
    const formattedDate = new Date(sessionDate).toISOString().split('T')[0];
    setSelectedDate(formattedDate);
    try {
      setLoading(true);
      const payload = {
        SessionDefinitionUID: sessionId,
        AppointmentDate: formattedDate,
        OrganisationUID: branch?.id?.toString(),
        AppointmentType: appointment,
      };
      const response = await getDoctorSlots(payload);
      if (response?.status === 200 && response.data) {
        setDoctorSlots(response.data);
      } else {
        ToastService.error('Error', response?.message || 'No slots found');
      }
    } catch (error) {
      console.error('Failed to load slots:', error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- CONVERSION FUNCTION ----------
  const formatTime24Hour = (dateTimeString: string): string => {
    const date = new Date(dateTimeString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // ---------- EVENT HANDLING FUNCTIONS ----------
  const proceedPayment = async () => {
    try {
      setLoading(true);
      if (appointmentnumber) {
        const obj: AppointmentPayload = {
          status: 'RESCHEDULE',
          appointmentnumber,
          slotid: selectedSlot,
          date: selectedDate,
          time: selectedTime,
          comment: '',
          mrn: (await AsyncStorage.getItem('mrn')) || '',
          OrganisationUID: OrganisationID,
          AppointmentType: appointmentType,
        };
        const response = await bookAppointment(obj);
        if (response?.status === 200 && response?.success) {
          ToastService.success(
            'Success',
            'Appointment Rescheduled Successfully',
          );
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{name: routes.Dashboard}],
            }),
          );
        } else {
          ToastService.error(
            'Error',
            response?.message || 'Failed to reschedule',
          );
        }
      } else {
        console.log(appointment?.payment_type);
        await updateAppointment({
          status: 'BLOCK',
          comment: appointment?.comment ?? '',
          mrn: appointment?.mrn ?? '',
          OrganisationUID: '2',
          AppointmentType: appointmentType ?? '',
          slotid: selectedSlot,
          date: selectedDate,
          time: selectedTime,
          transaction_id: appointment?.transaction_id ?? '',
          price: appointment?.price ?? 0,
          payment_type: appointment?.payment_type ?? 'CASH',
          orgcode: branch?.organisation?.code || '',
        });
        navigation.navigate('SlotConfirmation', {
          doctor: doctorDetail,
          doctorSpecialitites: doctorSpecialities,
        });
      }
    } catch (error) {
      console.error('Failed to confirm appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  // ---------- TIME SLOT ----------
  const renderSlot = useCallback(
    ({item}: {item: Slot}) => {
      const time = formatTime24Hour(item.SessionStartDttm);
      const isSelected = selectedTime === time;

      return (
        <TouchableOpacity
          style={styles.timeBtn}
          onPress={() => {
            setSelectedSlot(item.SlotID);
            setSelectedTime(time);
          }}>
          <Text style={[styles.timeTxt, isSelected && styles.selectedTime]}>
            {time}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedTime],
  );

  // ---------- RENDER ----------
  return (
    <View style={styles.mainContainer}>
      {/* Common Header */}
      <CommonHeader showLocation />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Doctor Info Card */}
        <DoctorDetailsCard
          doctorDetail={doctorDetail}
          doctorSpecialitites={doctorSpecialities}
          about
        />
        {/* Calendar + Slots */}
        <View style={styles.calenderContainer}>
          {doctorSessions.length > 0 && (
            <DynamicWeekWithMonth
              sessions={doctorSessions}
              onDateClick={getSlots}
            />
          )}
          <Text style={[styles.centeredTxt, {marginVertical: 5}]}>
            Available Time
          </Text>
          {doctorSlots.length > 0 ? (
            <>
              <FlatList
                data={
                  doctorSlots.length > 10
                    ? viewAll
                      ? doctorSlots
                      : doctorSlots.slice(0, 10)
                    : doctorSlots
                }
                contentContainerStyle={styles.timeList}
                numColumns={5}
                keyExtractor={(item, index) => `${item.SlotID}-${index}`}
                renderItem={renderSlot}
              />
              {doctorSlots.length > 10 && (
                <TouchableOpacity onPress={() => setViewAll(prev => !prev)}>
                  <Text style={styles.viewToggle}>
                    {viewAll ? 'View Less' : 'View More'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.noSlots}>No Slots Available</Text>
          )}
        </View>

        {/* Confirm Button */}
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
      {loading && <Loader />}
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
