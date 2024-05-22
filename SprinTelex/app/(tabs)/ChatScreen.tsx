import { StyleSheet, View, TextInput, Button, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = 'http://192.168.8.130:3001'; 

export default function ChannelListScreen() {
  const { currentUser } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      setLoading(true);
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          console.log('User token not found');
          setLoading(false);
          return;
        }
        const response = await axios.get(`${API_BASE_URL}/api/chat/channels`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setChannels(response.data.channels);
      } catch (error) {
        console.error('Error fetching channels:', error.response ? error.response.data : error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchChannels();
    }
  }, [currentUser]);

  const sendMessage = async () => {
    if (!selectedChannel) {
      console.log('No channel selected');
      return;
    }
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        console.log('User token not found');
        return;
      }
      const response = await axios.post(`${API_BASE_URL}/api/chat/${selectedChannel.id}/send`, { message }, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log('Message sent successfully:', response.data);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error.response ? error.response.data : error);
    }
  };

  const renderChannel = ({ item }) => (
    <TouchableOpacity
      style={styles.channelItem}
      onPress={() => {
        setSelectedChannel(item);
        setMessage('');
      }}
    >
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={channels}
        renderItem={renderChannel}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<Text style={styles.header}>Select a channel to message:</Text>}
      />
      {selectedChannel && (
        <>
          <Text style={styles.selectedChannel}>Messaging: {selectedChannel.name}</Text>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
          />
          <Button title="Send" onPress={sendMessage} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  channelItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  selectedChannel: {
    fontSize: 16,
    padding: 10,
    color: 'blue',
  },
});