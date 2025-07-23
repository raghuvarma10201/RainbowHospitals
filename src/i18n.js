import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'react-native-localize';

import en from './locales/en.json';
import ar from './locales/ar.json';

const LANG_KEY = 'appLanguage';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

// Load saved language from AsyncStorage
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    try {
      const savedData = await AsyncStorage.getItem(LANG_KEY);
      if (savedData) {
        callback(savedData);
      } else {
        const fallbackLang = getLocales()[0]?.languageCode || 'en';
        callback(fallbackLang);
      }
    } catch (error) {
      console.error('Language detection error:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng) => {
    try {
      await AsyncStorage.setItem(LANG_KEY, lng);
    } catch (e) {
      console.error('Failed to save language', e);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
