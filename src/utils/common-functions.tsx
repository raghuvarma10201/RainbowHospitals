import {PixelRatio, Platform} from 'react-native';
import {MainStackParamList} from '../navigation/types';
import {div, w} from '../constants/constants';

export const navigateTo = (
  navigation: any,
  path: keyof MainStackParamList,
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
