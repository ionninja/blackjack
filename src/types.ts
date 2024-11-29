export interface User {
  userId: string;
  username: string;
  password: string; // Ensure the password property is included
}

export interface Table {
  tableId: string;
  maxSeats: number;
  seats: string[];
}

export interface GameHistory {
  game: string;
  result: string;
}

export interface Hand {
  cards: string[];
  value: number;
}

export interface Query {
  getTables: () => Table[];
  getGameHistory: (parent: any, args: { userId: string }) => GameHistory[];
}

export interface Mutation {
  registerUser: (parent: any, args: { username: string; password: string }) => User;
  authenticateUser: (parent: any, args: { username: string; password: string }) => User;
  createTable: (parent: any, args: { tableId: string; maxSeats: number }) => Table;
  joinTable: (parent: any, args: { tableId: string; userId: string }) => Table;
  addGameHistory: (parent: any, args: { userId: string; game: string; result: string }) => GameHistory;
  startBlackjackGame: (parent: any, args: { tableId: string }) => Hand[];
  playerAction: (parent: any, args: { tableId: string; userId: string; action: string }) => Hand;
}