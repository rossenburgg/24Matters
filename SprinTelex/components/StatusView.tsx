import React, { memo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import Story from  'react-native-insta-story';
import { LinearGradient } from 'expo-linear-gradient';

const data = [
  {
    user_id: 1,
    user_image: 'https://pbs.twimg.com/profile_images/1222140802475773952/61OmyINj.jpg',
    user_name: 'Rossen',
    stories: [
      {
        story_id: 1,
        story_image: 'https://picsum.photos/200/300',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image: 'https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg',
      },
    ],
  },
  {
    user_id: 2,
    user_image: 'https://picsum.photos/200/300',
    user_name: 'Mikey',
    stories: [
      {
        story_id: 1,
        story_image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image: 'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: 3,
    user_image: 'https://picsum.photos/200/391',
    user_name: 'Mr.beast',
    stories: [
      {
        story_id: 1,
        story_image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image: 'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: 4,
    user_image: 'https://picsum.photos/200/360',
    user_name: 'zuck',
    stories: [
      {
        story_id: 1,
        story_image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image: 'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
  {
    user_id: 5,
    user_image: 'https://picsum.photos/200/500',
    user_name: 'Roney',
    stories: [
      {
        story_id: 1,
        story_image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 1 swiped'),
      },
      {
        story_id: 2,
        story_image: 'https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg',
        swipeText: 'Custom swipe text for this story',
        onPress: () => console.log('story 2 swiped'),
      },
    ],
  },
];

const StatusView = () => {
    
  return (
      <Story
       style={styles.container}
        data={data}
        duration={10}
        avatarSize={70}
        unPressedBorderColor={'red'}
        pressedBorderColor={'gray'}
        swipeText='Swipe to see next story'
      />

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    width: '100%',
    height: '100%',
  },
});

export default StatusView;