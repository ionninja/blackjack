import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const User = pgTable('users', {
  userId: uuid('user_id').primaryKey().default(sql`uuid_generate_v4()`),
  username: varchar('username', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
});