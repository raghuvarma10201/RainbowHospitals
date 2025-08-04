import messaging from '@react-native-firebase/messaging';
import { Alert, Platform } from 'react-native';
import notifee from '@notifee/react-native';
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    //console.log('✅ Notification permission granted.');
    const token = await messaging().getToken();

    console.log('📲 FCM Token:', token);
    // Send token to backend if needed
  }
};

export const setupNotificationListeners = () => {
  // Triggered when the app is in background and user taps notification
  messaging().onNotificationOpenedApp(remoteMessage => {
    //console.log('📬 Opened from background state:', remoteMessage);
    // Alert.alert(remoteMessage.notification?.title || '', remoteMessage.notification?.body || '');
  });

  // Triggered when app is killed and opened by notification
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        //console.log('🚀 Opened from quit state:', remoteMessage);
        // Alert.alert(remoteMessage.notification?.title || '', remoteMessage.notification?.body || '');
      }
    });

  // Triggered when app is in foreground
  messaging().onMessage(async remoteMessage => {
    //console.log('📥 Foreground notification:', remoteMessage);
    Alert.alert(remoteMessage.notification?.title || '', remoteMessage.notification?.body || '');
    const type = "appointment";

    // Choose channel based on custom type
    let channelId = 'general';
    if (type === 'appointment') channelId = 'appointment';
    else if (type === 'critical') channelId = 'critical';

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId,
      },
    });
  });
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    //console.log('📥 Foreground notification:', remoteMessage);
    // Alert.alert(remoteMessage.notification?.title || '', remoteMessage.notification?.body || '');
  });


};
