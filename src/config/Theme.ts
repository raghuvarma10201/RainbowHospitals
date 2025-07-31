// src/config/theme.ts
import { DefaultTheme } from 'react-native-paper';

export const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF5400',
    background: '#f6f6f6',
  },
} as const;
