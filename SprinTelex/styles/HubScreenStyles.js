import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerRightIcon: {
    marginRight: 15,
    opacity: 1, // Default opacity for the icon
  },
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  profilePic: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  hubText: {
    fontWeight: 'bold',
  },
});

export default styles;