import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/authContext';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      // Ensure to replace the placeholder URL with your actual API URL before deployment
      const response = await fetch('YOUR_API_URL/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('userToken', data.token);
        signIn(data.token); // Update the auth context
        console.log('Login successful');
        // Removed direct navigation to MainTabNavigator
      } else {
        Alert.alert("Login Failed", data.error || "An error occurred during login.");
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert("Login Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
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
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

export default LoginScreen;