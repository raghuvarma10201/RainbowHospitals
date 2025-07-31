import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainStackParamList, screenOptions } from "./types";
import React from "react";
import Home from '../pages/Home';
import BookScan from '../pages/BookScan';
import Dashboard from "../pages/Dashboard";
import DoctorSlots from '../pages/DoctorSlots';
import DoctorsList from '../pages/DoctorsList';
import PayUWebView from '../pages/PayUWebView';
import Specialities from '../pages/Specialities';
import VaccinesAdult from '../pages/VaccinesAdult';
import MedicalRecord from '../pages/MedicalRecord';
import MyAppointments from '../pages/MyAppointments';
import BookVaccination from '../pages/BookVaccination';
import SlotConfirmation from '../pages/SlotConfirmation';
import VaccinesPediatric from '../pages/VaccinesPediatric';
import AppointmentConfirmed from '../pages/AppointmentConfirmed';
import MyAppointmentDetails from '../pages/MyAppointmentDetails';

const MainStackNav = createNativeStackNavigator<MainStackParamList>();

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
    {/* <MainStackNav.Screen name="JitsiCall" component={JitsiCall} /> */}
    <MainStackNav.Screen name="VaccinesPediatric" component={VaccinesPediatric} />
    <MainStackNav.Screen name="AppointmentConfirmed" component={AppointmentConfirmed} />
  </MainStackNav.Navigator>
));