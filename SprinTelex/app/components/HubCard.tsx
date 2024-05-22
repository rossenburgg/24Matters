import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { TextField,Card} from 'react-native-ui-lib';

interface HubCardProps {
  title: string;
  description: string;
  onPress: () => void;
}

const HubCard: React.FC<HubCardProps> = ({ title, description, onPress}) => {
  return (
      <Card style={styles.card} flex center onPress={onPress} enableShadow={false} >
      <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
</Card>
    
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    margin: 5,
    

  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
  },
});

export default HubCard;