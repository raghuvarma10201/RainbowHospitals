// App.tsx
import React, {useEffect, useMemo, useState} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider as PaperProvider} from 'react-native-paper';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {getMessaging, getToken} from '@react-native-firebase/messaging';

import './src/i18n';

// Config
import {AppTheme} from './src/config/Theme';
import {configureRTL} from './src/config/RTL';

// Navigation
import {navigationRef} from './src/navigation/root-navigation';
import {MainStack} from './src/navigation/app-navigation';
import {AuthStack} from './src/navigation/auth-navigation';

// Contexts
import {
  AppProvider,
  AuthContext,
  TimerProvider,
  JitsiProvider,
  SettingsProvider,
} from './src/context';

// Components
import {
  requestUserPermission,
  setupNotificationListeners,
} from './src/utils/service-handlers';
import {fetchSettings} from './src/services/common';
import {pallette} from './src/constants/constants';
import {CustomStatusBar} from './src/components';

// Initialize RTL
configureRTL();

const App: React.FC = () => {
  const [booting, setBooting] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const requestUserPermissions = async () => {
      await requestUserPermission();
      const messaging = getMessaging();
      const FcmTtoken = await getToken(messaging);
      console.log(FcmTtoken);

      // const FcmTtoken = await getMessaging().getToken();
      await AsyncStorage.setItem('FcmTtoken', FcmTtoken);
    };
    requestUserPermissions();
  }, []);

  //user notification permission
  useEffect(() => {
    // Request notification permissions and setup handlers
    setupNotificationListeners();
    createNotificationChannels();
  }, []);

  const getSettings = async () => {
    const settings = await fetchSettings();

    if (settings && settings.status == 200) {
    } else {
      console.error('❌ Failed to fetch settings.');
    }
  };
  // 🔊 Create custom sound channels
  const createNotificationChannels = async () => {
    await notifee.createChannel({
      id: 'general',
      name: 'General Notifications',
      sound: 'alert1', // Make sure alert1.mp3 is in /res/raw/
      importance: AndroidImportance.HIGH,
    });

    await notifee.createChannel({
      id: 'appointment',
      name: 'Appointment Alerts',
      sound: 'alert2',
      importance: AndroidImportance.HIGH,
    });

    await notifee.createChannel({
      id: 'critical',
      name: 'Critical Emergency',
      sound: 'alert3',
      importance: AndroidImportance.HIGH,
    });
  };

  const checkAuthStatus = async () => {
    try {
      const [token, expiry] = await Promise.all([
        AsyncStorage.getItem('accessToken'),
        AsyncStorage.getItem('tokenExpiry'),
      ]);

      const isValid =
        !!token &&
        !!expiry &&
        dayjs(expiry).isValid() &&
        dayjs().isBefore(dayjs(expiry));

      setLoggedIn(isValid);
    } catch (e) {
      console.error('Error checking auth status', e);
    } finally {
      setBooting(false);
    }
  };

  const authCtx = useMemo(() => ({isLoggedIn, setLoggedIn}), [isLoggedIn]);

  if (booting) {
    return (
      <View style={styles.splashSt}>
        <ActivityIndicator size="large" color={AppTheme.colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authCtx}>
      <PaperProvider theme={AppTheme}>
        <NavigationContainer ref={navigationRef}>
          <CustomStatusBar backgroundColor={pallette.app_purple} />
          <JitsiProvider>
            <SettingsProvider>
              <TimerProvider>
                <AppProvider>
                  {isLoggedIn ? <MainStack /> : <AuthStack />}
                </AppProvider>
              </TimerProvider>
            </SettingsProvider>
          </JitsiProvider>
        </NavigationContainer>
        <Toast />
      </PaperProvider>
    </AuthContext.Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  splashSt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: pallette.white,
  },
});
