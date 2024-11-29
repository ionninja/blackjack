import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { createDeck, shuffleDeck, dealCards, calculateHandValue, splitHand, doubleDown, dealerDraw } from './main';
import type { User, Table, GameHistory, Hand } from './types';

const users = new Map<string, User>();
const tables = new Map<string, Table>();
const gameHistory = new Map<string, GameHistory[]>();

const blackjackGames = new Map<string, any>();

export const resolvers = {
  Query: {
    getTables: (): Table[] => Array.from(tables.values()),
    getGameHistory: (_: any, { userId }: { userId: string }): GameHistory[] => gameHistory.get(userId) || [],
  },
  Mutation: {
    registerUser: async (_: any, { username, password }: { username: string; password: string }): Promise<User> => {
      if (users.has(username)) {
        throw new Error('Username already exists');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = uuidv4();
      const user: User = { userId, username, password: hashedPassword };
      users.set(username, user);
      return { userId, username, password: hashedPassword };
    },
    authenticateUser: async (_: any, { username, password }: { username: string; password: string }): Promise<User> => {
      const user = users.get(username);
      if (!user) {
        throw new Error('Invalid username or password');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid username or password');
      }
      return user;
    },
    startBlackjackGame: (_: any, { tableId }: { tableId: string }): Hand[] => {
      const table = tables.get(tableId);
      if (!table) {
        throw new Error('Table not found');
      }
      const deck = shuffleDeck(createDeck());
      const dealerHand = dealCards(deck, 2);
      const playerHands = table.seats.map((userId: string) => ({
        userId,
        hand: dealCards(deck, 2),
      }));
      blackjackGames.set(tableId, { deck, dealerHand, playerHands });
      return playerHands.map(({ hand }) => ({
        cards: hand,
        value: calculateHandValue(hand),
      }));
    },
    playerAction: (_: any, { tableId, userId, action }: { tableId: string; userId: string; action: string }): Hand => {
      const game = blackjackGames.get(tableId);
      if (!game) {
        throw new Error('Game not found');
      }
      const player = game.playerHands.find((p: { userId: string }) => p.userId === userId);
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