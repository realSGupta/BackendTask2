# Solana DEX Order Execution Engine

## Overview
This project implements a backend order execution engine for Solana DEXs. It supports **Market Orders** with intelligent routing between Raydium and Meteora. It features a real-time WebSocket status update system and a robust queue-based architecture for handling concurrent orders.

## Design Decisions

### Order Type: Market Order
I chose **Market Order** as the primary implementation because it demonstrates the core routing logic most effectively. The goal is to find the best immediate price across multiple DEXs.
- **Extensibility**: To support **Limit Orders**, we would add a `limitPrice` field to the order. The worker would then check if the current best quote meets the limit price. If not, it would re-queue the job with a delay (or use a separate "monitoring" queue) until the price is matched. **Sniper Orders** would work similarly but trigger based on on-chain events (like liquidity addition).

### Architecture
- **Fastify**: High-performance Node.js framework with low overhead.
- **BullMQ (Redis)**: Robust queue system for managing order processing, retries, and concurrency.
- **Prisma (PostgreSQL)**: Type-safe ORM for persisting order history.
- **WebSocket**: For real-time client updates without polling.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Redis (running on default port 6379)
- PostgreSQL (running on default port 5432)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=3000
   REDIS_HOST=localhost
   REDIS_PORT=6379
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/order_engine?schema=public"
   ```
4. Generate Prisma client and push schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Running the Server
```bash
npm run dev
```

## API Documentation

### Submit Order
`POST /api/orders/execute`

**Body:**
```json
{
  "tokenIn": "SOL",
  "tokenOut": "USDC",
  "amount": 1.5,
  "side": "BUY"
}
```

**Response:**
```json
{
  "orderId": "uuid-string",
  "status": "queued"
}
```

### WebSocket Updates
Connect to: `ws://localhost:3000/api/orders/ws?orderId={orderId}`

**Events:**
- `pending`: Order received.
- `routing`: Comparing prices.
- `building`: Transaction being built.
- `submitted`: Transaction sent.
- `confirmed`: Transaction successful (includes `txHash`).
- `failed`: Error occurred.

## Mock Implementation
This project uses a **Mock DEX Router** to simulate network interactions.
- **Delays**: Realistic network delays (200ms - 3s) are simulated.
- **Prices**: Random price variations (~2-5%) are generated to demonstrate routing logic.
