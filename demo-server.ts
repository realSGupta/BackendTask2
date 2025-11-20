// Simple standalone test script to run the server without full dependencies
import * as http from 'http';

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/api/orders/execute') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const order = JSON.parse(body);
                const orderId = 'order_' + Math.random().toString(36).substring(7);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    orderId,
                    status: 'queued',
                    message: 'Order received. Note: This is a minimal demo without full dependencies installed.'
                }));

                console.log(`✅ Order ${orderId} received:`, order);
                simulateOrderProcessing(orderId);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    } else if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
      <h1>Order Execution Engine - Demo Server</h1>
      <p>Server is running! API endpoints:</p>
      <ul>
        <li>POST /api/orders/execute - Submit order</li>
      </ul>
      <p><strong>Note:</strong> Full features require dependencies. This is a minimal demo.</p>
      <form id="orderForm">
        <h3>Submit Test Order</h3>
        <label>Token In: <input name="tokenIn" value="SOL" /></label><br/>
        <label>Token Out: <input name="tokenOut" value="USDC" /></label><br/>
        <label>Amount: <input name="amount" type="number" value="1.5" /></label><br/>
        <label>Side: <select name="side"><option>BUY</option><option>SELL</option></select></label><br/>
        <button type="submit">Submit Order</button>
      </form>
      <div id="result"></div>
      <script>
        document.getElementById('orderForm').onsubmit = async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const order = {
            tokenIn: formData.get('tokenIn'),
            tokenOut: formData.get('tokenOut'),
            amount: parseFloat(formData.get('amount')),
            side: formData.get('side')
          };
          const res = await fetch('/api/orders/execute', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(order)
          });
          const data = await res.json();
          document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        };
      </script>
    `);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

function simulateOrderProcessing(orderId: string) {
    console.log(`🔄 [${orderId}] Status: ROUTING`);
    setTimeout(() => {
        const raydiumPrice = 100 * (0.98 + Math.random() * 0.04);
        const meteoraPrice = 100 * (0.97 + Math.random() * 0.05);
        const bestDex = raydiumPrice < meteoraPrice ? 'Raydium' : 'Meteora';
        const bestPrice = Math.min(raydiumPrice, meteoraPrice);

        console.log(`📊 [${orderId}] Raydium: $${raydiumPrice.toFixed(2)}, Meteora: $${meteoraPrice.toFixed(2)}`);
        console.log(`✅ [${orderId}] Selected: ${bestDex} @ $${bestPrice.toFixed(2)}`);
        console.log(`🔨 [${orderId}] Status: BUILDING`);
        console.log(`📤 [${orderId}] Status: SUBMITTED`);

        setTimeout(() => {
            const txHash = 'tx_' + Math.random().toString(36).substring(7);
            console.log(`✅ [${orderId}] Status: CONFIRMED - TX: ${txHash}`);
        }, 2500);
    }, 500);
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log('🚀 Order Execution Engine Demo Server');
    console.log(`📡 Server running at http://localhost:${PORT}`);
    console.log('');
    console.log('⚠️  NOTE: This is a minimal demo server without full dependencies.');
    console.log('   For full functionality, complete the dependency installation.');
    console.log('');
    console.log('📝 Test the API:');
    console.log(`   curl -X POST http://localhost:${PORT}/api/orders/execute \\`);
    console.log(`     -H "Content-Type: application/json" \\`);
    console.log(`     -d '{"tokenIn":"SOL","tokenOut":"USDC","amount":1.5,"side":"BUY"}'`);
    console.log('');
    console.log(`🌐 Or visit: http://localhost:${PORT}`);
});
