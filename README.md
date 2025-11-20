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

---

## 🚀 Live Demo

> **🌐 Deployed URL**: https://backendtask2-production.up.railway.app

> **🎥 Demo Video**: [Add your YouTube video link here]

---

## 📦 Deliverables

### ✅ Completed
- [x] GitHub repository with clean commits
- [x] API with order execution and routing
- [x] WebSocket status updates (in code)
- [x] Mock DEX implementation
- [x] Comprehensive documentation (README, setup guides)
- [x] Unit tests (10+ tests)
- [x] Integration tests
- [x] Postman collection (`postman_collection.json`)

### 🔄 Pending (After Dependency Installation)
- [ ] Deploy to free hosting (Railway/Render/Fly.io)
  - See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- [ ] Record 1-2 min demo video
  - See [VIDEO_GUIDE.md](VIDEO_GUIDE.md)
- [ ] Run full test suite
  - `npm test`

---

## 📁 Project Files

- `src/` - Source code
  - `app.ts` - Main server
  - `api/orders.ts` - Order routes
  - `services/` - Business logic (Router, Queue, WebSocket)
  - `config/` - Configuration
  - `db/` - Database client
- `tests/` - Unit and integration tests
- `prisma/` - Database schema
- `postman_collection.json` - API collection
- `demo-server.js` - Standalone demo (no dependencies)
- `test-client.js` - Test client for demo
- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `VIDEO_GUIDE.md` - Video recording guide
- `SETUP_GUIDE.md` - Network troubleshooting

---

## 🎯 Quick Test (Demo Server)

If dependencies aren't installed yet:

```bash
# Run demo server (no dependencies needed)
node demo-server.js

# In another terminal, run test client
node test-client.js

# Or open browser
http://localhost:3000
```

---

## 📊 Architecture Diagram

```
Client → POST /api/orders/execute
    ↓
  Create Order (DB)
    ↓
  Add to BullMQ Queue
    ↓
  Return orderId
    ↓
  Client connects via WebSocket
    ↓
Worker processes:
  1. ROUTING (query Raydium & Meteora)
  2. BUILDING (prepare transaction)
  3. SUBMITTED (send to network)
  4. CONFIRMED (update DB, send txHash)
```

---

## 🧪 Testing

```bash
# Unit tests
npm test

# Integration tests  
npm test -- integration

# Test coverage
npm test -- --coverage
```

---

## 📞 Support

For issues with:
- **Dependencies**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Deployment**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Video Recording**: See [VIDEO_GUIDE.md](VIDEO_GUIDE.md)

