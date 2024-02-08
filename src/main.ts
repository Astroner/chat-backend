import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { env } from './env';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
    if (env.NODE_ENV !== 'production') console.log('Env', env);

    const app = await NestFactory.create(AppModule);

    app.useWebSocketAdapter(new WsAdapter(app));
    app.enableCors();

    await app.listen(env.PORT);
}
bootstrap();
