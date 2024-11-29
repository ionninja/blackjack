import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const sql = postgres(process.env.DATABASE_URL);

sql`SELECT NOW()`.then(res => {
    console.log('Database connected:', res);
}).catch(err => {
    console.error('Error connecting to the database:', err);
});