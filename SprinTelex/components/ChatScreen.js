import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/authContext';
import getSocket from '../utils/socketUtil'; // Import the getSocket utility

function ChatScreen({ route }) {
  const { chatId } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    if (!userToken) {
      console.log('No user token found, redirecting to login...');
      navigation.navigate('Login');
      return;
    }

    const fetchMessages = async () => {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      fetch(`http://192.168.8.1:8000/api/messages/${chatId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        setMessages(data.map(msg => ({ ...msg, id: uuidv4() }))); // Assigning unique IDs to messages
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching messages:', error.message, error.stack);
        setIsLoading(false);
      });
    };

    fetchMessages();

    let socket;
    const initSocket = async () => {
      socket = await getSocket(); // Initialize socket connection
      if (!socket) {
        console.log('Socket connection failed');
        return;
      }

      socket.on('receive message', (newMessage) => {
        const messageWithUniqueId = { ...newMessage, id: uuidv4() };
        setMessages((prevMessages) => [...prevMessages, messageWithUniqueId]);
        console.log('New message received', newMessage);
      });
    };

    initSocket();

    return () => {
      if (socket) {
        socket.off('receive message'); // Remove the event listener
        socket.disconnect(); // Disconnect the socket
        console.log('Disconnected from socket server');
      }
    };
  }, [chatId, navigation, userToken]);

  const handleSendMessage = () => {
    if (message && socket) {
      const messageData = {
        chatId,
        sender: 'You', // This should eventually be replaced with the sender's actual user ID or name
        message,
      };
      socket.emit('new message', messageData);
      console.log(`Sending message: ${message} to chat ID: ${chatId}`);
      setMessages((prevMessages) => [...prevMessages, { ...messageData, id: uuidv4() }]); // Re-add the message to the UI
      setMessage('');
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, backgroundColor: item.sender === 'You' ? '#DCF8C6' : '#FFF' }}>
            <Text>{item.sender}: {item.message}</Text>
          </View>
        )}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type your message..."
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 20 }}
      />
      <Button title="Send" onPress={handleSendMessage} />
    </View>
  );
}

export default ChatScreen;