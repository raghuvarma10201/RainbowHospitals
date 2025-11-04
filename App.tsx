// App.tsx
import React, {useEffect, useMemo, useState} from 'react';
import {View, ActivityIndicator, StyleSheet, StatusBar} from 'react-native';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Provider as PaperProvider} from 'react-native-paper';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {getMessaging, getToken} from '@react-native-firebase/messaging';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import './src/i18n';

// Config
import {AppTheme} from './src/config/theme';
import {configureRTL} from './src/config/rtl';

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
import {AuthStack, MainStack, navigationRef} from './src/navigation/navigation';

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
      try {
        const messaging = getMessaging();
        const FcmTtoken = await getToken(messaging);
        await AsyncStorage.setItem('FcmTtoken', FcmTtoken);
      } catch (error) {
        requestUserPermissions();
      }
    };
    requestUserPermissions();
  }, []);

  useEffect(() => {
    setupNotificationListeners();
    createNotificationChannels();
  }, []);

  const createNotificationChannels = async () => {
    await notifee.createChannel({
      id: 'general',
      name: 'General Notifications',
      sound: 'alert1',
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
      setLoggedIn(false);
    } finally {
      setBooting(false);
    }
  };

  const authCtx = useMemo(() => ({isLoggedIn, setLoggedIn}), [isLoggedIn]);

  if (booting) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.splashSt}>
          <ActivityIndicator
            testID="ActivityIndicator"
            size="large"
            color={AppTheme.colors.primary}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1, backgroundColor: pallette.dark_purple}}>
        <StatusBar
          translucent={false}
          backgroundColor={pallette.dark_purple}
          barStyle="light-content"
        />
        <AuthContext.Provider value={authCtx}>
          <PaperProvider theme={AppTheme}>
            <NavigationContainer ref={navigationRef}>
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
      </SafeAreaView>
    </SafeAreaProvider>
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
