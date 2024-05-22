import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image, Alert, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

const FollowersScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('Authentication token not found. Please log in again.');
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        console.log('Fetching followers for userId:', userId);
        const response = await axios.get(`http://192.168.8.130:3001/api/users/${userId}/followers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched followers data:', response.data);
        setFollowers(response.data.followers);
      } catch (error) {
        console.error('Error fetching followers:', error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  const handleRemoveFollower = async (followerId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.delete(`http://192.168.8.130:3001/api/users/${followerId}/removeFollower`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setFollowers(followers.filter(follower => follower._id !== followerId));
        Alert.alert("Success", "Follower removed successfully.");
      }
    } catch (error) {
      console.error('Error removing follower:', error.response ? error.response.data : error.message);
      Alert.alert("Error", "Failed to remove follower.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={followers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('UserProfileScreen', { userId: item.follower._id.toString() })} style={styles.profileContainer}>
              <Image source={{ uri: item.follower.profilePictureUrl || 'https://via.placeholder.com/50' }} style={styles.profileImage} />
              <Text style={styles.item}>{item.follower.username}</Text>
            </TouchableOpacity>
            <Button title="Remove" color="#ff0000" onPress={() => handleRemoveFollower(item._id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  item: {
    fontSize: 18,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
  },
});

export default FollowersScreen;