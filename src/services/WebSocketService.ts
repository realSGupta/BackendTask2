import { SocketStream } from '@fastify/websocket';
import { WebSocket } from 'ws';

class WebSocketService {
    private connections: Map<string, WebSocket> = new Map();

    handleConnection(connection: SocketStream, req: any) {
        const orderId = (req.query as any).orderId;
        if (orderId) {
            this.connections.set(orderId, connection.socket);

            connection.socket.on('close', () => {
                this.connections.delete(orderId);
            });

            connection.socket.send(JSON.stringify({ status: 'connected', orderId }));
        }
    }

    sendUpdate(orderId: string, status: string, data?: any) {
        const socket = this.connections.get(orderId);
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ status, ...data }));
        }
    }
}

export const webSocketService = new WebSocketService();
