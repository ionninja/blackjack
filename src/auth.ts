import bcrypt from 'bcrypt';
import { db } from './db';
import { User } from './models';
import { eq } from 'drizzle-orm';

interface User {
    userId: string;
    username: string;
    password: string;
}

export async function registerStaff(username: string, password: string): Promise<User> {
    const existingUser = await db.select().from(User).where(eq(User.username, username)).execute();
    if (existingUser.length > 0) {
        throw new Error('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.insert(User).values({ username, password: hashedPassword }).returning().execute();
    return { userId: user[0].userId, username: user[0].username, password: user[0].password };
}

export async function authenticateStaff(token: string): Promise<boolean> {
    const user = await db.select().from(User).where(eq(User.username, token)).execute();
    return user.length > 0;
}