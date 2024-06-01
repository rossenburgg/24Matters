import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/authContext'; // Ensure this path matches the actual location of your context file

function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { signIn } = useAuth();
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const serverUrl = Constants.manifest?.extra?.serverUrl || "http://192.168.8.130:8000"; // Fallback server URL if extra is not defined
      const response = await fetch(`${serverUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username,
        }),
      });
      const data = await response.json();
      if (data.success) {
        Alert.alert("Registration Successful", "You are now registered and can log in.");
        await AsyncStorage.setItem('userToken', data.token); // Save the token to AsyncStorage
        signIn(data.token); // Update auth context state
        navigation.replace('Main'); // Navigate to the main app flow
      } else {
        Alert.alert("Registration Failed", data.error || "An error occurred during registration.");
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert("Registration Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Username:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      />
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      />
      <Text>Password:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
      />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

export default RegisterScreen;