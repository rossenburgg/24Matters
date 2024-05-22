import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { db } from '../mongodbConfig'; // Adjust the path as per your project structure
import { collection, doc, onSnapshot, orderBy, query } from 'mongodb/firestore';
import MessageBubble from './MessageBubble'; // Import the MessageBubble component
import { auth } from '../mongodbConfig'; // Ensure this import is correct based on your project structure

const ChatThread = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const currentUserId = auth.currentUser?.uid; // Get the current user's ID

  useEffect(() => {
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      }));
      setMessages(fetchedMessages);
    }, error => {
      console.error("Error fetching real-time messages:", error);
    });

    return unsubscribe;
  }, [chatId]);

  return (
    <ScrollView style={styles.container}>
      {messages.map(({ id, data }) => (
        <MessageBubble key={id} message={data} isOwnMessage={data.senderId === currentUserId} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatThread;
