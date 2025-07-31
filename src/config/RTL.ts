// src/config/rtl.ts
import { I18nManager } from 'react-native';

export const configureRTL = () => {
  if (I18nManager.isRTL) {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }
};
