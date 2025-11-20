# Order Execution Engine - Complete Setup Guide

## Current Issue
Your network is experiencing timeouts when connecting to npm/yarn registries. This is a common issue and can be resolved using one of the methods below.

## Solutions to Try

### Option 1: Use a VPN or Different Network
If you're behind a firewall or proxy, try:
- Switching to a different network (mobile hotspot, different WiFi)
- Using a VPN service
- Checking with your network admin about proxy settings

### Option 2: Use Offline Installation
1. On a machine with good internet connection, run:
   ```bash
   npm pack fastify bullmq ioredis @prisma/client zod dotenv
   npm pack --save-dev typescript ts-node jest prisma nodemon @types/node @types/jest ts-jest @fastify/websocket
   ```

2. Copy the `.tgz` files to your project and install:
   ```bash
   npm install ./fastify-*.tgz ./bullmq-*.tgz ...
   ```

### Option 3: Configure NPM for Your Network
```bash
# Increase timeout
npm config set fetch-timeout 60000
npm config set fetch-retries 5

# If behind proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Try again
npm install
```

### Option 4: Use pnpm (Alternative Package Manager)
```bash
npm install -g pnpm
pnpm install
```

## Manual Dependency Installation (One by One)
If bulk install fails, install packages individually:

```bash
# Core dependencies
npm install fastify
npm install bullmq
npm install ioredis
npm install @prisma/client
npm install zod
npm install dotenv
npm install @fastify/websocket

# Dev dependencies
npm install -D typescript
npm install -D ts-node
npm install -D jest
npm install -D prisma
npm install -D nodemon
npm install -D @types/node
npm install -D @types/jest
npm install -D ts-jest
```

## After Dependencies Are Installed

1. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

2. **Setup Database** (Make sure PostgreSQL is running):
   ```bash
   npx prisma db push
   ```

3. **Start Redis** (Make sure Redis is running on port 6379)

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Test the API**:
   ```bash
   # In another terminal
   curl -X POST http://localhost:3000/api/orders/execute \
     -H "Content-Type: application/json" \
     -d '{"tokenIn":"SOL","tokenOut":"USDC","amount":1.5,"side":"BUY"}'
   ```

## Project is Complete
All source code files have been created:
- ✅ `src/app.ts` - Main server
- ✅ `src/api/orders.ts` - Order routes
- ✅ `src/services/DexRouter.ts` - Mock DEX routing
- ✅ `src/services/OrderQueue.ts` - BullMQ worker
- ✅ `src/services/WebSocketService.ts` - WebSocket manager
- ✅ `src/config/index.ts` - Configuration
- ✅ `src/db/index.ts` - Prisma client
- ✅ `prisma/schema.prisma` - Database schema
- ✅ `tests/router.test.ts` - Unit tests
- ✅ `tests/integration.test.ts` - Integration tests
- ✅ `README.md` - Project documentation
- ✅ `.env` - Environment variables
- ✅ `package.json` - Dependencies
- ✅ `tsconfig.json` - TypeScript config
- ✅ `jest.config.js` - Jest config

The only remaining step is installing dependencies!
