// AppNavigation.tsx
import React from 'react';
import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';
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

export const navigate = (name: string, params?: any) => {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  } else {
    console.warn('Navigation not ready yet');
  }
};

export const navigateDispatch = (name: string, params?: never) => {
  console.log(name, params);

  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {name: routes.Dashboard},
          {
            name: name,
            params: params,
          },
        ],
      }),
    );
  } else {
    console.warn('Navigation not ready yet');
  }
};

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
