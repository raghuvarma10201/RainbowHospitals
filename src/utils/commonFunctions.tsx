import {MainStackParamList} from '../navigation/types';

export const navigateTo = (
  navigation: any,
  path: keyof MainStackParamList,
  data?: any,
) => {
  navigation.navigate(path as any, data);
};
