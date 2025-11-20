import { config } from '../config';
import { DexRouter } from './DexRouter';
import { WebSocketService } from './WebSocketService';

interface Job {
    id: string;
    data: any;
}

export class OrderQueue {
    private queue: Job[] = [];
    private processing = false;
    private dexRouter: DexRouter;
    private wsService: WebSocketService;

    constructor() {
        this.dexRouter = new DexRouter();
        this.wsService = WebSocketService.getInstance();
        console.log('🚀 OrderQueue initialized in LITE MODE (In-Memory)');

        // Start processing loop
        setInterval(() => this.processQueue(), 1000);
    }

    async addOrder(orderData: any) {
        const job = {
            id: Math.random().toString(36).substring(7),
            data: orderData
        };

        this.queue.push(job);
        console.log(`📥 Order added to local queue: ${job.id}`);

        // Notify via WebSocket
        this.wsService.broadcast(job.data.userId, {
            type: 'ORDER_QUEUED',
            orderId: job.id,
            status: 'QUEUED',
            timestamp: new Date().toISOString()
        });

        return { id: job.id, ...orderData };
    }

    private async processQueue() {
        if (this.processing || this.queue.length === 0) return;

        this.processing = true;
        const job = this.queue.shift();

        if (job) {
            try {
                console.log(`⚙️ Processing order: ${job.id}`);

                // 1. Routing
                this.wsService.broadcast(job.data.userId, {
                    type: 'ORDER_ROUTING',
                    orderId: job.id,
                    status: 'ROUTING',
                    timestamp: new Date().toISOString()
                });

                const route = await this.dexRouter.findBestRoute(
                    job.data.inputToken,
                    job.data.outputToken,
                    job.data.amount
                );

                // 2. Execution
                this.wsService.broadcast(job.data.userId, {
                    type: 'ORDER_EXECUTING',
                    orderId: job.id,
                    status: 'EXECUTING',
                    route: route,
                    timestamp: new Date().toISOString()
                });

                const result = await this.dexRouter.executeSwap(route);

                // 3. Completion
                this.wsService.broadcast(job.data.userId, {
                    type: 'ORDER_COMPLETED',
                    orderId: job.id,
                    status: 'COMPLETED',
                    result: result,
                    timestamp: new Date().toISOString()
                });

                console.log(`✅ Order ${job.id} completed`);

            } catch (error) {
                console.error(`❌ Order ${job.id} failed:`, error);
                this.wsService.broadcast(job.data.userId, {
                    type: 'ORDER_FAILED',
                    orderId: job.id,
                    status: 'FAILED',
                    error: error instanceof Error ? error.message : 'Unknown error',
                    timestamp: new Date().toISOString()
                });
            }
        }

        this.processing = false;
    }
}
