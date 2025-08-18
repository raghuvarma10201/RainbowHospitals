import {PixelRatio, Platform} from 'react-native';
import {MainStackParamList} from '../navigation/types';
import {div, w} from '../Constants/Constant';

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
