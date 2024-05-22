import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileEditScreen = () => {
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  const updateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.log('No token found');
        Alert.alert('Error', 'You must be logged in to update your profile.');
        return;
      }
      const response = await axios.patch('http://192.168.8.130:3001/api/users/profile/update', { username, location, bio, profilePictureUrl }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Profile updated successfully:', response.data);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={styles.input} />
      <TextInput placeholder="Bio" value={bio} onChangeText={setBio} style={styles.input} />
      <TextInput placeholder="Profile Picture URL" value={profilePictureUrl} onChangeText={setProfilePictureUrl} style={styles.input} />
      <Button title="Update Profile" onPress={updateProfile} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default ProfileEditScreen;