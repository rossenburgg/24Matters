import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './navigation/MainTabNavigator';
import AuthStackNavigator from './navigation/AuthStackNavigator';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import registerForPushNotificationsAsync from './components/Notifications';
import { sendPushTokenToServer } from './services/pushTokenService';
import { AuthProvider, useAuth } from './contexts/authContext';

function AuthenticatedApp() {
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();
  const { userToken, setUserToken } = auth;

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        sendPushTokenToServer(token).then(() => {
          console.log('Push token sent to server successfully');
        }).catch(error => {
          console.error('Error sending push token to server:', error);
        });
      }
    }).catch(error => {
      console.error('Error registering for push notifications:', error);
    });

    // Check for authentication token at app startup
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.error('Restoring token failed', e);
      }
      if (token) {
        setUserToken(token);
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    // Show a loading spinner while checking the user's token
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userToken ? <MainTabNavigator /> : <AuthStackNavigator />}
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthenticatedApp />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});