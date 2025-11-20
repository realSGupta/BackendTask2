import { Queue, Worker } from 'bullmq';
import { config } from '../config';
import { prisma } from '../db';
import { MockDexRouter } from './DexRouter';
import { webSocketService } from './WebSocketService';

const connection = config.redis;

export const orderQueue = new Queue('order-queue', { connection });

const dexRouter = new MockDexRouter();

const worker = new Worker('order-queue', async (job) => {
    const { orderId, tokenIn, tokenOut, amount } = job.data;

    try {
        // 1. Routing
        await updateStatus(orderId, 'routing');
        const quote = await dexRouter.getBestQuote(tokenIn, tokenOut, amount);
        console.log(`[Order ${orderId}] Selected route: ${quote.dex} @ ${quote.price}`);

        // 2. Building
        await updateStatus(orderId, 'building', { quote });

        // 3. Submitted
        await updateStatus(orderId, 'submitted');

        // 4. Execution
        const result = await dexRouter.executeSwap(quote.dex, orderId);

        // 5. Confirmed
        await updateStatus(orderId, 'confirmed', {
            txHash: result.txHash,
            executedPrice: result.executedPrice
        });

        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'CONFIRMED',
                txHash: result.txHash
            }
        });

    } catch (error: any) {
        console.error(`[Order ${orderId}] Failed:`, error);
        await updateStatus(orderId, 'failed', { error: error.message });

        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: 'FAILED',
                error: error.message
            }
        });
        throw error;
    }
}, {
    connection,
    concurrency: 10, // Process 10 concurrent orders
    limiter: {
        max: 100,
        duration: 60000 // 100 orders per minute
    }
});

async function updateStatus(orderId: string, status: string, data?: any) {
    webSocketService.sendUpdate(orderId, status, data);
    // We could also update DB here for intermediate states if needed
}
