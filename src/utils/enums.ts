import {
  Home,
  Dashboard,
  Specialities,
  DoctorsList,
  DoctorSlotSelection,
  BookVaccination,
  VaccinesAdult,
  BookScan,
  MedicalRecord,
  SlotConfirmation,
  MyAppointments,
  PayUWebView,
  MyAppointmentDetails,
  VaccinesPediatric,
  AppointmentConfirmed,
  AppointmentChat,
  Login,
  Otp,
  Registration,
} from '../pages';
import {AuthStackParamList, MainStackParamList} from '../navigation/types';

type CombinedRouteNames = keyof AuthStackParamList | keyof MainStackParamList;

export const routes: Record<CombinedRouteNames, CombinedRouteNames> = {
  Login: 'Login',
  Otp: 'Otp',
  Registration: 'Registration',
  Splash: 'Splash',
  Dashboard: 'Dashboard',
  Specialities: 'Specialities',
  AppointmentConfirmed: 'AppointmentConfirmed',
  DoctorSlots: 'DoctorSlots',
  DoctorsList: 'DoctorsList',
  BookVaccination: 'BookVaccination',
  VaccinesAdult: 'VaccinesAdult',
  VaccinesPediatric: 'VaccinesPediatric',
  BookScan: 'BookScan',
  MedicalRecord: 'MedicalRecord',
  SlotConfirmation: 'SlotConfirmation',
  Home: 'Home',
  MyAppointments: 'MyAppointments',
  MyAppointmentDetails: 'MyAppointmentDetails',
  AppointmentChat: 'AppointmentChat',
  JitsiCall: 'JitsiCall',
  PayUWebView: 'PayUWebView',
};

export const auth_screens = [
  {name: routes.Login, component: Login},
  {name: routes.Otp, component: Otp},
  {name: routes.Registration, component: Registration},
];

export const app_screens = [
  {name: routes.Dashboard, component: Dashboard},
  {name: routes.Specialities, component: Specialities},
  {name: routes.DoctorsList, component: DoctorsList},
  {name: routes.DoctorSlots, component: DoctorSlotSelection},
  {name: routes.BookVaccination, component: BookVaccination},
  {name: routes.VaccinesAdult, component: VaccinesAdult},
  {name: routes.BookScan, component: BookScan},
  {name: routes.MedicalRecord, component: MedicalRecord},
  {name: routes.SlotConfirmation, component: SlotConfirmation},
  {name: routes.Home, component: Home},
  {name: routes.MyAppointments, component: MyAppointments},
  {name: routes.PayUWebView, component: PayUWebView},
  {name: routes.MyAppointmentDetails, component: MyAppointmentDetails},
  {name: routes.AppointmentChat, component: AppointmentChat},
  {name: routes.VaccinesPediatric, component: VaccinesPediatric},
  {name: routes.AppointmentConfirmed, component: AppointmentConfirmed},
];
