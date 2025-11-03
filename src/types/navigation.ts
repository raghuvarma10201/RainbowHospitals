import {CompositeNavigationProp} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {Appointment} from '../utils/types';

export type AuthStackParamList = {
  Login: undefined;
  Otp: undefined;
  Registration: undefined;
  SetMpin: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  Category: undefined;
  Specialities: {appointmentType: string};
  AppointmentConfirmed: {mrn: string; appointment: any};
  DoctorSlots: {
    doctorId: number;
    appointmentType: string;
    OrganisationID: string;
    appointmentnumber?: string;
    patientId?: string;
    paid?: boolean;
  };
  DoctorsList: {
    specialityId: number;
    specialityName: string;
    appointmentType: string;
  };
  BookVaccination: undefined;
  VaccinesAdult: undefined;
  VaccinesPediatric: undefined;
  BookScan: undefined;
  MedicalRecord: undefined;
  // SlotConfirmation: {doctor: any; doctorSpecialitites: any};
  Home: undefined;
  MyAppointments: undefined;
  MyAppointmentDetails: {
    appointmentData: any;
    cancel?: boolean;
    vitalsUpload?: boolean;
  };
  AppointmentChat: {bookingId: any; doctor: any; appointmentData?: Appointment};
  JitsiCall: {roomName: string};
  PayUWebView: {
    finalPayload: any;
    // txnId: string;
    bookingId: string;
    // amount: string;
    payuUrl: string;
  };
  Family: undefined;
  AddFamily: {data: any};
  Records: undefined;
  Notifications: undefined;
  DocPreview: undefined;
  PDFPreview: undefined;
};

export type CombinedNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList>,
  NativeStackNavigationProp<MainStackParamList>
>;

export const screenOptions: NativeStackNavigationOptions = {headerShown: false};
