const { gql } = require('apollo-server-express');

const messageSchema = gql`
  type Message {
    id: ID!
    content: String!
    sender: User!
    receiver: User!
  }

  extend type Query {
    message(id: ID!): Message
    messagesBySender(senderId: ID!): [Message]
    messagesByReceiver(receiverId: ID!): [Message]
  }

  extend type Mutation {
    sendMessage(content: String!, senderId: ID!, receiverId: ID!): Message
  }
`;

module.exports = messageSchema;