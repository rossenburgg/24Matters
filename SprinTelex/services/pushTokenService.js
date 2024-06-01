import axios from 'axios';

async function sendPushTokenToServer(token) {
  console.log('Sending push token to server:', token);
  try {
    const response = await axios.post('http://192.168.8.130:8000/api/pushtoken/register', { token });
    console.log('Push token registered successfully:', response.data);
  } catch (error) {
    console.error('Error sending push token to server:', error.response ? error.response.data : error);
  }
}

export { sendPushTokenToServer };