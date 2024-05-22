const { gql } = require('apollo-server-express');

const userSchema = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    location: String
    bio: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    getUser(id: ID!): User
    users: [User] # Corrected from getUsers to users to match the resolver implementation
  }

  extend type Mutation {
    createUser(username: String!, email: String!, location: String, bio: String): User
    updateUser(id: ID!, username: String, email: String, location: String, bio: String): User
    signIn(email: String!, password: String!): AuthPayload
  }
`;

module.exports = userSchema;