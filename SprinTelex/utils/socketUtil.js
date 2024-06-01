import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'http://192.168.8.130:8000'; 

async function getSocket() {
  const userToken = await AsyncStorage.getItem('userToken');
  if (!userToken) {
    console.error('No user token found, cannot connect to socket.');
    return null;
  }

  const socket = io(SOCKET_URL, {
    query: {
      token: userToken,
    },
    transports: ['websocket'], // Use WebSocket transport. This is especially important for React Native to ensure compatibility.
    jsonp: false, // Disables JSONP to enforce JSON communication. This is important for security and performance.
  });

  socket.on('connect', () => {
    console.log('Connected to the socket server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message, error.stack);
  });

  return socket;
}

export default getSocket;