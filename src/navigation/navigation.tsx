// AppNavigation.tsx
import React from 'react';
import {createNavigationContainerRef} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  MainStackParamList,
  screenOptions,
  AuthStackParamList,
  CombinedNavigationProp,
} from '../types/navigation';
import {app_screens, auth_screens} from '../utils/enums';

import {routes} from '../utils/enums';

// Navigation ref
export const navigationRef = createNavigationContainerRef();

export const resetToLogin = () => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{name: routes.Login as keyof CombinedNavigationProp}],
    });
  }
};

// AppNavigation
const MainStackNav = createNativeStackNavigator<MainStackParamList>();

export const MainStack = React.memo(() => (
  <MainStackNav.Navigator screenOptions={screenOptions}>
    {app_screens.map(({name, component}) => (
      <MainStackNav.Screen
        key={name as keyof MainStackParamList}
        name={name as keyof MainStackParamList}
        component={component}
      />
    ))}
  </MainStackNav.Navigator>
));

// AuthNavigation
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = React.memo(() => (
  <AuthStackNav.Navigator screenOptions={screenOptions}>
    {auth_screens.map(({name, component}) => (
      <AuthStackNav.Screen
        key={name as keyof AuthStackParamList}
        name={name as keyof AuthStackParamList}
        component={component}
      />
    ))}
  </AuthStackNav.Navigator>
));
