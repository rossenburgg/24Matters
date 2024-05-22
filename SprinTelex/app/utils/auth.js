import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const BASE_URL = 'http://192.168.8.130:3001/api/auth';

export const signUp = async (email, password, username) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, {
      email,
      username,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      console.log('User signed up and token stored.');
    } else {
      console.error('Signup failed, no token received.');
      Alert.alert('Error', 'Signup failed, no token received.');
    }
  } catch (error) {
    console.error('Error during sign up:', error.response?.data?.message || error.message);
    console.error('Error stack:', error.stack);
    Alert.alert('Error', 'Error during sign up: ' + (error.response?.data?.message || error.message));
  }
};

export const signIn = async (email, password) => {
  try {
    console.log('Attempting to sign in with email:', email); // Log email before sending request
    const response = await axios.post(`${BASE_URL}/signin`, {
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Sign-in response:', response); // Log response from the server
    if (response.data.token) {
      await AsyncStorage.setItem('userToken', response.data.token);
      console.log('User signed in and token stored.');
    } else {
      console.error('Signin failed, no token received.');
      Alert.alert('Error', 'Signin failed, no token received.');
    }
  } catch (error) {
    console.error('Error signing in:', error.response?.data?.message || error.message);
    console.error('Sign-in error response:', error.response); // Log error response from the server
    console.error('Error stack:', error.stack);
    Alert.alert('Error', 'Error signing in: ' + (error.response?.data?.message || error.message));
  }
};