import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';

import SettingsModalInfo from '@/components/SettingsModalInfo';
import { Text, View } from '@/components/Themed';

export default function settingsModal() {
  return (
    <View style={styles.container}>
      <SettingsModalInfo path="app/modal.tsx" />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },

});
