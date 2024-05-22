const { gql } = require('apollo-server-express');

const baseSchema = gql`
  type Query {
    _empty: String
    hello: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    messageSent: Message
  }

  type Message {
    id: ID!
    content: String!
    sender: User!
    receiver: User!
  }

  type User {
    id: ID!
    username: String!
    email: String
    location: String
    bio: String
  }
`;

module.exports = baseSchema;