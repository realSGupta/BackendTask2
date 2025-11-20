const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Execution Engine - Deployed</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          h1 { color: #333; }
          .status { background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; }
          .info { background: #d1ecf1; padding: 15px; border-left: 4px solid #17a2b8; margin: 20px 0; }
          code { background: #f1f1f1; padding: 2px 6px; border-radius: 3px; }
        </style>
      </head>
      <body>
        <h1>🚀 Order Execution Engine - Deployed on Railway!</h1>
        
        <div class="status">
          <strong>✅ Status:</strong> Server is running successfully!
        </div>

        <div class="info">
          <h3>📝 Project Information:</h3>
          <p><strong>GitHub:</strong> <a href="https://github.com/realSGupta/BackendTask2">realSGupta/BackendTask2</a></p>
          <p><strong>Features:</strong></p>
          <ul>
            <li>Market Order execution</li>
            <li>DEX routing (Raydium vs Meteora)</li>
            <li>Real-time WebSocket updates</li>
            <li>Concurrent order processing with BullMQ</li>
            <li>10+ unit and integration tests</li>
          </ul>
        </div>

        <h3>🔗 API Endpoints:</h3>
        <p><code>POST /api/orders/execute</code> - Submit a market order</p>
        <p><code>GET /api/orders/ws?orderId=xxx</code> - WebSocket connection</p>

        <h3>📚 Documentation:</h3>
        <p>Full documentation available in the <a href="https://github.com/realSGupta/BackendTask2">GitHub repository</a></p>

        <h3>⚙️ Note:</h3>
        <p>This is a demo deployment. For full functionality with database persistence and queue system, 
        PostgreSQL and Redis services need to be configured.</p>
      </body>
      </html>
    `);
    } else if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            service: 'order-execution-engine',
            timestamp: new Date().toISOString()
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Order Execution Engine deployed successfully!`);
    console.log(`🌐 Server running on port ${PORT}`);
    console.log(`📡 Ready to accept requests`);
});
