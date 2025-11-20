const http = require('http');

// Function to submit a single order
function submitOrder(order, orderNum) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(order);

        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/orders/execute',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        console.log(`\n🚀 [Order ${orderNum}] Submitting: ${order.side} ${order.amount} ${order.tokenIn} → ${order.tokenOut}`);

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const response = JSON.parse(body);
                    console.log(`✅ [Order ${orderNum}] Queued: ${response.orderId}`);
                    resolve(response);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${body}`));
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

// Main function to submit 5 concurrent orders
async function submitConcurrentOrders() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🎬 DEMO: Submitting 5 Concurrent Orders');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log('⏱️  Timestamp:', new Date().toISOString());
    console.log('🎯 Testing concurrent order processing...\n');

    const orders = [
        { tokenIn: 'SOL', tokenOut: 'USDC', amount: 1.5, side: 'BUY' },
        { tokenIn: 'USDC', tokenOut: 'SOL', amount: 150, side: 'SELL' },
        { tokenIn: 'SOL', tokenOut: 'BONK', amount: 0.5, side: 'BUY' },
        { tokenIn: 'SOL', tokenOut: 'USDC', amount: 2.0, side: 'BUY' },
        { tokenIn: 'USDC', tokenOut: 'SOL', amount: 200, side: 'SELL' }
    ];

    try {
        // Submit all orders concurrently
        const startTime = Date.now();
        const promises = orders.map((order, index) => submitOrder(order, index + 1));
        const results = await Promise.all(promises);
        const endTime = Date.now();

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('📊 SUMMARY');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`✅ Successfully submitted: ${results.length} orders`);
        console.log(`⏱️  Total time: ${endTime - startTime}ms`);
        console.log(`📋 Order IDs:`);
        results.forEach((result, index) => {
            console.log(`   ${index + 1}. ${result.orderId}`);
        });
        console.log('\n💡 Check the server console for routing decisions and status updates!');
        console.log('═══════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.log('\n⚠️  Make sure the server is running: node demo-server.js\n');
    }
}

// Run the demo
console.log('\n🎥 Starting Demo in 2 seconds...\n');
setTimeout(submitConcurrentOrders, 2000);
