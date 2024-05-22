import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useWebSocket } from '../context/WebSocketContext';
import axios from 'axios';
import { API_URL } from '@env'; // Ensure you have your API URL in an .env file or replace it directly

const UserProfileScreen = ({ userId }) => {
  const webSocket = useWebSocket();
  const [userProfile, setUserProfile] = useState(null);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'Failed to fetch user profile.');
    }
  };

  useEffect(() => {
    fetchUserProfile(userId);

    const handleProfileUpdate = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === 'USER_UPDATE' && data.userId === userId) {
        Alert.alert('User Update', 'This user profile has been updated.');
        fetchUserProfile(userId); // Fetch the updated user data
      }
    };

    if (webSocket) {
      webSocket.addEventListener('message', handleProfileUpdate);
    }

    return () => {
      if (webSocket) {
        webSocket.removeEventListener('message', handleProfileUpdate);
      }
    };
  }, [userId, webSocket]);

  if (!userProfile) {
    return <Text>Loading profile...</Text>;
  }

  return (
    <View>
      <Text>{userProfile.name}</Text>
      {/* Render other profile details here */}
    </View>
  );
};

export default UserProfileScreen;