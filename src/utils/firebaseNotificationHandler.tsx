import {Alert, Platform} from 'react-native';
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
  onNotificationOpenedApp(messaging, remoteMessage => {
    console.log('Notification opened:', remoteMessage);
  });

  // App opened from quit state
  getInitialNotification(messaging).then(remoteMessage => {
    if (remoteMessage) {
      console.log('Initial notification:', remoteMessage);
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
  setBackgroundMessageHandler(messaging, async remoteMessage => {
    console.log('Background message:', remoteMessage);
  });
};
