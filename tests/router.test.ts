import { MockDexRouter } from '../src/services/DexRouter';

describe('MockDexRouter', () => {
    let router: MockDexRouter;

    beforeEach(() => {
        router = new MockDexRouter();
    });

    it('should return a quote from Raydium', async () => {
        const quote = await router.getRaydiumQuote('SOL', 'USDC', 1);
        expect(quote.dex).toBe('Raydium');
        expect(quote.price).toBeGreaterThan(0);
    });

    it('should return a quote from Meteora', async () => {
        const quote = await router.getMeteoraQuote('SOL', 'USDC', 1);
        expect(quote.dex).toBe('Meteora');
        expect(quote.price).toBeGreaterThan(0);
    });

    it('should select the best quote', async () => {
        const quote = await router.getBestQuote('SOL', 'USDC', 1);
        expect(['Raydium', 'Meteora']).toContain(quote.dex);
    });
});
