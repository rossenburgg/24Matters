import { ApolloClient, InMemoryCache, ApolloLink, split, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebSocketLink } from '@apollo/client/link/ws';
import { RetryLink } from '@apollo/client/link/retry';

const httpLink = new HttpLink({
  uri: 'http://192.168.8.130:3001/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'ws://192.168.8.130:3001/graphql',  
  options: {
    reconnect: true,
    reconnectionAttempts: 5,
    connectionParams: async () => {
      const token = await AsyncStorage.getItem('userToken');
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    },
    connectionCallback: (error) => {
      if (error) {
        console.error('WebSocket connection error:', error);
      } else {
        console.log('WebSocket connection established');
      }
    }
  },
});

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 5,
    retryIf: (error, _operation) => !!error
  }
});

const authLink = new ApolloLink(async (operation, forward) => {
  const token = await AsyncStorage.getItem('userToken');
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });
  return forward ? forward(operation) : null;
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) console.error(`[Network error]: ${networkError}`, networkError.stack);
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
);

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Define custom cache policies for specific queries if necessary
      },
    },
  },
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, retryLink, splitLink]),
  cache: cache,
  connectToDevTools: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    mutate: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    subscribe: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

export default client;