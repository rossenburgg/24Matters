import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_NATIVE_BACKEND_URL } from '@env'; 

const api = axios.create({
  baseURL: REACT_NATIVE_BACKEND_URL, // Ensure this matches the REACT_NATIVE_BACKEND_URL in your .env file
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('Authorization header added to the request');
  } else {
    console.log('No user token found in AsyncStorage');
  }
  return config;
}, (error) => {
  console.error('Error in request interceptor:', error);
  console.error('Error details:', error.message, error.stack);
  return Promise.reject(error);
});

// Response interceptor for handling errors globally
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  let errorMessage = 'An error occurred. Please try again later.';
  if (error.response) {
    // Handle 4xx and 5xx status codes
    if (error.response.status >= 400 && error.response.status < 500) {
      errorMessage = 'A client error occurred. Please check your input.';
    } else if (error.response.status >= 500) {
      errorMessage = 'A server error occurred. Please try again later.';
    }
  }
  Alert.alert('Error', errorMessage);
  console.error('API error:', error);
  return Promise.reject(error);
});

// Function to check backend health
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/api/health');
    console.log('Backend health check response:', response.data);
  } catch (error) {
    console.error('Error checking backend health:', error);
    console.error('Error details:', error.message, error.stack);
  }
};

export default api;