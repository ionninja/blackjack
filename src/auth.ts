import bcrypt from 'bcrypt';
import { db } from './db';
import { User } from './models';
import { eq } from 'drizzle-orm';
import { supabase } from './supabaseClient';

interface User {
    userId: string;
    username: string;
    password: string;
}

export async function registerStaff(username: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
        email: username,
        password: password,
    });

    if (error) {
        throw new Error(error.message);
    }

    const user = data.user;
    if (!user) {
        throw new Error('User registration failed');
    }

    return { userId: user.id, username: user.email!, password: password };
}

export async function authenticateStaff(token: string): Promise<boolean> {
    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
        throw new Error(error.message);
    }

    return !!data.user;
}