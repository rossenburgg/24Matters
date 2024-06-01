import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatListScreen from '../components/ChatListScreen';
import ChatScreen from '../components/ChatScreen';

const Stack = createStackNavigator();

function ChatStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Chats' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.chatName })} />
    </Stack.Navigator>
  );
}

export default ChatStackNavigator;