import React, { useState } from 'react';
import { Button, TextInput, View } from 'react-native';
import { useWebSocket } from '../context/WebSocketContext';

const SendMessageComponent = () => {
  const [message, setMessage] = useState('');
  const { webSocket } = useWebSocket();

  const sendMessage = () => {
    if (webSocket) {
      try {
        webSocket.send(JSON.stringify({ type: 'message', content: message }));
        console.log('Message sent:', message);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error.message, error.stack);
      }
    } else {
      console.log('WebSocket connection is not established.');
    }
  };

  return (
    <View>
      <TextInput value={message} onChangeText={setMessage} placeholder="Type a message..." />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

export default SendMessageComponent;