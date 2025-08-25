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

export const API_BASE_URL = 'https://rainbow.exwyn.com/api';
export const API_IMG_URL = 'https://rainbow.exwyn.com/';
export const ENABLE_API_LOGGING = false;
export const IMG_BASE_URL = 'https://cdn3.rainbowhospitals.in/';
export const PAYU_MERCHENT_KEY = 'PP3oGe';
export const PAYU_MERCHENT_SALT = 'Aw4cfD4IT6vWLlSon9XKdwSWAXKh9Dhy';
export const googleApiKey = 'AIzaSyClA5mcjLwpFO0O7aSGR5NRICmjH7hBWT4';
