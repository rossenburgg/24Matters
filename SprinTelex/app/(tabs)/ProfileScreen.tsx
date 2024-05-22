import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileScreenLayout from '../components/ProfileScreenLayout';
const ProfileScreen = () => {
 
  return (
    <ProfileScreenLayout />
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  info: {
    margin: 10,
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default ProfileScreen;