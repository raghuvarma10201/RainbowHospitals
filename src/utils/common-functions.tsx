import {PixelRatio, Platform} from 'react-native';
import {AuthStackParamList, MainStackParamList} from '../types/navigation';
import {div, w} from '../constants/constants';
import {getAppointments} from '../services/common';
import {AppointmentPayload, upcomingApointment} from './types';

export const navigateTo = (
  navigation: any,
  path: keyof MainStackParamList | keyof AuthStackParamList,
  data?: any,
) => {
  navigation.navigate(path as any, data);
};

export const adjust = (size: number) => {
  const scale = w / 320;
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return size / div;
  }
};

export const formatAppointmentDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const formatted = date.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatted.replace(',', ' at');
};
export const formatAppointmentTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const formatted = date.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return formatted.replace(',', ' at');
};
export const formatAppointmentDateTime = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const formatted = date.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return formatted.replace(',', ' at');
};

// export const isBeforeTwoHours = (
//   givenDttm: any,
//   slotStartDttm: any,
//   hoursBefore: number = 2,
// ) => {
//   const givenTime: any = new Date(givenDttm);
//   const slotTime: any = new Date(slotStartDttm);

//   // difference in milliseconds
//   const diffMs = slotTime - givenTime;

//   // convert ms → hours
//   const diffHours = diffMs / (1000 * 60 * 60);

//   return diffHours >= hoursBefore;
// };

export const isBeforeTwoHours = (
  givenDttm: string | Date,
  slotStartDttm: string | Date,
  hoursBefore: number = 2,
): boolean => {
  const givenTime = new Date(givenDttm);
  const slotTime = new Date(slotStartDttm);

  // If invalid date inputs, return false
  if (isNaN(givenTime.getTime()) || isNaN(slotTime.getTime())) {
    return false;
  }

  // Calculate difference in milliseconds
  const diffMs = slotTime.getTime() - givenTime.getTime();

  // Convert ms → hours
  const diffHours = diffMs / (1000 * 60 * 60);

  // If slot is before given time (past), return false
  if (diffHours < 0) {
    return false;
  }

  // Ensure that the slot date is same or later
  const givenDate = givenTime.toDateString();
  const slotDate = slotTime.toDateString();

  // Only allow same or future dates, and must be at least 'hoursBefore' away
  return (
    slotTime >= givenTime && diffHours >= hoursBefore && slotDate >= givenDate
  );
};

export const isAfterTwoHours = (
  givenDttm: any,
  slotStartDttm: any,
  hoursAfter: number = 2,
) => {
  const givenTime: any = new Date(givenDttm);
  const slotTime: any = new Date(slotStartDttm);

  // difference in milliseconds
  const diffMs = slotTime - givenTime;

  // convert ms → hours
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours <= hoursAfter;
};

export const isPreviousDay = (date: any) => {
  const slotDate = new Date(date);
  const today = new Date();

  // Normalize times so that the comparison only checks the date part
  const isPast = slotDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
  return isPast;
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

export const filterAppointment = async (id: string, appId: string) => {
  try {
    const payload = {
      patientId: id,
    };
    const response = await getAppointments(payload);
    if (response && response.status == 200) {
      const filteredAppointment = response.data.filter(
        (apts: upcomingApointment) => apts.BookingUID == appId,
      )[0];
      console.log(filteredAppointment);

      return filteredAppointment;
    } else {
      return {};
    }
  } catch (error: any) {
    return {};
  } finally {
  }
};
