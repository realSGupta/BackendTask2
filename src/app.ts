import fastify from 'fastify';
import websocket from '@fastify/websocket';
import { config } from './config';
import { orderRoutes } from './api/orders';

const app = fastify({ logger: true });

app.register(websocket);
app.register(orderRoutes, { prefix: '/api/orders' });

const start = async () => {
    try {
        await app.listen({ port: config.port as number, host: '0.0.0.0' });
        console.log(`Server running on port ${config.port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
