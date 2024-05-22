import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
});

const LoadingFallback = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" />
    <Text style={styles.text}>Loading...</Text>
  </View>
);

export default LoadingFallback;