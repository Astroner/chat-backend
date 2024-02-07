import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketsModule } from './sockets/sockets.module';
import { DatabaseModule } from './database/database.module';

@Module({
    controllers: [AppController],
    providers: [AppService],
    imports: [SocketsModule, DatabaseModule],
})
export class AppModule {}
