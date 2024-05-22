import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from './context/AuthContext'; // Assuming AuthContext is correctly exported from context/AuthContext

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const { userId } = useContext(AuthContext); // Assuming AuthContext provides userId
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('No token found');
          return;
        }
        const response = await axios.get(`http://192.168.8.130:3001/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (userId) {
      fetchProfileData();
    } else {
      console.log('UserId is undefined');
    }
  }, [userId]);

  const handleViewFollowers = () => {
    navigation.navigate('FollowersScreen', { userId: profileData?._id });
  };

  const handleViewFollowing = () => {
    navigation.navigate('FollowingScreen', { userId: profileData?._id });
  };

  return (
    <View style={styles.container}>
      {profileData ? (
        <>
          <Text style={styles.username}>{profileData.username}</Text>
          <Text>Followers: {profileData.followers?.length || 0}</Text>
          <Text>Following: {profileData.following?.length || 0}</Text>
          <Button title="View Followers" onPress={handleViewFollowers} />
          <Button title="View Following" onPress={handleViewFollowing} />
        </>
      ) : (
        <Text>Loading profile...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;