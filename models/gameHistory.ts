import { pgTable, uuid, text } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const GameHistory = pgTable('game_history', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: uuid('user_id').notNull(),
  game: text('game').notNull(),
  result: text('result').notNull(),
});