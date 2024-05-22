import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext'; // Updated import path to AuthContext

const FollowersList = ({ navigation }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext); // Updated to use AuthContext

  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      try {
        if (!currentUser || !currentUser._id) {
          console.error("Invalid user ID");
          setError('Invalid user ID. Please ensure you are logged in and try again.');
          setLoading(false);
          return;
        }
        const token = await AsyncStorage.getItem('userToken'); 
        if (!token) {
          console.error("Authentication token not found");
          setError('Authentication token not found. Please login again.');
          setLoading(false);
          return;
        }
        const response = await axios.get(`http://192.168.8.130:3001/api/followers/${currentUser._id}`, { // Updated API URL to include user ID
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFollowers(response.data);
      } catch (err) {
        console.error("Error fetching followers: ", err.response ? err.response.data : err);
        setError('Failed to fetch followers. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [currentUser]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Chat', { userId: item._id })}
    >
      <Text style={styles.title}>{item.username}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <View style={styles.container}><Text>Loading followers...</Text></View>;
  }

  if (error) {
    return <View style={styles.container}><Text>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={followers}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
  },
});

export default FollowersList;