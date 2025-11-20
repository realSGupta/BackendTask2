const http = require('http');

const PORT = process.env.PORT || 3000;

// In-memory storage for orders
const orders = [];
let orderIdCounter = 1;

// Simulated DEX Router
class DexRouter {
  async findBestRoute(inputToken, outputToken, amount) {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));

    const raydiumPrice = 1 + (Math.random() * 0.02 - 0.01);
    const meteoraPrice = 1 + (Math.random() * 0.02 - 0.01);

    const raydiumOutput = amount * raydiumPrice;
    const meteoraOutput = amount * meteoraPrice;

    return raydiumOutput > meteoraOutput
      ? { dex: 'Raydium', estimatedOutput: raydiumOutput, price: raydiumPrice }
      : { dex: 'Meteora', estimatedOutput: meteoraOutput, price: meteoraPrice };
  }

  async executeSwap(route) {
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    return {
      txHash: '0x' + Math.random().toString(36).substring(2, 15),
      actualOutput: route.estimatedOutput * (0.98 + Math.random() * 0.04),
      timestamp: new Date().toISOString()
    };
  }
}

const dexRouter = new DexRouter();

// Process orders
async function processOrder(order) {
  try {
    order.status = 'routing';
    const route = await dexRouter.findBestRoute(
      order.inputToken,
      order.outputToken,
      order.amount
    );

    order.route = route;
    order.status = 'executing';

    const result = await dexRouter.executeSwap(route);

    order.status = 'completed';
    order.result = result;
    console.log(`✅ Order ${order.id} completed via ${route.dex}`);
  } catch (error) {
    order.status = 'failed';
    order.error = error.message;
    console.error(`❌ Order ${order.id} failed:`, error.message);
  }
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route: GET /
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Execution Engine - Live Demo</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
          .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
          .status { background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; border-radius: 4px; }
          .info { background: #d1ecf1; padding: 15px; border-left: 4px solid #17a2b8; margin: 20px 0; border-radius: 4px; }
          .demo { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 4px; }
          code { background: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; }
          .btn { background: #3498db; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px 5px; }
          .btn:hover { background: #2980b9; }
          #result { margin-top: 20px; padding: 15px; background: #ecf0f1; border-radius: 5px; white-space: pre-wrap; font-family: monospace; max-height: 400px; overflow-y: auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 Order Execution Engine - LIVE</h1>
          
          <div class="status">
            <strong>✅ Status:</strong> Server is running - Ready to process orders!
          </div>

          <div class="demo">
            <h3>🎯 Try It Live!</h3>
            <p>Click below to submit a test order and see the DEX routing in action:</p>
            <button class="btn" onclick="submitOrder()">Submit Test Order</button>
            <button class="btn" onclick="submitMultiple()">Submit 5 Orders</button>
            <button class="btn" onclick="getOrders()">View All Orders</button>
            <div id="result"></div>
          </div>

          <div class="info">
            <h3>📝 API Endpoints:</h3>
            <p><code>POST /api/orders/execute</code> - Submit a market order</p>
            <p><code>GET /api/orders</code> - Get all orders</p>
            <p><code>GET /health</code> - Health check</p>
            
            <h3>✨ Features:</h3>
            <ul>
              <li>Market Order execution with instant routing</li>
              <li>DEX comparison (Raydium vs Meteora)</li>
              <li>Real-time order processing</li>
              <li>In-memory queue system</li>
            </ul>

            <h3>📚 GitHub:</h3>
            <p><a href="https://github.com/realSGupta/BackendTask2" target="_blank">View Source Code</a></p>
          </div>
        </div>

        <script>
          function submitOrder() {
            const resultDiv = document.getElementById('result');
            resultDiv.textContent = '⏳ Submitting order...';
            
            fetch('/api/orders/execute', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: 'user_' + Math.random().toString(36).substr(2, 9),
                inputToken: 'SOL',
                outputToken: 'USDC',
                amount: 10 + Math.random() * 90
              })
            })
            .then(r => r.json())
            .then(data => {
              resultDiv.textContent = '✅ Order Submitted!\\n\\n' + JSON.stringify(data, null, 2);
              setTimeout(checkOrder, 3000, data.id);
            })
            .catch(e => resultDiv.textContent = '❌ Error: ' + e.message);
          }

          function submitMultiple() {
            const resultDiv = document.getElementById('result');
            resultDiv.textContent = '⏳ Submitting 5 orders...\\n';
            
            for (let i = 0; i < 5; i++) {
              setTimeout(() => submitOrder(), i * 500);
            }
          }

          function checkOrder(orderId) {
            fetch('/api/orders/' + orderId)
              .then(r => r.json())
              .then(data => {
                const resultDiv = document.getElementById('result');
                resultDiv.textContent = '📊 Order Status:\\n\\n' + JSON.stringify(data, null, 2);
              });
          }

          function getOrders() {
            const resultDiv = document.getElementById('result');
            resultDiv.textContent = '⏳ Loading orders...';
            
            fetch('/api/orders')
              .then(r => r.json())
              .then(data => {
                resultDiv.textContent = '📋 All Orders (' + data.length + '):\\n\\n' + JSON.stringify(data, null, 2);
              })
              .catch(e => resultDiv.textContent = '❌ Error: ' + e.message);
          }
        </script>
      </body>
      </html>
    `);
    return;
  }

  // Route: POST /api/orders/execute
  if (req.method === 'POST' && req.url === '/api/orders/execute') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const order = {
          id: orderIdCounter++,
          ...data,
          status: 'queued',
          createdAt: new Date().toISOString()
        };

        orders.push(order);
        console.log(`📥 Order ${order.id} queued`);

        // Process order asynchronously
        processOrder(order);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(order));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // Route: GET /api/orders
  if (req.method === 'GET' && req.url === '/api/orders') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(orders));
    return;
  }

  // Route: GET /api/orders/:id
  if (req.method === 'GET' && req.url.startsWith('/api/orders/')) {
    const id = parseInt(req.url.split('/')[3]);
    const order = orders.find(o => o.id === id);

    if (order) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(order));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Order not found' }));
    }
    return;
  }

  // Route: GET /health
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'order-execution-engine',
      orders: orders.length,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Order Execution Engine deployed successfully!`);
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`📡 Ready to process orders`);
});
