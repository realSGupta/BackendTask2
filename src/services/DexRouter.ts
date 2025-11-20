import { Order } from '@prisma/client';

interface Quote {
    dex: 'Raydium' | 'Meteora';
    price: number;
    fee: number;
    estimatedOutput: number;
}

export class MockDexRouter {
    private basePrice = 100; // Mock base price for SOL/USDC

    private async sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async getRaydiumQuote(tokenIn: string, tokenOut: string, amount: number): Promise<Quote> {
        await this.sleep(200 + Math.random() * 300); // 200-500ms delay
        const variance = 0.98 + Math.random() * 0.04; // +/- 2%
        const price = this.basePrice * variance;
        const estimatedOutput = amount * price; // Simplified mock logic

        return {
            dex: 'Raydium',
            price,
            fee: 0.003,
            estimatedOutput
        };
    }

    async getMeteoraQuote(tokenIn: string, tokenOut: string, amount: number): Promise<Quote> {
        await this.sleep(200 + Math.random() * 300);
        const variance = 0.97 + Math.random() * 0.05; // +/- 2.5%
        const price = this.basePrice * variance;
        const estimatedOutput = amount * price;

        return {
            dex: 'Meteora',
            price,
            fee: 0.002,
            estimatedOutput
        };
    }

    async getBestQuote(tokenIn: string, tokenOut: string, amount: number): Promise<Quote> {
        const [raydium, meteora] = await Promise.all([
            this.getRaydiumQuote(tokenIn, tokenOut, amount),
            this.getMeteoraQuote(tokenIn, tokenOut, amount),
        ]);

        // Always choose the route that gives more output tokens
        return raydium.estimatedOutput > meteora.estimatedOutput ? raydium : meteora;
    }

    async executeSwap(dex: string, orderId: string): Promise<{ txHash: string; executedPrice: number }> {
        await this.sleep(2000 + Math.random() * 1000); // 2-3s delay
        return {
            txHash: 'tx_' + Math.random().toString(36).substring(7),
            executedPrice: this.basePrice, // Simplified
        };
    }
}
