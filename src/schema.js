import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type User {
    userId: ID!
    username: String!
  }

  type Table {
    tableId: ID!
    maxSeats: Int!
    seats: [ID!]!
  }

  type GameHistory {
    game: String!
    result: String!
  }

  type Hand {
    cards: [String!]!
    value: Int!
  }

  type Query {
    getTables: [Table!]!
    getGameHistory(userId: ID!): [GameHistory!]!
  }

  type Mutation {
    registerUser(username: String!, password: String!): User!
    authenticateUser(username: String!, password: String!): User!
    createTable(tableId: ID!, maxSeats: Int!): Table!
    joinTable(tableId: ID!, userId: ID!): Table!
    addGameHistory(userId: ID!, game: String!, result: String!): GameHistory!
    startBlackjackGame(tableId: ID!): [Hand!]!
    playerAction(tableId: ID!, userId: ID!, action: String!): Hand!
  }
`;

export const resolvers = {
  Query: {
    getTables: () => {
      // Implement your resolver logic here
    },
    getGameHistory: (parent, args) => {
      // Implement your resolver logic here
    },
  },
  Mutation: {
    registerUser: (parent, args) => {
      // Implement your resolver logic here
    },
    authenticateUser: (parent, args) => {
      // Implement your resolver logic here
    },
    createTable: (parent, args) => {
      // Implement your resolver logic here
    },
    joinTable: (parent, args) => {
      // Implement your resolver logic here
    },
    addGameHistory: (parent, args) => {
      // Implement your resolver logic here
    },
  },
};