import messaging from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';
import notifee from '@notifee/react-native';
export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    const token = await messaging().getToken();
  }
};

export const setupNotificationListeners = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {});
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
      }
    });
  messaging().onMessage(async remoteMessage => {
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
      android: {
        channelId,
      },
    });
  });
  messaging().setBackgroundMessageHandler(async remoteMessage => {});
};
