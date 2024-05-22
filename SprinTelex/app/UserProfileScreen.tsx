import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Image, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CurrentUserContext } from '../context/currentUserContext';
import FollowButton from './components/FollowButton'; // Adjusted import path as necessary

const UserProfileScreen = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;
  const { currentUser } = useContext(CurrentUserContext); // Assuming this context provides the current user's ID

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('Authentication token not found. Please log in again.');
          Alert.alert('Error', 'Authentication token not found. Please log in again.');
          return;
        }
        const response = await axios.get(`http://192.168.8.130:3001/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error.response ? error.response.data : error);
        Alert.alert('Error', 'Failed to fetch user profile. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, currentUser]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User profile not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: userProfile.profilePictureUrl || 'https://via.placeholder.com/150' }} style={styles.profilePic} />
      <Text style={styles.username}>{userProfile.username}</Text>
      <Text style={styles.bio}>{userProfile.bio}</Text>
      {/* Check if currentUser is not null before rendering FollowButton */}
      {currentUser ? (
        <FollowButton userId={userId} currentUser={currentUser} />
      ) : (
        <Text style={styles.errorText}>You must be logged in to follow users.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default UserProfileScreen;