import { config } from 'dotenv';

const createEnv = () => {
    config();

    return {
        PORT: process.env.PORT ?? 4040,
        MONGO_ADDRESS: process.env.MONGO_ADDRESS ?? 'error',
    };
};

export const env = createEnv();
