import { Module } from '@nestjs/common';
import { SocketsGateway } from './sockets.gateway';
import { DatabaseModule } from 'src/database/database.module';
// import { MessagesService } from 'src/database/messages/messages.service';

@Module({
    providers: [SocketsGateway],
    imports: [DatabaseModule],
})
export class SocketsModule {}
