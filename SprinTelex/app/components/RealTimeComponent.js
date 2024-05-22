import React, { useEffect, useContext } from 'react';
import { Text, View } from 'react-native';
import { WebSocketContext } from '../context/WebSocketContext';

const RealTimeComponent = () => {
  const socket = useContext(WebSocketContext);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('Real-time data received:', data);
        // Handle the real-time data here. For example, update the state or display a notification.
      };

      socket.onerror = (e) => {
        console.error('WebSocket encountered an error:', e.message, e);
      };
    }

    return () => {
      if (socket) {
        socket.onmessage = null;
        socket.onerror = null;
      }
    };
  }, [socket]);

  return (
    <View>
      <Text>Real-Time Updates Component</Text>
      {/* Display real-time data here */}
    </View>
  );
};

export default RealTimeComponent;