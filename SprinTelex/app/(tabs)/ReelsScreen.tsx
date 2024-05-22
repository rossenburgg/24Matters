import React, { useState, useEffect, useRef } from 'react';
import {FlatList, StyleSheet, Dimensions,  Platform } from 'react-native';
import { Text, View } from '@/components/Themed';
import { StatusBar } from 'expo-status-bar';
import ReelsScreen from '../screens/ReelsScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const ReelsScreenContainer = () => {


  return (

<GestureHandlerRootView style={[{ flex: 1 }, styles.container]}>
      <ReelsScreen />
      <StatusBar style="light" />

      </GestureHandlerRootView>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000', // Changed background color to black as per user feedback
  },
});

export default ReelsScreenContainer;
