import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';

function FriendSearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // This is intentionally left blank for future use
  }, []);

  const handleSearch = async () => {
    console.log(`Searching for: ${searchQuery}`);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const serverUrl = Constants.manifest?.extra?.serverUrl ?? "http://192.168.8.130:8000"; // Use nullish coalescing operator to provide a fallback server URL
      fetch(`${serverUrl}/api/friends/search?q=${searchQuery}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch');
        return response.json();
      })
      .then(data => {
        console.log(`Found ${data.length} users matching "${searchQuery}"`);
        setSearchResults(data);
      })
      .catch(error => {
        console.error('Error searching for users:', error);
        Alert.alert("Error", "Failed to fetch users. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
    } catch (error) {
      console.error('Error fetching token or searching:', error);
      setLoading(false);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    }
  };

  const handleSelectUser = (userId) => {
    // Navigate to the Chat screen with the selected userId to start a new chat
    navigation.navigate('Chat', { userId });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search for friends..."
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      />
      <Button title="Search" onPress={handleSearch} disabled={loading} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectUser(item.id)}>
              <View style={{ padding: 10 }}>
                <Text>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

export default FriendSearchScreen;