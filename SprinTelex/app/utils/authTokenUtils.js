import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'; // Replacing jwtDecode with axios for API calls

const checkTokenValidity = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      console.log('No user token found in AsyncStorage');
      return false;
    }
    // Making an API call to validate the token
    const response = await axios.post('http://192.168.8.130:300/api/auth/validateToken', { token }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.data.isValid) {
      console.log('User token found in AsyncStorage and is valid');
      return true;
    } else {
      console.log('Token has expired or is invalid');
      return false;
    }
  } catch (error) {
    console.error('Error checking token validity:', error);
    console.error(error.message);
    return false;
  }
};

/**
 * Stores the authentication token in AsyncStorage.
 * @param {string} token - The authentication token to store.
 */
const storeAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', token);
    console.log('Auth token stored successfully');
  } catch (error) {
    console.error('Failed to store the auth token:', error);
    console.error(error.message);
  }
};

/**
 * Retrieves the authentication token from AsyncStorage.
 * @returns {Promise<string|null>} The retrieved authentication token, or null if not found.
 */
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    console.log('Auth token retrieved successfully');
    return token;
  } catch (error) {
    console.error('Failed to retrieve the auth token:', error);
    console.error(error.message);
    return null;
  }
};

export { checkTokenValidity, storeAuthToken, getAuthToken };