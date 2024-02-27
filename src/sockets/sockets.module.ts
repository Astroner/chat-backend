import { Module } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { DatabaseModule } from 'src/database/database.module';
import { WebPushModule } from 'src/web-push/web-push.module';
import { env } from 'src/env';
// import { MessagesService } from 'src/database/messages/messages.service';

@Module({
    providers: [SocketsGateway],
    imports: [
        DatabaseModule,
        WebPushModule.forVAPID({
            publicKey: env.VAPID.PUBLIC,
            privateKey: env.VAPID.PRIVATE,
            subject: env.VAPID.SUBJECT,
        }),
    ],
})
export class SocketsModule {}
