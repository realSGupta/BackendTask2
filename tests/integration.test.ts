import Fastify, { FastifyInstance } from 'fastify';
import websocket from '@fastify/websocket';
import { orderRoutes } from '../src/api/orders';
import { prisma } from '../src/db';
import { orderQueue } from '../src/services/OrderQueue';

describe('Order Integration', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = Fastify();
        app.register(websocket);
        app.register(orderRoutes);
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
        await prisma.$disconnect();
        await orderQueue.close();
    });

    it('should create and queue an order', async () => {
        const response = await app.inject({
            method: 'POST',
            url: '/execute',
            payload: {
                tokenIn: 'SOL',
                tokenOut: 'USDC',
                amount: 1.0,
                side: 'BUY'
            }
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('orderId');
        expect(body.status).toBe('queued');

        // Verify DB
        const order = await prisma.order.findUnique({
            where: { id: body.orderId }
        });
        expect(order).toBeDefined();
        expect(order?.status).toBe('PENDING');
    });
});
