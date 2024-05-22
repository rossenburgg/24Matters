import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { useWebSocket } from './../context/WebSocketContext';

const API_URL = process.env.API_URL; 
const ChatWrapper = ({ route }) => {
  const { userToken } = useContext(AuthContext);
  const webSocket = useWebSocket();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();
  const { channelId } = route.params;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/chat/${channelId}/messages`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        setLoading(false);
      }
    };

    if (userToken && channelId) {
      fetchMessages();
    }
  }, [userToken, channelId]);

  useEffect(() => {
    const handleNewMessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.channelId === channelId) {
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }
    };

    if (webSocket) {
      webSocket.addEventListener('message', handleNewMessage);
    }

    return () => {
      if (webSocket) {
        webSocket.removeEventListener('message', handleNewMessage);
      }
    };
  }, [channelId, webSocket]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Custom message list and input components should be implemented here
  // For demonstration, only a simple list is shown
  return (
    <View style={{ flex: 1 }}>
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <View key={index} style={{ margin: 10, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
            <Text style={{ fontWeight: 'bold' }}>{message.senderName}</Text>
            <Text>{message.text}</Text>
          </View>
        ))
      ) : (
        <Text>No messages</Text>
      )}
    </View>
  );
};

export default ChatWrapper;