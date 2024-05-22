import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CurrentUserContext } from '../../context/currentUserContext'; // Assuming this context is correctly set up and exported

const FollowButton = ({ userId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(CurrentUserContext); // Use currentUser ID from context

  useEffect(() => {
    const checkFollowStatus = async () => {
      setIsLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('Authentication token not found. Please log in again.');
          return;
        }
        if (!currentUser) {
          console.log('No current user found. Please log in.');
          setIsLoading(false);
          return;
        }
        const response = await axios.get(`http://192.168.8.130:3001/api/users/${userId}/isFollowing`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Error fetching follow status:', error.response ? error.response.data : error);
        Alert.alert('Error', 'Failed to fetch follow status. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    checkFollowStatus();
  }, [userId, currentUser]);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('Authentication token not found. Please log in again.');
        return;
      }
      if (!currentUser) {
        console.log('No current user found. Please log in.');
        setIsLoading(false);
        return;
      }
      const followerId = currentUser; // Use currentUser ID for followerId
      if (isFollowing) {
        await axios.delete(`http://192.168.8.130:3001/api/follow/${followerId}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFollowing(false);
      } else {
        await axios.post(`http://192.168.8.130:3001/api/follow`, { followerId, followingId: userId }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error updating follow status:', error.response ? error.response.data : error);
      Alert.alert('Error', 'Failed to update follow status. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleFollow}>
        <Text style={styles.buttonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default FollowButton;