import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';

const IconCard = ({ icons }) => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollView}>
      {icons.map((icon, index) => (
        <TouchableOpacity key={index} style={styles.iconContainer} onPress={() => console.log(`${icon.name} icon pressed`)}>
          <Image source={{ uri: icon.iconUrl }} style={styles.icon} />
          <Text style={styles.iconText}>{icon.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  iconText: {
    fontSize: 14,
  },
});

export default IconCard;