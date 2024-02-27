import { config } from 'dotenv';

const createEnv = () => {
    config();

    return {
        PORT: process.env.PORT ?? 4040,
        MONGO_ADDRESS: process.env.MONGO_ADDRESS ?? 'error',
        NODE_ENV:
            process.env.NODE_ENV === 'production'
                ? 'production'
                : 'development',
        VAPID: {
            PUBLIC: process.env.VAPID_PUBLIC ?? '',
            PRIVATE: process.env.VAPID_PRIVATE ?? '',
            SUBJECT: process.env.VAPID_SUBJECT ?? 'mailto:example@qq.com',
        },
    };
};

export const env = createEnv();
