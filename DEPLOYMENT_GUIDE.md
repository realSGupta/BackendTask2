# Deployment Guide - Order Execution Engine

## 🚀 Deployment Options

### Option 1: Railway.app (Recommended)

**Why Railway?**
- Easiest setup for Node.js + PostgreSQL + Redis
- Free tier available
- Auto-deployment from GitHub
- Built-in database and Redis support

**Steps:**

1. **Create Railway Account**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add Services**
   - Click "New" → "Database" → "PostgreSQL"
   - Click "New" → "Database" → "Redis"
   
4. **Configure Environment Variables**
   - Go to your main service settings
   - Add variables:
     ```
     DATABASE_URL=${{Postgres.DATABASE_URL}}
     REDIS_HOST=${{Redis.REDIS_HOST}}
     REDIS_PORT=${{Redis.REDIS_PORT}}
     PORT=3000
     ```

5. **Add Build & Start Commands**
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npx prisma db push && node dist/app.js`

6. **Deploy**
   - Railway will auto-deploy
   - Get your public URL from the service settings
   - Update README.md with the URL

**Public URL**: Will be like `https://your-app.up.railway.app`

---

### Option 2: Render.com

**Why Render?**
- Free PostgreSQL database
- Simple setup
- Good for TypeScript apps

**Steps:**

1. **Create Render Account**
   - Visit https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   
3. **Configure Service**
   - Name: `order-execution-engine`
   - Environment: `Node`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npx prisma db push && node dist/app.js`

4. **Add PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name it and create
   - Copy the internal database URL

5. **Add Redis**
   - Render doesn't have free Redis
   - Use Upstash (free): https://upstash.com/
   - Create Redis database
   - Copy connection details

6. **Set Environment Variables**
   ```
   DATABASE_URL=<your-postgres-url>
   REDIS_HOST=<upstash-host>
   REDIS_PORT=<upstash-port>
   REDIS_PASSWORD=<upstash-password>
   PORT=3000
   ```

7. **Deploy**
   - Render will auto-deploy
   - Get public URL

**Public URL**: Will be like `https://order-execution-engine.onrender.com`

---

### Option 3: Fly.io

**Why Fly.io?**
- Good for TypeScript/Node.js
- Free tier available
- Command-line deployment

**Steps:**

1. **Install Flyctl**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login**
   ```bash
   flyctl auth login
   ```

3. **Initialize App**
   ```bash
   flyctl launch
   # Choose app name: order-execution-engine
   # Choose region closest to you
   # Skip PostgreSQL for now (we'll add it separately)
   ```

4. **Add PostgreSQL**
   ```bash
   flyctl postgres create
   flyctl postgres attach <postgres-app-name>
   ```

5. **Add Redis (Upstash)**
   - Create on https://upstash.com/
   - Set secrets:
   ```bash
   flyctl secrets set REDIS_HOST=<host>
   flyctl secrets set REDIS_PORT=<port>
   flyctl secrets set REDIS_PASSWORD=<password>
   ```

6. **Deploy**
   ```bash
   flyctl deploy
   ```

**Public URL**: Will be like `https://order-execution-engine.fly.dev`

---

## 📝 After Deployment

1. **Update README.md**
   ```markdown
   ## Live Demo
   🌐 **Public URL**: https://your-app.up.railway.app
   ```

2. **Test the Deployment**
   ```bash
   curl -X POST https://your-app.up.railway.app/api/orders/execute \
     -H "Content-Type: application/json" \
     -d '{"tokenIn":"SOL","tokenOut":"USDC","amount":1.5,"side":"BUY"}'
   ```

3. **Update Postman Collection**
   - Change `base_url` variable to your public URL
   - Test all endpoints

---

## 🔧 Troubleshooting

### Build Fails: Dependencies Not Installing
**Solution**: Add this to `package.json`:
```json
"engines": {
  "node": ">=16.0.0",
  "npm": ">=8.0.0"
}
```

### Prisma Errors on Deploy
**Solution**: Make sure build command includes:
```bash
npx prisma generate
```

### Redis Connection Timeout
**Solution**: 
- Check REDIS_HOST includes protocol if needed
- For Upstash, use TLS: update connection code to support TLS

### Database Migration Failed
**Solution**: Use `npx prisma db push` instead of `npx prisma migrate deploy` for first deployment

---

## ⚡ Quick Start (For Testing Without Full Setup)

If you can't get dependencies installed locally due to network issues but want to deploy:

1. **Push code to GitHub**
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin master
   ```

2. **Deploy on Railway/Render**
   - They will handle npm install on their servers
   - Your local network issues won't affect deployment

3. **Test on deployed URL**
   - Use Postman with deployed URL
   - All features (WebSocket, DB, Queue) will work on deployment

---

## 🎯 Recommended: Railway.app

For this project, **Railway** is the best choice because:
- ✅ One-click PostgreSQL + Redis
- ✅ Automatic environment variable linking
- ✅ GitHub auto-deploy
- ✅ Free tier sufficient for demo
- ✅ Easiest setup

**Time to deploy**: ~5 minutes
