import React, { useEffect, useState } from 'react';
import { StyleSheet, Button, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '@/components/Themed';
const REACT_NATIVE_BACKEND_URL = 'http://192.168.8.130:3001';

const SettingsScreen = () => {
  const navigation = useNavigation();


  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('userToken'); // Remove the JWT token from AsyncStorage
      console.log('User signed out successfully');
      navigation.navigate('SigninScreen');
    } catch (error) {
      console.error('Error signing out:', error);
      console.error(error.message); // Logging the full error message and trace
      Alert.alert('Error', 'Failed to sign out.');
    }
  };

  return (
    <View style={styles.container}>
     
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default SettingsScreen;