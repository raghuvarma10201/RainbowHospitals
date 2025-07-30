// App.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {View, ActivityIndicator, StyleSheet, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

import {navigationRef} from './src/navigation/RootNavigation';

// ------- Screens -------
import Login from './src/authentication/Login';
import {AppProvider} from './src/context/AppContext';
import Toast from 'react-native-toast-message';
import './src/i18n';
import {I18nManager} from 'react-native';
import Splash from './src/pages/Splash';
import Otp from './src/authentication/Otp';
import Dashboard from './src/pages/Dashboard';
import Specialities from './src/pages/Specialities';
import AppointmentConfirmed from './src/pages/AppointmentConfirmed';
import DoctorSlots from './src/pages/DoctorSlots';
import BookVaccination from './src/pages/BookVaccination';
import VaccinesAdult from './src/pages/VaccinesAdult';
import VaccinesPediatric from './src/pages/VaccinesPediatric';
import BookScan from './src/pages/BookScan';
import MedicalRecord from './src/pages/MedicalRecord';
import SlotConfirmation from './src/pages/SlotConfirmation';
import Home from './src/pages/Home';
import DoctorsList from './src/pages/DoctorsList';
import MyAppointments from './src/pages/MyAppointments';
import PayUWebView from './src/pages/PayUWebView';
import MyAppointmentDetails from './src/pages/MyAppointmentDetails';
import { TimerProvider } from './src/context/TimeContext';
import Registration from './src/authentication/Registration';
import MyStatusBar from './src/components/StatusBar';
import JitsiCall from './src/pages/JitsiCall';
import { JitsiProvider } from './src/context/JitsiContext';

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
  Registration: undefined;
 
};

type MainStackParamList = {
  Splash: undefined;
  Dashboard: undefined;
  Specialities: undefined;
  AppointmentConfirmed: undefined;
  DoctorSlots: { doctorId: number, appointmentType: string };
  DoctorsList: { specialityId: number, appointmentType: string };
  BookVaccination: undefined;
  VaccinesAdult: undefined;
  VaccinesPediatric: undefined;
  BookScan: undefined;
  MedicalRecord: undefined;
  SlotConfirmation: { doctor: any };
  Home: undefined;
  MyAppointments: undefined;
  MyAppointmentDetails: undefined;
  JitsiCall: {roomName : string};
  PayUWebView: {
    finalPayload: any;
    txnId: string;
    amount: string;
    payuUrl: string;
  };
};

export type {AuthStackParamList, MainStackParamList};

// ------- Navigator instances -------
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const MainStackNav = createNativeStackNavigator<MainStackParamList>();
const screenOptions: NativeStackNavigationOptions = {headerShown: false};

export const AuthStack = React.memo(() => (
  <AuthStackNav.Navigator screenOptions={screenOptions}> 
    <AuthStackNav.Screen name="Login" component={Login} />
    <AuthStackNav.Screen name="Otp" component={Otp} />
    <AuthStackNav.Screen name="Registration" component={Registration} />
  </AuthStackNav.Navigator>
));

export const MainStack = React.memo(() => (
  <MainStackNav.Navigator screenOptions={screenOptions}>
    <MainStackNav.Screen name="Dashboard" component={Dashboard} />
    <MainStackNav.Screen name="Specialities" component={Specialities} />
    <MainStackNav.Screen name="DoctorsList" component={DoctorsList} />
    <MainStackNav.Screen name="DoctorSlots" component={DoctorSlots} />
    <MainStackNav.Screen name="BookVaccination" component={BookVaccination} />
    <MainStackNav.Screen name="VaccinesAdult" component={VaccinesAdult} />
    <MainStackNav.Screen name="BookScan" component={BookScan} />
    <MainStackNav.Screen name="MedicalRecord" component={MedicalRecord} />
    <MainStackNav.Screen name="SlotConfirmation" component={SlotConfirmation} />
    <MainStackNav.Screen name="Home" component={Home} />
    <MainStackNav.Screen name="MyAppointments" component={MyAppointments} />
    <MainStackNav.Screen name="PayUWebView" component={PayUWebView} />
    <MainStackNav.Screen name="MyAppointmentDetails" component={MyAppointmentDetails} />
    <MainStackNav.Screen name="JitsiCall" component={JitsiCall} />
    <MainStackNav.Screen
      name="VaccinesPediatric"
      component={VaccinesPediatric}
    />
    <MainStackNav.Screen
      name="AppointmentConfirmed"
      component={AppointmentConfirmed}
    />
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
  const authCtx = useMemo(() => ({isLoggedIn, setLoggedIn}), [isLoggedIn]);

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

      <JitsiProvider>
          <TimerProvider>
          <MyStatusBar backgroundColor={'#3C2871'} />
          {isLoggedIn ? (
            <AppProvider>
              <MainStack />
            </AppProvider>
          ) : (
            <AppProvider>
              <AuthStack />
            </AppProvider>
          )}
          </TimerProvider>
          </JitsiProvider>
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
