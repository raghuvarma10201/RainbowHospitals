// AuthNavigation.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {AuthStackParamList, screenOptions} from './types';
import {auth_screens} from '../utils/enums';

const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();

export const AuthStack = React.memo(() => (
  <AuthStackNav.Navigator screenOptions={screenOptions}>
    {auth_screens.map(({name, component}) => (
      <AuthStackNav.Screen
        key={name}
        name={name as keyof AuthStackParamList}
        component={component}
      />
    ))}
  </AuthStackNav.Navigator>
));
