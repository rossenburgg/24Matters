import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Text, Image, FlatList, RefreshControl } from 'react-native';
import HubCard from '../components/HubCard'; // Make sure the import path matches your project structure
import { FontAwesome } from '@expo/vector-icons';
import { TextField,Card} from 'react-native-ui-lib';
import { BadgeIcon, Badge, BadgeText, GlobeIcon, Box ,
     Button, ButtonText, Actionsheet, ActionsheetBackdrop,
      ActionsheetContent, ActionsheetDragIndicatorWrapper, 
      ActionsheetDragIndicator, ActionsheetItem, ActionsheetItemText,
    } from '@gluestack-ui/themed';
const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function HubScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('1'); // State to track the active tab
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null); // State to track the selected card
  const handleIconPress = (iconName) => console.log(`${iconName} icon pressed`);

  const iconData = [
    { id: '1', iconName: 'camera-retro', name: 'Camera' },
    { id: '2', iconName: 'tv', name: 'Video' },
    { id: '3', iconName: 'envelope', name: 'Message' },
  ];

  const handleClose = () => {
    setShowActionsheet(false);
  };

  const handlePress = (title) => {
    setSelectedCard(title); // Set the selected card
    setShowActionsheet(true); // Open the Actionsheet
  };


  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  // Data for the pressable cards with background images
  const pressableCardData = [
    { id: '1', title: 'Title 1', subtitle: 'Subtitle 1', isNew: true, imageUrl: 'https://picsum.photos/200/100' },
    { id: '2', title: 'Title 2', subtitle: 'Subtitle 2', isNew: false, imageUrl: 'https://picsum.photos/200/200' },
    { id: '3', title: 'Title 3', subtitle: 'Subtitle 3', isNew: true, imageUrl: 'https://picsum.photos/200/301' },
    { id: '4', title: 'Title 4', subtitle: 'Subtitle 4', isNew: true, imageUrl: 'https://picsum.photos/200/301' },

  ];

  return (
    <ScrollView
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      {/* Button tabs container */}
      <ScrollView 
        horizontal={true} 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.buttonTabsContainer}
      >
        {['My Hub', 'Games', 'Events', 'Music', "Books and Shows"].map((tabId) => (
          <TouchableOpacity 
            key={tabId} 
            onPress={() => setActiveTab(tabId)} 
            style={[styles.buttonTab, activeTab === tabId && styles.activeButtonTab]}
          >
            <Text style={styles.buttonTabText}>{tabId}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.cardsContainer}>
        
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          {pressableCardData.map((card) => (
            <HubCard key={card.id}  title={card.title} description={card.subtitle} onPress={() => handlePress(card.title)} />
          ))}
        </ScrollView>
      </View>
      
      <Box>
        <Actionsheet isOpen={showActionsheet} onClose={handleClose} zIndex={999}>
          <ActionsheetBackdrop />
          <ActionsheetContent h="$72" zIndex={999}>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <ActionsheetItem onPress={handleClose}>
              <ActionsheetItemText>Delete</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem onPress={handleClose}>
              <ActionsheetItemText>Share</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem onPress={handleClose}>
              <ActionsheetItemText>Play</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem onPress={handleClose}>
              <ActionsheetItemText>Favourite</ActionsheetItemText>
            </ActionsheetItem>
            <ActionsheetItem onPress={handleClose}>
              <ActionsheetItemText>Cancel</ActionsheetItemText>
            </ActionsheetItem>
          </ActionsheetContent>
        </Actionsheet>
      </Box>
      
      {/* Main interactive card */}
      <View style={styles.mainCard}>
        {Array.from(Array(12)).map((_, index) => (
          <TouchableOpacity key={index} style={styles.iconContainer} onPress={() => handleIconPress(`icon-${index + 1}`)}>
            <FontAwesome name="question" size={24} color="black" />
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Horizontally scrollable card with icons and names */}
      <View style={styles.mainCard}>
        <FlatList
          horizontal
          data={iconData}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.iconCard} onPress={() => handleIconPress(item.iconName)}>
              <FontAwesome name={item.iconName} size={24} color="black" />
              <Text>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          style={[styles.iconList, {backgroundColor: '#f0f0f0'}]} // Applied background color to the iconList
        />
      </View>
      
      {/* Pressable cards with background images */}
      <View style={styles.pressableCardsContainer}>
        {pressableCardData.map((card) => (
          <Card key={card.id} style={styles.pressableCard} onPress={() => handlePress(card.title)}>
            <Image source={{ uri: card.imageUrl }} style={styles.cardImage} />
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </View>
            {card.isNew && (
              <Badge
                size="sm"
                variant="solid"
                borderRadius="$2xl"
                action="info"
                style={styles.newIndicator}
              >
                <BadgeText >New</BadgeText>
                <BadgeIcon as={GlobeIcon} ml="$2" />
              </Badge>
            )}
          </Card>
        ))}
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  cardsContainer: {
    height: Dimensions.get('window').height / 4,
    marginTop: 20,
  },
  scrollView: {
    paddingHorizontal: 20,
  },
  mainCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#f9f9f9',
    width: '95%',
    padding: 20,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  iconContainer: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCard: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  iconList: {
    marginTop: 20,
  },
  pressableCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  pressableCard: {
    width: '45%',
    height: 250,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#fff',
  },
  newIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: 10,
  },
  // Styles for the button tabs
  buttonTabsContainer: {
    justifyContent: 'center',
    paddingVertical: 10,
  },
  buttonTab: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    borderWidth: 1, // Adding border
    borderColor: '#2688EB', // Border color
  },  
  activeButtonTab: {
    backgroundColor: '#EBEDF0', // Active tab background color
  },
  buttonTabText: {
    color: '#2688EB',
    fontSize: 16,
  },
  pressableCard: {
    width: '45%',
    height: 250, // Adjust the height as needed
    marginBottom: 20,
    borderRadius: 10, // Adjust the border radius as needed
    overflow: 'hidden',
    position: 'relative',
  },
  
});
