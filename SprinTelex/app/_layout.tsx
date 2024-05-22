import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider } from './context/AuthContext';
import { ThreadProvider } from '@/context/thread-context';
import { ChatWrapper } from "../components/ChatWrapper";
import { AppProvider } from "../context/AppContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { WebSocketProvider } from '../app/context/WebSocketContext';
import { GluestackUIProvider } from "@gluestack-ui/themed"
import { config } from "@gluestack-ui/config" // Optional if you want to use default theme
import client from '../app/apolloClient'; // INPUT_REQUIRED {Ensure this path is correct and points to your Apollo Client setup file}
import { ApolloProvider } from '@apollo/client';
import ErrorBoundary from '../app/components/ErrorBoundary'; // Ensure this path is correct and points to your ErrorBoundary component

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    InstagramSans: require('../assets/fonts/instagram-sans-2/Instagram-Sans.ttf'),
    InstagramSansBold: require('../assets/fonts/instagram-sans-2/Instagram-Sans-Bold.ttf'),
    InstagramSansMedium: require('../assets/fonts/instagram-sans-2/Instagram-Sans-Medium.ttf'),
    InstagramSansLight: require('../assets/fonts/instagram-sans-2/Instagram-Sans-Light.ttf'),



    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  

  return (
    <GestureHandlerRootView style={styles.container}>
    <ErrorBoundary>

          <ApolloProvider client={client}>

          <GluestackUIProvider config={config}>

      <WebSocketProvider>

    <AuthProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ThreadProvider>
        <AppProvider>
      <ChatWrapper>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="settingsModal" options={{ presentation: 'modal' }} />
        <Stack.Screen name="NotificationsScreen" options={{ presentation: 'card', headerBackTitle: 'Notifcations', headerTitle: '', }} />
        <Stack.Screen name="SigninScreen" options={{ title: 'Sign In', gestureEnabled: false, headerShown: false }} />
        <Stack.Screen name="SignupScreen" options={{ title: 'Sign Up', headerShown: false }} />
        <Stack.Screen name="SearchScreen"  
        // options={{ title: 'Search' ,
        //  headerSearchBarOptions: { 
        // placeholder: 'Search...',},}}
         /> 
        <Stack.Screen name="ProfileEditScreen"options={{ title: 'Edit Profile' }} /> 
        <Stack.Screen name="UserProfileScreen"options={{ title: 'User Profile' }} /> 
        <Stack.Screen name="FollowersScreen"options={{ title: 'Followers Screen' }} />
        <Stack.Screen name="FollowingScreen"options={{ title: 'Following Screen' }} /> 


      </Stack>
      </ChatWrapper>
      </AppProvider>
      </ThreadProvider>
    </ThemeProvider>
    </AuthProvider>
    </WebSocketProvider>
    </GluestackUIProvider>
    </ApolloProvider>
    </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
});