import dotenv from 'dotenv';
dotenv.config();

export default {
    schema: './src/models.js',
    out: './migrations',
    dialect: 'postgresql',
    driver: 'postgres',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
};