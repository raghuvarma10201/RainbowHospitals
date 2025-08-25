// AppNavigation.tsx
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import {MainStackParamList, screenOptions} from './types';
import {app_screens} from '../utils/enums';

const MainStackNav = createNativeStackNavigator<MainStackParamList>();

export const MainStack = React.memo(() => (
  <MainStackNav.Navigator screenOptions={screenOptions}>
    {app_screens.map(({name, component}) => (
      <MainStackNav.Screen
        key={name}
        name={name as keyof MainStackParamList}
        component={component}
      />
    ))}
  </MainStackNav.Navigator>
));
