import React, { useEffect, useState, useContext } from 'react';
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/authContext'; // Ensure this path matches the actual location of your context file

function ChatListScreen() {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useContext(AuthContext);

  useEffect(() => {
    if (!userToken) {
      console.log('No user token found, redirecting to login...');
      navigation.navigate('Login');
      return;
    }

    const fetchChats = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://192.168.8.130:8000/api/chats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          },
        });
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chat list:', error.message, error.stack);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [userToken, navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Chat', { chatId: item.id })}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18 }}>{item.name}</Text>
        <Text style={{ color: 'gray' }}>{item.lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={chats}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

export default ChatListScreen;