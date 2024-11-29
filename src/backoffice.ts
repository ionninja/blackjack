import { db } from './db';
import { User, GameHistory } from './models';
import { eq } from 'drizzle-orm';

interface User {
    userId: string;
    username: string;
}

interface GameHistoryEntry {
    game: string;
    result: string;
}

export async function getUsers(): Promise<User[]> {
    const users = await db.select().from(User).execute();
    return users.map(user => ({ userId: user.userId, username: user.username }));
}

export async function getGameHistory(userId: string): Promise<GameHistoryEntry[]> {
    const history = await db.select().from(GameHistory).where(eq(GameHistory.userId, userId)).execute();
    return history.map(entry => ({ game: entry.game, result: entry.result }));
}