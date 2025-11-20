const http = require('http');

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
                    message: 'Order received. Simulating DEX routing...'
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
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Execution Engine - Demo</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          h1 { color: #333; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          form { background: #f8f9fa; padding: 20px; border-radius: 8px; }
          label { display: block; margin: 10px 0 5px; }
          input, select { width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 4px; }
          button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
          button:hover { background: #0056b3; }
          #result { background: #e9ecef; padding: 15px; border-radius: 4px; margin-top: 20px; }
          pre { background: #fff; padding: 10px; border-radius: 4px; overflow-x: auto; }
          .endpoint { background: #e7f3ff; padding: 10px; border-radius: 4px; margin: 10px 0; }
          code { background: #f1f1f1; padding: 2px 6px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>🚀 Order Execution Engine - Demo Server</h1>
        
        <div class="warning">
          <strong>⚠️ Demo Mode:</strong> This is a simplified demo server running without full dependencies. 
          It simulates the order flow to demonstrate the architecture. For full functionality with WebSockets, 
          BullMQ, and database persistence, complete the dependency installation.
        </div>

        <h2>API Endpoints</h2>
        <div class="endpoint">
          <strong>POST</strong> <code>/api/orders/execute</code> - Submit a market order
        </div>

        <h2>Submit Test Order</h2>
        <form id="orderForm">
          <label>Token In:</label>
          <input name="tokenIn" value="SOL" required />
          
          <label>Token Out:</label>
          <input name="tokenOut" value="USDC" required />
          
          <label>Amount:</label>
          <input name="amount" type="number" step="0.01" value="1.5" required />
          
          <label>Side:</label>
          <select name="side">
            <option>BUY</option>
            <option>SELL</option>
          </select>
          
          <button type="submit">🚀 Execute Order</button>
        </form>

        <div id="result" style="display:none;">
          <h3>Response:</h3>
          <pre id="responseData"></pre>
        </div>

        <h2>cURL Example</h2>
        <pre>curl -X POST http://localhost:3000/api/orders/execute \\
  -H "Content-Type: application/json" \\
  -d '{"tokenIn":"SOL","tokenOut":"USDC","amount":1.5,"side":"BUY"}'</pre>

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
            
            try {
              const res = await fetch('/api/orders/execute', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(order)
              });
              const data = await res.json();
              
              document.getElementById('result').style.display = 'block';
              document.getElementById('responseData').textContent = JSON.stringify(data, null, 2);
              
              console.log('Order submitted:', data);
            } catch (error) {
              alert('Error: ' + error.message);
            }
          };
        </script>
      </body>
      </html>
    `);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

function simulateOrderProcessing(orderId) {
    setTimeout(() => {
        console.log(`🔄 [${orderId}] Status: ROUTING - Querying DEXs...`);

        const raydiumPrice = 100 * (0.98 + Math.random() * 0.04);
        const meteoraPrice = 100 * (0.97 + Math.random() * 0.05);
        const bestDex = raydiumPrice < meteoraPrice ? 'Raydium' : 'Meteora';
        const bestPrice = Math.min(raydiumPrice, meteoraPrice);

        console.log(`📊 [${orderId}] Price Comparison:`);
        console.log(`   - Raydium: $${raydiumPrice.toFixed(2)}`);
        console.log(`   - Meteora: $${meteoraPrice.toFixed(2)}`);
        console.log(`✅ [${orderId}] Best Route: ${bestDex} @ $${bestPrice.toFixed(2)}`);

        setTimeout(() => {
            console.log(`🔨 [${orderId}] Status: BUILDING transaction...`);
            console.log(`📤 [${orderId}] Status: SUBMITTED to blockchain`);

            setTimeout(() => {
                const txHash = 'tx_' + Math.random().toString(36).substring(7);
                console.log(`✅ [${orderId}] Status: CONFIRMED`);
                console.log(`   Transaction Hash: ${txHash}`);
                console.log(`   Executed Price: $${bestPrice.toFixed(2)}`);
                console.log('');
            }, 2500);
        }, 500);
    }, 300);
}

const PORT = 3000;
server.listen(PORT, () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🚀 Order Execution Engine - Demo Server Started');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log(`📡 Server running at: http://localhost:${PORT}`);
    console.log('');
    console.log('⚠️  NOTE: This is a DEMO without full dependencies');
    console.log('   - No WebSocket support');
    console.log('   - No database persistence');
    console.log('   - No queue system');
    console.log('   - Simulated DEX routing only');
    console.log('');
    console.log('📝 Quick Test:');
    console.log(`   Open browser: http://localhost:${PORT}`);
    console.log('   Or use curl:');
    console.log(`   curl -X POST http://localhost:${PORT}/api/orders/execute \\`);
    console.log(`     -H "Content-Type: application/json" \\`);
    console.log(`     -d '{"tokenIn":"SOL","tokenOut":"USDC","amount":1.5,"side":"BUY"}'`);
    console.log('');
    console.log('👀 Watch this console for order processing logs');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
});
