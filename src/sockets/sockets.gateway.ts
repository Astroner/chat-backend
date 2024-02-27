import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocket, WebSocketServer } from 'ws';

import { MessagesService } from 'src/database/messages/messages.service';
import { WebPushService } from 'src/web-push/web-push.service';

@WebSocketGateway({ path: '/connect' })
export class SocketsGateway implements OnGatewayConnection, OnGatewayInit {
    server!: WebSocketServer;

    constructor(
        private messages: MessagesService,
        private push: WebPushService
    ) {}

    afterInit(server: WebSocketServer) {
        this.server = server;
    }

    handleConnection(client: WebSocket) {
        client.onmessage = (message) => {
            Promise.resolve(Date.now()).then((timestamp) => {
                if (!(message.data instanceof Buffer)) return;

                this.messages.addMessage(message.data, timestamp);
                this.push.broadcast(message.data);
            });

            this.server.clients.forEach((current) => {
                if (current === client) return;

                current.send(message.data);
            });
        };
    }
}
