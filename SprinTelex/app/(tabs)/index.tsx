import * as React from 'react';
import { StyleSheet,  ScrollView, Dimensions, SafeAreaView, Platform, RefreshControl } from 'react-native';

import HomeScreenInfo from '@/components/HomeScreenInfo';
import { Text, View } from '@/components/Themed';
import StatusView from '@/components/StatusView';
import Lottie from 'lottie-react-native';
import { ThreadContext } from '@/context/thread-context';

const screenHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  const animationRef = React.useRef<Lottie>(null);
 

  return (

    <View style={styles.container}>
      {/* <View style={styles.storyContainer}>
        <StatusView />
      </View> */}
      <SafeAreaView>
      <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 10,
        paddingTop: Platform.select({ android: 30}),
      }}
      refreshControl={
        <RefreshControl 
        refreshing={false}
        onRefresh={() => {animationRef.current?.play();

        }}
        tintColor={"transparent"}
      
      />}
      >
        <Lottie 
        ref={animationRef}
        source={require("../animations/key.json")}
        loop={false}
        autoPlay={true}
        style={{width: 50,
           height: 50, 
           alignSelf: 'center'
          }}
        />
       
        <View style={styles.homeScreenInfoContainer}>
          <HomeScreenInfo  />
        </View>
      </ScrollView>
      </SafeAreaView>
    </View>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  storyContainer: {
    height: screenHeight / 8, // Story component takes no more than one-third of the screen height
  },
  homeScreenInfoScrollView: {
    flex: 1, // Allows the ScrollView to take up the remaining space
  },
  homeScreenInfoContainer: {
    // Adjust this style as needed to ensure it displays correctly within the ScrollView
  },
});