import React from 'react';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useThemeColor } from '@/components/Themed';
import { Text, View } from '@/components/Themed';

const NotificationsScreen = () => {
  const iconColor = useThemeColor({}, 'text');

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="bell-outline" size={30} color={iconColor} />
      <Text style={styles.title}>Notifications</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginTop: 10,
  },
});

export default NotificationsScreen;