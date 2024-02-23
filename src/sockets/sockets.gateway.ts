import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
} from '@nestjs/websockets';
import { MessagesService } from 'src/database/messages/messages.service';
import { WebSocket, WebSocketServer } from 'ws';

@WebSocketGateway({ path: '/connect' })
export class SocketsGateway implements OnGatewayConnection, OnGatewayInit {
    server!: WebSocketServer;

    constructor(private messages: MessagesService) {}

    afterInit(server: WebSocketServer) {
        this.server = server;
    }

    handleConnection(client: WebSocket) {
        client.onmessage = (message) => {
            Promise.resolve(Date.now()).then((timestamp) => {
                if (!(message.data instanceof Buffer)) return;

                this.messages.addMessage(message.data, timestamp);
            });

            this.server.clients.forEach((current) => {
                if (current === client) return;

                current.send(message.data);
            });
        };
    }
}
