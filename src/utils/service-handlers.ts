import {Platform, Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';

import Toast from 'react-native-toast-message';

import notifee from '@notifee/react-native';
import {
  getMessaging,
  requestPermission,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  setBackgroundMessageHandler,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';

export const requestLocationPermission = async () => {
  const permission = Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  });

  if (!permission) {
    throw new Error('Location permission is not available for this platform.');
  }

  const result = await request(permission);
  return result;
};

export const getCurrentCoordinates = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return null;

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        resolve({latitude, longitude});
      },
      error => {
        console.error('Location Error:', error.message);
        reject(null);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};

export const getCityNameFromCoords = async (
  latitude: number,
  longitude: number,
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
    );
    const data = await response.json();
    const address = data.address;

    // Combine relevant address components
    const suburb =
      address.suburb || address.neighbourhood || address.village || '';
    const city = address.city || address.town || address.state_district || '';
    const state = address.state || '';

    // You can adjust this format as per your display needs
    const fullLocation = suburb || city || state.filter(Boolean).join(', ');

    return fullLocation || 'Unknown';
  } catch (error: any) {
    ToastService.error(
      'Error',
      error?.response?.data?.message ||
        error?.message ||
        'Something went wrong',
    );
    return null;
  }
};

type ToastType = 'success' | 'error' | 'info';

const showToast = (
  type: ToastType,
  title: string,
  message?: string,
  position: 'top' | 'bottom' = 'top',
) => {
  Toast.show({
    type,
    position,
    text1: title,
    text2: message,
    visibilityTime: 3000,
    autoHide: true,
    topOffset: 50,
    bottomOffset: 50,
  });
};

export const ToastService = {
  success: (title: string, message?: string) =>
    showToast('success', title, message),
  error: (title: string, message?: string) =>
    showToast('error', title, message),
  info: (title: string, message?: string) => showToast('info', title, message),
};

// ✅ Request notification permissions & get FCM token
export const requestUserPermission = async () => {
  const messaging = getMessaging();

  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await getToken(messaging);
  }
};

// ✅ Setup foreground, background & initial notification listeners
export const setupNotificationListeners = () => {
  const messaging = getMessaging();

  // App opened from background by tapping a notification
  onNotificationOpenedApp(messaging, remoteMessage => {});

  // App opened from quit state
  getInitialNotification(messaging).then(remoteMessage => {
    if (remoteMessage) {
    }
  });

  // Foreground messages
  onMessage(messaging, async remoteMessage => {
    Alert.alert(
      remoteMessage.notification?.title || '',
      remoteMessage.notification?.body || '',
    );

    const type = 'appointment';
    let channelId = 'general';
    if (type === 'appointment') channelId = 'appointment';
    else if (type === 'critical') channelId = 'critical';

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {channelId},
    });
  });

  // Background messages
  setBackgroundMessageHandler(messaging, async remoteMessage => {});
};
