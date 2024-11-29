import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { createDeck, shuffleDeck, dealCards, calculateHandValue, splitHand, doubleDown, dealerDraw } from './main.js';

const users = new Map();
const tables = new Map();
const gameHistory = new Map();

const blackjackGames = new Map();

export const resolvers = {
  Query: {
    getTables: () => Array.from(tables.values()),
    getGameHistory: (_, { userId }) => gameHistory.get(userId) || [],
  },
  Mutation: {
    registerUser: async (_, { username, password }) => {
      if (users.has(username)) {
        throw new Error('Username already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      users.set(username, { userId, username, password: hashedPassword });
      return { userId, username };
    },
    authenticateUser: async (_, { username, password }) => {
      const user = users.get(username);
      if (!user) {
        throw new Error('Invalid username or password');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid username or password');
      }
      return { userId: user.userId, username: user.username };
    },
    createTable: (_, { tableId, maxSeats }) => {
      if (tables.has(tableId)) {
        throw new Error('Table already exists');
      }
      const table = { tableId, maxSeats, seats: [] };
      tables.set(tableId, table);
      return table;
    },
    joinTable: (_, { tableId, userId }) => {
      const table = tables.get(tableId);
      if (!table) {
        throw new Error('Table not found');
      }
      if (table.seats.length >= table.maxSeats) {
        throw new Error('Table is full');
      }
      table.seats.push(userId);
      return table;
    },
    addGameHistory: (_, { userId, game, result }) => {
      if (!gameHistory.has(userId)) {
        gameHistory.set(userId, []);
      }
      const history = { game, result };
      gameHistory.get(userId).push(history);
      return history;
    },
    startBlackjackGame: (_, { tableId }) => {
      const table = tables.get(tableId);
      if (!table) {
        throw new Error('Table not found');
      }
      const deck = shuffleDeck(createDeck());
      const dealerHand = dealCards(deck, 2);
      const playerHands = table.seats.map(userId => ({
        userId,
        hand: dealCards(deck, 2),
      }));
      blackjackGames.set(tableId, { deck, dealerHand, playerHands });
      return playerHands.map(({ hand }) => ({
        cards: hand,
        value: calculateHandValue(hand),
      }));
    },
    playerAction: (_, { tableId, userId, action }) => {
      const game = blackjackGames.get(tableId);
      if (!game) {
        throw new Error('Game not found');
      }
      const player = game.playerHands.find(p => p.userId === userId);
      if (!player) {
        throw new Error('Player not found');
      }
      let hand = player.hand;
      if (action === 'hit') {
        hand.push(game.deck.shift());
      } else if (action === 'stand') {
        // Do nothing
      } else if (action === 'double') {
        const result = doubleDown(hand, game.deck, 10); // Assuming 10 units for double down
        hand = result.hand;
      } else {
        throw new Error('Invalid action');
      }
      player.hand = hand;
      return {
        cards: hand,
        value: calculateHandValue(hand),
      };
    },
  },
};

export { users, gameHistory };