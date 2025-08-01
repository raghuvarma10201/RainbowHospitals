// src/config/rtl.ts
import {I18nManager} from 'react-native';

/**
 * Disable RTL layout globally.
 * Prevents unexpected layout shifts when user device language is RTL.
 */
export const configureRTL = () => {
  if (I18nManager.isRTL) {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }
};
