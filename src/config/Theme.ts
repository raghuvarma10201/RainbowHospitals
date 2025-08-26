// src/config/theme.ts
import {DefaultTheme} from 'react-native-paper';
import {pallette} from '../constants/constants';

export const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: pallette.dark_purple,
    background: pallette.white,
  },
} as const;
