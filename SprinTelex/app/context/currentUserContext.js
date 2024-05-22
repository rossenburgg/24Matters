import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setCurrentUserId = async (userId) => {
    try {
      const user = await axios.get(`http://192.168.8.130:3001/api/users/${userId}`);
      setCurrentUser(user.data);
      await AsyncStorage.setItem('currentUser', JSON.stringify(user.data));
      console.log('Current user set successfully:', user.data);
    } catch (error) {
      console.error('Error setting current user:', error.response ? error.response.data : error);
    }
  };

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
          console.log('Current user loaded from storage');
        }
      } catch (error) {
        console.error('Error loading current user from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, setCurrentUserId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };