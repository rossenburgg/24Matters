import React, { useContext, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { useSubscription, gql } from '@apollo/client';
import { AuthContext } from '@/context/AuthContext'; // Ensure this path is correct and points to your AuthContext file
import { useNavigation } from '@react-navigation/native';

const MESSAGE_SENT_SUBSCRIPTION = gql`
  subscription OnMessageSent {
    messageSent {
      id
      content
      sender {
        id
        username
      }
      receiver {
        id
        username
      }
    }
  }
`;

const ChatScreen = () => {
  const { currentUser } = useContext(AuthContext); // Assuming AuthContext provides currentUser
  const navigation = useNavigation();
  const { data, loading, error } = useSubscription(MESSAGE_SENT_SUBSCRIPTION, {
    shouldResubscribe: true,
    onSubscriptionData: ({ subscriptionData }) => {
      console.log('New message received:', subscriptionData.data.messageSent.content);
      Alert.alert("New Message", `You've got a new message: ${subscriptionData.data.messageSent.content}`);
    },
  });

  useEffect(() => {
    if (error) {
      console.error(`Error subscribing to messages: ${error.message}`, error);
      Alert.alert('Subscription Error', `Error subscribing to messages: ${error.message}`);
    }
    if (!currentUser) {
      console.log('No current user found, redirecting to sign-in screen.');
      navigation.navigate('SigninScreen');
    }
  }, [error, currentUser, navigation]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error! ${error.message}</Text>;

  return (
    <View>
      {data && data.messageSent && <Text>New message: {data.messageSent.content}</Text>}
    </View>
  );
};

export default ChatScreen;