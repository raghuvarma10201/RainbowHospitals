import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList, screenOptions } from "./types";
import React from "react";
import Otp from '../authentication/Otp';
import Login from "../authentication/Login";
import Registration from '../authentication/Registration';

const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = React.memo(() => (
  <AuthStackNav.Navigator screenOptions={screenOptions}>
    <AuthStackNav.Screen name="Login" component={Login} />
    <AuthStackNav.Screen name="Otp" component={Otp} />
    <AuthStackNav.Screen name="Registration" component={Registration} />
  </AuthStackNav.Navigator>
));