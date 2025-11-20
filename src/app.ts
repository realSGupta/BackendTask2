import fastify from 'fastify';
import websocket from '@fastify/websocket';
import { config } from './config';
import { orderRoutes } from './api/orders';

const app = fastify({ logger: true });

app.register(websocket);

// Initialize services based on mode
let orderQueue: any;

if (config.liteMode) {
    const { OrderQueue } = require('./services/OrderQueueLite');
    orderQueue = new OrderQueue();
    console.log('⚠️ Running in LITE MODE (No Redis/DB required)');
} else {
    const { OrderQueue } = require('./services/OrderQueue');
    orderQueue = new OrderQueue();
    console.log('✅ Running in FULL MODE (Redis/DB connected)');
}

// Register routes
app.register(orderRoutes, { prefix: '/api/orders', orderQueue });

const start = async () => {
    try {
        await app.listen({ port: config.port as number, host: '0.0.0.0' });
        console.log(`🚀 Server running on port ${config.port}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
