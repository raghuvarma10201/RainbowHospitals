import { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Login: undefined;
  Splash: undefined;
  Topup: { amount?: number } | undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Otp: undefined;
  Registration: undefined;

};

export type MainStackParamList = {
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
  MyAppointmentDetails: {appointmentData : any};
  JitsiCall: { roomName: string };
  PayUWebView: {
    finalPayload: any;
    txnId: string;
    amount: string;
    payuUrl: string;
  };
};

export const screenOptions: NativeStackNavigationOptions = { headerShown: false };
