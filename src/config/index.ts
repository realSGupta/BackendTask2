import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    db: {
        url: process.env.DATABASE_URL,
    },
    liteMode: true, // Force lite mode for deployment without DBs
};
