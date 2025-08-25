// src/navigation/RootNavigation.ts
import {createNavigationContainerRef} from '@react-navigation/native';

import {routes} from '../utils/enums';

export const navigationRef = createNavigationContainerRef();

export const resetToLogin = () => {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{name: routes.Login}], // Consider extracting 'Login' to a route constants file
    });
  }
};
