import { config } from 'dotenv';

const createEnv = () => {
    config();

    return {
        PORT: process.env.PORT ?? 4040,
        MONGO_ADDRESS: process.env.MONGO_ADDRESS ?? 'error',
        NODE_ENV: process.env.NODE_ENV === "production" ? "production" : "development"
    };
};

export const env = createEnv();
