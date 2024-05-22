import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const useAuthToken = () => {
  const [token, setToken] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
          setIsUserLoggedIn(true);
        } else {
          console.log('No authentication token found.');
          setIsUserLoggedIn(false);
        }
      } catch (error) {
        console.error('Error fetching authentication token:', error);
        setIsUserLoggedIn(false);
      }
    };

    fetchToken();
  }, []);

  return { token, isUserLoggedIn };
};

export default useAuthToken;