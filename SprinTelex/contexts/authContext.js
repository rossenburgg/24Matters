import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('No user token found, redirecting to login...');
          // Instead of navigating, we'll rely on the consumer components to redirect based on the auth state
        } else {
          console.log('User token found:', token);
          setUserToken(token);
        }
      } catch (error) {
        console.error('Error checking user token:', error.message, error.stack);
      }
    };

    checkToken();
  }, []);

  const signIn = async (token) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
      console.log('User logged in:', token);
    } catch (error) {
      console.error('Error logging in:', error.message, error.stack);
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      console.log('User logged out');
      // Here also, we avoid direct navigation and let consumer components handle the redirection
    } catch (error) {
      console.error('Error logging out:', error.message, error.stack);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, setUserToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};