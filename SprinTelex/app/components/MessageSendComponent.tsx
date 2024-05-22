import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, FlatList, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MessageSendComponent = ({ channelId }) => {
  const [message, setMessage] = useState('');
  const [followers, setFollowers] = useState([]);
  const [selectedFollower, setSelectedFollower] = useState(null);
  const API_URL = process.env.API_BASE_URL || 'http://192.168.8.130:3001';

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert("Error", "Authentication token not found. Please login again.");
          return;
        }

        const response = await axios.get(`${API_URL}/api/followers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setFollowers(response.data.followers);
        }
      } catch (error) {
        console.error('Error fetching followers:', error.response ? error.response.data : error);
        Alert.alert("Error", "Failed to fetch followers. Please try again later.");
      }
    };

    fetchFollowers();
  }, []);

  const sendMessage = async () => {
    if (!selectedFollower) {
      Alert.alert("Error", "Cannot send message. Please select a follower.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.post(`${API_URL}/api/chat/${channelId}/send`, {
        receiverId: selectedFollower, // Use the selected follower's ID as the receiverId
        message: message,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        console.log('Message sent successfully');
        setMessage(''); // Clear the input field
        // Here, add logic to update the UI with the new message
      }
    } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error);
      Alert.alert("Error", "Failed to send message. Please try again later.");
    }
  };

  return (
    <View>
      <FlatList
        data={followers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedFollower(item.id)}>
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
      <TextInput
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
      />
      <Button
        title="Send"
        onPress={sendMessage}
      />
    </View>
  );
};

export default MessageSendComponent;