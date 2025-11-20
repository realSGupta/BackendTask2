const http = require('http');

// Test function to submit an order
function submitOrder(order) {
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

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    resolve(JSON.parse(body));
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

// Test the server
async function runTests() {
    console.log('🧪 Testing Order Execution Engine Demo Server');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const testOrders = [
        {
            tokenIn: 'SOL',
            tokenOut: 'USDC',
            amount: 1.5,
            side: 'BUY'
        },
        {
            tokenIn: 'USDC',
            tokenOut: 'SOL',
            amount: 150,
            side: 'SELL'
        },
        {
            tokenIn: 'SOL',
            tokenOut: 'BONK',
            amount: 0.5,
            side: 'BUY'
        }
    ];

    console.log(`📝 Submitting ${testOrders.length} test orders...\n`);

    for (let i = 0; i < testOrders.length; i++) {
        const order = testOrders[i];
        try {
            console.log(`\n[Order ${i + 1}/${testOrders.length}] Submitting:`);
            console.log(`   ${order.side} ${order.amount} ${order.tokenIn} → ${order.tokenOut}`);

            const response = await submitOrder(order);

            console.log(`✅ Response:`, response);

            // Wait a bit before next order
            if (i < testOrders.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.error(`❌ Error:`, error.message);
        }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Tests completed!');
    console.log('\n💡 Check the server console for detailed routing logs');
    console.log(`🌐 Or visit: http://localhost:3000\n`);
}

// Run tests
runTests().catch(console.error);
