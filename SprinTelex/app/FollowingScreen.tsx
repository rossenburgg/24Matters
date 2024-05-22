import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation } from '@react-navigation/native';

const FollowingScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const userId = route.params?.userId.toString(); // Ensure userId is treated as a string
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFollowing = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('Authentication token not found. Please log in again.');
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        const response = await axios.get(`http://192.168.8.130:3001/api/users/${userId}/following`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFollowing(response.data.following);
      } catch (error) {
        console.error('Error fetching following list:', error.response ? error.response.data : error);
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFollowing();
    }
  }, [userId]);

  const handleUnfollow = async (followId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(`http://192.168.8.130:3001/api/users/${followId}/unfollow`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFollowing(following.filter(follow => follow._id !== followId));
      Alert.alert("Unfollowed", "You have successfully unfollowed the user.");
    } catch (error) {
      console.error('Error unfollowing user:', error.response ? error.response.data : error.message);
      Alert.alert("Error", "Failed to unfollow the user.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading...</Text>
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
        data={following}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('UserProfileScreen', { userId: item._id.toString() })} style={styles.profileContainer}>
              <Image source={{ uri: item.profilePictureUrl || 'https://via.placeholder.com/50' }} style={styles.profileImage} />
              <Text style={styles.item}>{item.username}</Text>
            </TouchableOpacity>
            <Button title="Unfollow" color="#ff0000" onPress={() => handleUnfollow(item._id)} />
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

export default FollowingScreen;