import {
  Home,
  Dashboard,
  Category,
  Specialities,
  DoctorsList,
  DoctorSlotSelection,
  BookVaccination,
  VaccinesAdult,
  BookScan,
  MedicalRecord,
  // SlotConfirmation,
  MyAppointments,
  PayUWebView,
  MyAppointmentDetails,
  VaccinesPediatric,
  AppointmentConfirmed,
  AppointmentChat,
  Login,
  Otp,
  SetMpin,
  Registration,
  AddFamilyMember,
  PatientFamily,
  PatientRecords,
} from '../pages';
import Notifications from '../pages/notifications/notifications';
import {DocumentPreview} from '../pages/patient-records/document-preview';
import {AuthStackParamList, MainStackParamList} from '../types/navigation';

type CombinedRouteNames = keyof (AuthStackParamList & MainStackParamList);

export const routes: Record<CombinedRouteNames, CombinedRouteNames> = {
  Category: 'Category',
  Login: 'Login',
  Otp: 'Otp',
  SetMpin: 'SetMpin',
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
  // SlotConfirmation: 'SlotConfirmation',
  Home: 'Home',
  MyAppointments: 'MyAppointments',
  MyAppointmentDetails: 'MyAppointmentDetails',
  AppointmentChat: 'AppointmentChat',
  JitsiCall: 'JitsiCall',
  PayUWebView: 'PayUWebView',
  Family: 'Family',
  AddFamily: 'AddFamily',
  Records: 'Records',
  Notifications: 'Notifications',
  DocPreview: 'DocPreview',
};

export const auth_screens = [
  // {name: routes.Category, component: Category},
  // {name: routes.Dashboard, component: Dashboard},
  {name: routes.Login, component: Login},
  {name: routes.Otp, component: Otp},
  {name: routes.Registration, component: Registration},
];

export const app_screens = [
  {name: routes.SetMpin, component: SetMpin},
  {name: routes.Category, component: Category},
  {name: routes.Dashboard, component: Dashboard},
  {name: routes.Specialities, component: Specialities},
  {name: routes.DoctorsList, component: DoctorsList},
  {name: routes.DoctorSlots, component: DoctorSlotSelection},
  {name: routes.BookVaccination, component: BookVaccination},
  {name: routes.VaccinesAdult, component: VaccinesAdult},
  {name: routes.BookScan, component: BookScan},
  {name: routes.MedicalRecord, component: MedicalRecord},
  // {name: routes.SlotConfirmation, component: SlotConfirmation},
  {name: routes.Home, component: Home},
  {name: routes.MyAppointments, component: MyAppointments},
  {name: routes.PayUWebView, component: PayUWebView},
  {name: routes.MyAppointmentDetails, component: MyAppointmentDetails},
  {name: routes.AppointmentChat, component: AppointmentChat},
  {name: routes.VaccinesPediatric, component: VaccinesPediatric},
  {name: routes.AppointmentConfirmed, component: AppointmentConfirmed},
  {name: routes.Family, component: PatientFamily},
  {name: routes.AddFamily, component: AddFamilyMember},
  {name: routes.Records, component: PatientRecords},
  {name: routes.Notifications, component: Notifications},
  {name: routes.DocPreview, component: DocumentPreview},
];

export const API_BASE_URL = 'https://rainbow.exwyn.com/api';
export const API_IMG_URL = 'https://rainbow.exwyn.com/';
export const ENABLE_API_LOGGING = false;
export const IMG_BASE_URL = 'https://cdn3.rainbowhospitals.in/';
export const PAYU_MERCHENT_KEY = 'PP3oGe';
export const PAYU_MERCHENT_SALT = 'Aw4cfD4IT6vWLlSon9XKdwSWAXKh9Dhy';
export const googleApiKey = 'AIzaSyClA5mcjLwpFO0O7aSGR5NRICmjH7hBWT4';
