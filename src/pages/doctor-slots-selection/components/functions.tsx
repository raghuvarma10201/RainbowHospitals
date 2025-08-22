import React, {useEffect, useState, useCallback} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {useApp} from '../../../context/app-context';
import {
  getDoctorDetail,
  getDoctorSessions,
  getDoctorSlots,
} from '../../../services/common';
import {ToastService} from '../../../utils/ToastService';

interface Slot {
  SlotID: string;
  SessionStartDttm: string;
}

// ---------- TIME FORMATTING ----------
export const formatTime24Hour = (dateTimeString: string): string => {
  const date = new Date(dateTimeString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// ---------- RENDER SLOT COMPONENT ----------
interface RenderSlotProps {
  item: Slot;
  selectedTime: string;
  onSelect: (slotId: string, time: string) => void;
  styles: any;
}

export const RenderSlot: React.FC<RenderSlotProps> = ({
  item,
  selectedTime,
  onSelect,
  styles,
}) => {
  const time = formatTime24Hour(item.SessionStartDttm);
  const isSelected = selectedTime === time;

  return (
    <TouchableOpacity
      style={styles.timeBtn}
      onPress={() => onSelect(item.SlotID, time)}>
      <Text style={[styles.timeTxt, isSelected && styles.selectedTime]}>
        {time}
      </Text>
    </TouchableOpacity>
  );
};

export const useDoctorSlots = (doctorId: number, typeOfAppointment: string) => {
  const {branch} = useApp();
  const [doctorDetail, setDoctorDetail] = useState<any>({});
  const [doctorSpecialities, setDoctorSpecialities] = useState('');
  const [sessions, setSessions] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const loadDoctor = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDoctorDetail(doctorId);
      if (response?.status === 200 && response.data) {
        const detail = response.data;
        setDoctorDetail(detail);
        setDoctorSpecialities(
          detail.doctor_specialities
            .map((i: any) => i.speciality?.name)
            .filter(Boolean)
            .join(', '),
        );
        await loadSessions(detail);
      } else {
        ToastService.error(
          'Error',
          response?.message || 'Failed to load doctor',
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [doctorId, typeOfAppointment]);

  const loadSessions = useCallback(
    async (docData: any) => {
      try {
        const payload = {
          CareproviderCode: docData.new_doctor_UID,
          OrganisationUID: branch?.organisation?.organisationid?.toString(),
          AppointmentType: typeOfAppointment,
          noofdays: '30',
        };
        console.log(branch, payload);

        const response = await getDoctorSessions(payload);
        if (response?.status === 200 && response.data?.length) {
          const uniqueSessions = response.data.filter(
            (session: any, index: number, self: any[]) =>
              index ===
              self.findIndex(s => s.SessionDate === session.SessionDate),
          );
          setSessions(uniqueSessions);
          if (uniqueSessions.length) {
            await loadSlots(
              uniqueSessions[0].SessionDate,
              uniqueSessions[0].SessionDefinitionUID1,
            );
          }
        } else {
          setSessions([]);
          setSlots([]);
          ToastService.error('Error', 'No Sessions Available');
        }
      } catch (e) {
        console.error(e);
      }
    },
    [branch?.organisation?.organisationid, typeOfAppointment],
  );

  const loadSlots = useCallback(
    async (sessionDate: string, sessionId: string) => {
      setSlots([]);
      const formattedDate = new Date(sessionDate).toISOString().split('T')[0];
      setSelectedDate(formattedDate);

      try {
        const payload = {
          SessionDefinitionUID: sessionId,
          AppointmentDate: formattedDate,
          OrganisationUID: branch?.organisation?.organisationid?.toString(),
          AppointmentType: typeOfAppointment,
        };
        const response = await getDoctorSlots(payload);
        if (response?.status === 200 && response.data) {
          setSlots(response.data);
        } else {
          ToastService.error('Error', response?.message || 'No slots found');
        }
      } catch (e) {
        console.error(e);
      }
    },
    [branch?.organisation?.organisationid, typeOfAppointment],
  );

  useEffect(() => {
    loadDoctor();
  }, [loadDoctor]);

  return {
    doctorDetail,
    doctorSpecialities,
    sessions,
    slots,
    selectedDate,
    loadSlots,
    loading,
  };
};
