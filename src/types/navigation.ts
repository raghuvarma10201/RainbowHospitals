import {CompositeNavigationProp} from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Otp: undefined;
  Registration: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  Category: undefined;
  Specialities: {appointmentType: string};
  AppointmentConfirmed: undefined;
  DoctorSlots: {
    doctorId: number;
    appointmentType: string;
    OrganisationID: string;
    appointmentnumber?: string;
  };
  DoctorsList: {specialityId: number; appointmentType: string};
  BookVaccination: undefined;
  VaccinesAdult: undefined;
  VaccinesPediatric: undefined;
  BookScan: undefined;
  MedicalRecord: undefined;
  // SlotConfirmation: {doctor: any; doctorSpecialitites: any};
  Home: undefined;
  MyAppointments: undefined;
  MyAppointmentDetails: {appointmentData: any; cancel?: boolean};
  AppointmentChat: {bookingId: any; doctor: any};
  JitsiCall: {roomName: string};
  PayUWebView: {
    finalPayload: any;
    // txnId: string;
    bookingId: string;
    // amount: string;
    payuUrl: string;
  };
};

export type CombinedNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<AuthStackParamList>,
  NativeStackNavigationProp<MainStackParamList>
>;

export const screenOptions: NativeStackNavigationOptions = {headerShown: false};
