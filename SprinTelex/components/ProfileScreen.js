import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/authContext'; // Ensure this path matches the actual location of your context file
import { useNavigation } from '@react-navigation/native';

function ProfileScreen() {
  const { signOut } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(); // Update auth context state
      navigation.navigate('Login');
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error.message, error.stack);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default ProfileScreen;