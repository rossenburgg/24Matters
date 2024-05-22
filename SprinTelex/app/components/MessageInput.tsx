import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const MessageInput = ({ channelId }) => {
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch followers on component mount
    const fetchFollowers = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert("Error", "Authentication token not found. Please login again.");
          return;
        }
        navigation.navigate('FollowersList');
      } catch (error) {
        console.error('Error navigating to FollowersList:', error.response ? error.response.data : error);
        Alert.alert("Error", "Failed to navigate to FollowersList. Please try again later.");
      }
    };

    fetchFollowers();
  }, [navigation]);

  const sendMessage = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please login again.");
        return;
      }

      const response = await axios.post(`http://192.168.8.130:3001/api/chat/${channelId}/send`, {
        message: message,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        console.log('Message sent successfully');
        setMessage(''); // Clear the input field
      }
    } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error);
      Alert.alert("Error", "Failed to send message. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message"
      />
      <Button
        title="Send"
        onPress={sendMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default MessageInput;