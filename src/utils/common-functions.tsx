import {PixelRatio, Platform} from 'react-native';
import {AuthStackParamList, MainStackParamList} from '../types/navigation';
import {div, w} from '../constants/constants';

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

export const isBeforeTwoHours = (
  givenDttm: any,
  slotStartDttm: any,
  hoursBefore: number = 2,
) => {
  const givenTime: any = new Date(givenDttm);
  const slotTime: any = new Date(slotStartDttm);

  // difference in milliseconds
  const diffMs = slotTime - givenTime;

  // convert ms → hours
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours >= hoursBefore;
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
