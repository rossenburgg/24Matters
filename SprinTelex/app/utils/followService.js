import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "http://192.168.8.130:3001/api";

const followUser = async (userId, followerId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.log('Authentication token not found.');
      return;
    }
    const response = await axios.post(`${BASE_URL}/follow`, { followerId, followingId: userId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Followed user successfully.', response.data);
  } catch (error) {
    console.error('Error following user:', error.response ? error.response.data : error);
  }
};

const unfollowUser = async (userId, followerId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.log('Authentication token not found.');
      return;
    }
    const response = await axios.delete(`${BASE_URL}/follow`, {
      data: { followerId, followingId: userId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Unfollowed user successfully.', response.data);
  } catch (error) {
    console.error('Error unfollowing user:', error.response ? error.response.data : error);
  }
};

const checkIfFollowing = async (userId, followerId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.log('Authentication token not found.');
      return false;
    }
    const response = await axios.get(`${BASE_URL}/follow/isFollowing`, {
      params: { followerId, followingId: userId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Fetched follow status successfully.', response.data);
    return response.data.isFollowing;
  } catch (error) {
    console.error('Error fetching follow status:', error.response ? error.response.data : error);
    return false;
  }
};

export { followUser, unfollowUser, checkIfFollowing };