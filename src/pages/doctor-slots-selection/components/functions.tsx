import React, {useEffect, useState, useCallback} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {useApp} from '../../../context/app-context';
import {
  getDoctorDetail,
  getDoctorSessions,
  getDoctorSlots,
} from '../../../services/common';
import {ToastService} from '../../../utils/service-handlers';
import {pallette} from '../../../constants/constants';

interface Slot {
  SlotID: string;
  SessionStartDttm: string;
}

// ---------- TIME FORMATTING ----------
export const formatTo12Hour = (time: string) => {
  const date = new Date(time);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours}:${formattedMinutes} ${ampm}`;
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
  const time = formatTo12Hour(item.SessionStartDttm);
  const isSelected = selectedTime === time;

  return (
    <TouchableOpacity
      style={[
        styles.timeBtn,
        {
          backgroundColor: isSelected
            ? pallette.medium_turquoise
            : pallette.white,
        },
      ]}
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
  const [locations, setLocations] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const loadDoctor = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDoctorDetail(doctorId);
      if (response?.status === 200 && response.data) {
        const detail = response.data;
        const doctorLocations = response.data.doctor_branches.map((e: any) => ({
          ...e,
          value: e.branch.organisation.organisationid.toString(),
          label: `${e.branch.name},${e.branch.organisation.city}`,
        }));
        setLocations(doctorLocations);
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
    } catch (error: any) {
      ToastService.error(
        'Error',
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong',
      );
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
      } catch (error: any) {
        ToastService.error(
          'Error',
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong',
        );
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
      } catch (error: any) {
        ToastService.error(
          'Error',
          error?.response?.data?.message ||
            error?.message ||
            'Something went wrong',
        );
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
    locations,
  };
};
