import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { env } from './env';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
    console.log('Env', env);

    const app = await NestFactory.create(AppModule);

    app.useWebSocketAdapter(new WsAdapter(app));

    await app.listen(env.PORT);
}
bootstrap();
