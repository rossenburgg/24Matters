import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync().catch(error => {
      console.error('Error getting notification permissions:', error);
      Alert.alert('Error', 'Failed to get notification permissions. Please try again.');
    });
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync().catch(error => {
        console.error('Error requesting notification permissions:', error);
        Alert.alert('Error', 'Failed to request notification permissions. Please try again.');
      });
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync().catch(error => {
      console.error('Error getting Expo push token:', error);
      Alert.alert('Error', 'Failed to get Expo push token. Please try again.');
    })).data;
    console.log('Push notification token:', token);
  } else {
    console.log('Attempted to register for push notifications on a non-physical device.');
    Alert.alert('Error', 'Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    }).catch(error => {
      console.error('Error setting notification channel:', error);
      Alert.alert('Error', 'Failed to set notification channel. Please try again.');
    });
  }

  return token;
}

export default registerForPushNotificationsAsync;