import React from 'react';
import { ApolloProvider } from '@apollo/client';
import client from './app/apolloClient'; // Ensure this path is correct and points to your Apollo Client setup file
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReelsScreen from './app/screens/ReelsScreen';
import ErrorBoundary from './app/components/ErrorBoundary'; // Ensure this path is correct and points to your ErrorBoundary component

const App = () => {
  return (
    <ApolloProvider client={client}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ErrorBoundary>
          <ReelsScreen />
        </ErrorBoundary>
      </GestureHandlerRootView>
    </ApolloProvider>
  );
};

export default App;