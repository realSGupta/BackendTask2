import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db';
import { orderQueue } from '../services/OrderQueue';
import { webSocketService } from '../services/WebSocketService';

const orderSchema = z.object({
    tokenIn: z.string(),
    tokenOut: z.string(),
    amount: z.number().positive(),
    side: z.enum(['BUY', 'SELL']),
});

export async function orderRoutes(fastify: FastifyInstance) {
    fastify.post('/execute', async (req, reply) => {
        try {
            const body = orderSchema.parse(req.body);

            const order = await prisma.order.create({
                data: {
                    type: 'MARKET',
                    side: body.side,
                    tokenIn: body.tokenIn,
                    tokenOut: body.tokenOut,
                    amount: body.amount,
                    status: 'PENDING',
                },
            });

            await orderQueue.add('execute-order', {
                orderId: order.id,
                ...body
            }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                }
            });

            return reply.send({ orderId: order.id, status: 'queued' });
        } catch (error: any) {
            return reply.status(400).send({ error: error.message });
        }
    });

    fastify.get('/ws', { websocket: true }, (connection, req) => {
        webSocketService.handleConnection(connection, req);
    });
}
