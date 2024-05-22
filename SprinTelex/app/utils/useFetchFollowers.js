import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const useFetchFollowers = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.error("Authentication token not found");
      Alert.alert("Error", "Authentication token not found. Please login again.");
      return [];
    }

    const currentUser = await AsyncStorage.getItem('currentUser');
    const userId = currentUser ? JSON.parse(currentUser)._id : null;
    if (!userId) {
      console.error("User ID not found");
      Alert.alert("Error", "User ID not found. Please login again.");
      return [];
    }

    const response = await axios.get(`http://192.168.8.130:3001/api/users/${userId}/followers`, { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      console.log('Followers fetched successfully');
      return response.data.followers;
    } else {
      console.error('Failed to fetch followers with status code:', response.status);
      Alert.alert("Error", "Failed to fetch followers. Please try again later.");
      return [];
    }
  } catch (error) {
    console.error('Error fetching followers:', error.response ? error.response.data : error);
    Alert.alert("Error", "Failed to fetch followers. Please try again later.");
    return [];
  }
};

export default useFetchFollowers;