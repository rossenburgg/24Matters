import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useThemeColor } from './Themed';

const MessageBubble = ({ message, isOwnMessage }) => {
  const backgroundColor = useThemeColor({}, isOwnMessage ? 'tint' : 'background');
  const textColor = useThemeColor({}, isOwnMessage ? 'background' : 'text');

  return (
    <View style={[styles.messageBubble, { backgroundColor }, isOwnMessage && styles.ownMessage]}>
      {message.profilePictureUrl && (
        <Image source={{ uri: message.profilePictureUrl }} style={styles.profilePic} />
      )}
      <Text style={{ color: textColor }}>{message.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  messageBubble: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  profilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
});

export default MessageBubble;