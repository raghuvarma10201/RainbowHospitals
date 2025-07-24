// App.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

import { navigationRef } from './src/navigation/RootNavigation';

// ------- Screens -------
import Login from './src/authentication/Login';
import { AppProvider } from './src/context/AppContext';
import Toast from 'react-native-toast-message';
import './src/i18n';
import { I18nManager } from 'react-native';
import Splash from './src/pages/Splash';
import Otp from './src/authentication/Otp';
import Dashboard from './src/pages/Dashboard';
import Specialities from './src/pages/Specialities';
import AppointmentConfirmed from './src/pages/AppointmentConfirmed';
import BookVaccination from './src/pages/BookVaccination';
import VaccinesAdult from './src/pages/VaccinesAdult';
import BookScan from './src/pages/BookScan';
import VaccinesPediatric from './src/pages/VaccinesPediatric';
import Home from './src/pages/Home';
import DoctorsList from './src/pages/DoctorsList';
import MedicalRecord from './src/pages/MedicalRecord';





if (I18nManager.isRTL) {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
}
/* ──────────────── Auth Context ──────────────── */
type AuthCtx = {
  isLoggedIn: boolean;
  setLoggedIn: (val: boolean) => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside its provider');
  return ctx;
};

/* ──────────────── Navigation Stacks ──────────────── */
// ------- Param Lists -------
type AuthStackParamList = {
  Login: undefined;
  Otp: undefined;

};

type MainStackParamList = {
  Splash: undefined;
  Dashboard: undefined;
  Specialities: undefined;
  AppointmentConfirmed: undefined;
  BookVaccination: undefined;
  VaccinesAdult: undefined;
  BookScan: undefined;
  VaccinesPediatric: undefined;
  Home: undefined;
  DoctorsList: undefined;
  MedicalRecord: undefined;
};

export type { AuthStackParamList, MainStackParamList };

// ------- Navigator instances -------
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const MainStackNav = createNativeStackNavigator<MainStackParamList>();
const screenOptions: NativeStackNavigationOptions = { headerShown: false };

export const AuthStack = React.memo(() => (
  <AuthStackNav.Navigator screenOptions={screenOptions}>
    <AuthStackNav.Screen name="Login" component={Login} />
    <AuthStackNav.Screen name="Otp" component={Otp} />
  </AuthStackNav.Navigator>
));

export const MainStack = React.memo(() => (
  <MainStackNav.Navigator screenOptions={screenOptions}>
    <MainStackNav.Screen name="Dashboard" component={Dashboard} />
    <MainStackNav.Screen name="Specialities" component={Specialities} />
    <MainStackNav.Screen name="AppointmentConfirmed" component={AppointmentConfirmed} />
    <MainStackNav.Screen name="BookVaccination" component={BookVaccination} />
    <MainStackNav.Screen name="VaccinesAdult" component={VaccinesAdult} />
    <MainStackNav.Screen name="VaccinesPediatric" component={VaccinesPediatric} />
    <MainStackNav.Screen name="BookScan" component={BookScan} />
    <MainStackNav.Screen name="Home" component={Home} /> 
    <MainStackNav.Screen name="DoctorsList" component={DoctorsList} />
    <MainStackNav.Screen name="MedicalRecord" component={MedicalRecord} />
  </MainStackNav.Navigator>
));

/* ──────────────── Theme ──────────────── */
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF5400',
    background: '#f6f6f6',
  },
} as const;

/* ──────────────── App Root ──────────────── */
const App: React.FC = () => {
  const [booting, setBooting] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Re‑hydrate token once at launch
  useEffect(() => {
    (async () => {
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
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  // Stable value to avoid re‑renders of consumers
  const authCtx = useMemo(() => ({ isLoggedIn, setLoggedIn }), [isLoggedIn]);

  // Splash while booting
  if (booting) {
    return (
      <View style={styles.splashSt}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authCtx}>
      <PaperProvider theme={theme}>
        <NavigationContainer ref={navigationRef}>
          {isLoggedIn ? <AppProvider>
            <MainStack />
          </AppProvider> : <AppProvider>
            <AuthStack />
          </AppProvider>}
        </NavigationContainer>
      </PaperProvider>
      <Toast />
    </AuthContext.Provider>

  );
};

export default App;

/* ──────────────── Styles ──────────────── */
const styles = StyleSheet.create({
  splashSt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
