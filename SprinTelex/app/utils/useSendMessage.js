import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { API_URL } from '@env'; // Assuming you have a .env file to store your environment variables

const useSendMessage = () => {
  const sendMessage = async (receiverId, message) => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        console.error("User token not found");
        Alert.alert("Error", "Authentication token not found. Please login again.");
        return;
      }
      const response = await axios.post(`${API_URL}/api/chat/send`, {
        receiverId: receiverId,
        message: message,
      }, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("Message sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending message:", error.response ? error.response.data : error);
      Alert.alert("Error", "Failed to send message. Please try again later.");
    }
  };

  return { sendMessage };
};

export default useSendMessage;