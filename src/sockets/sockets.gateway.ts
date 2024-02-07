import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
} from '@nestjs/websockets';
import { WebSocket, WebSocketServer } from 'ws';

@WebSocketGateway({ path: '/connect' })
export class SocketsGateway implements OnGatewayConnection, OnGatewayInit {
    server!: WebSocketServer;

    afterInit(server: WebSocketServer) {
        this.server = server;
    }

    handleConnection(client: WebSocket) {
        client.onmessage = (message) => {
            this.server.clients.forEach((current) => {
                if (current === client) return;

                current.send(message.data);
            });
        };
    }
}
