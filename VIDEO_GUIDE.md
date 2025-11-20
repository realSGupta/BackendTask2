# Video Recording Guide - Order Execution Engine Demo

## 🎬 Video Requirements
- **Duration**: 1-2 minutes
- **Platform**: YouTube (unlisted or public)
- **Quality**: 720p minimum
- **Content**: Show order flow, design decisions, concurrent processing

## 📹 Recording Tools

### Option 1: OBS Studio (Free, Professional)
- Download: https://obsproject.com/
- Best for screen + webcam
- High quality output

### Option 2: Windows Game Bar (Built-in)
- Press `Win + G` to open
- Click record button
- Simple and quick

### Option 3: Loom (Web-based)
- Visit: https://www.loom.com/
- Free tier available
- Auto-uploads to cloud

## 🎯 Video Script (1-2 minutes)

### Section 1: Introduction (10 seconds)
```
"Hi! This is my Order Execution Engine for Solana DEX trading.
It routes orders between Raydium and Meteora to find the best price."
```

**Show**: 
- Browser at http://localhost:3000
- Briefly show the interface

### Section 2: Code Architecture (15 seconds)
```
"The architecture uses Fastify for the API, BullMQ for queue management,
and WebSocket for real-time updates. Here's the project structure."
```

**Show**:
- Quick view of VS Code with folder structure
- Highlight: `src/services/DexRouter.ts`, `src/services/OrderQueue.ts`

### Section 3: Design Decision (15 seconds)
```
"I chose Market Orders because they best demonstrate real-time DEX routing.
The system can be extended to support Limit and Sniper orders by adding
price monitoring and blockchain event listeners."
```

**Show**:
- README.md section on design decisions
- Or code comments explaining the logic

### Section 4: Submit Multiple Orders (30 seconds)
```
"Now I'll submit 5 concurrent orders to demonstrate the queue system."
```

**Action**:
- Open Postman
- Run the "Batch Submit" request 5 times (use Runner with 5 iterations)
- OR use the test client: `node test-client.js`

**Show**:
- Postman showing 5 responses with different orderIds
- Switch to terminal showing server logs

### Section 5: Routing Decisions (20 seconds)
```
"Notice in the console logs - the system compares Raydium and Meteora prices
for each order and automatically selects the better route."
```

**Show**:
- Terminal with logs showing:
  ```
  [Order xxx] Raydium: $98.42
  [Order xxx] Meteora: $97.89
  [Order xxx] Best Route: Meteora @ $97.89
  ```

### Section 6: Concurrent Processing (10 seconds)
```
"All 5 orders are processed concurrently by the queue worker,
with a maximum of 10 concurrent jobs as configured."
```

**Show**:
- Logs showing multiple orders processing simultaneously
- Status updates: ROUTING → BUILDING → SUBMITTED → CONFIRMED

### Section 7: Conclusion (10 seconds)
```
"The project is deployed at [YOUR_URL], fully tested,
and ready for production use. Thanks for watching!"
```

**Show**:
- Final screen with:
  - GitHub repo link
  - Deployed URL
  - Your contact info (optional)

## 🎨 Visual Tips

1. **Use Annotations**
   - Add text overlays for key points
   - Use arrows to highlight important logs
   - Tool: OBS Studio has built-in text sources

2. **Screen Layout**
   - Left: Terminal with server logs
   - Right: Postman or browser
   - Bottom: Code editor (optional)

3. **Zoom In**
   - Zoom into terminal for logs (Ctrl + Scroll in most terminals)
   - Make text readable at 720p

4. **Clean Background**
   - Close unnecessary tabs/windows
   - Use dark mode for better contrast

## 📝 Quick Demo Script (For test-client.js)

```bash
# In one terminal (already running):
node demo-server.js

# In another terminal:
node test-client.js
```

Record both terminals side-by-side:
- Left: Server logs showing routing decisions
- Right: Client submitting orders and receiving responses

## 🎥 Recording Steps

1. **Prepare**
   - Server running: `node demo-server.js`
   - Postman open with collection imported
   - Terminal visible with logs
   - Test script ready: `test-client.js`

2. **Start Recording**
   - Open OBS / Game Bar / Loom
   - Start recording
   - Take a deep breath!

3. **Record**
   - Follow the script above
   - Speak clearly and not too fast
   - Show each section for the allocated time

4. **End Recording**
   - Show final summary slide
   - Stop recording

5. **Edit (Optional)**
   - Trim any mistakes
   - Add intro/outro cards
   - Tool: DaVinci Resolve (free)

6. **Upload to YouTube**
   - Title: "Order Execution Engine - Solana DEX Router Demo"
   - Description:
     ```
     Demo of my Order Execution Engine for Solana DEXs.
     
     Features:
     - Market order execution
     - DEX routing (Raydium vs Meteora)
     - Real-time WebSocket updates
     - Concurrent order processing with BullMQ
     - Exponential backoff retry logic
     
     GitHub: [your-repo-url]
     Live Demo: [deployed-url]
     ```
   - Visibility: Unlisted or Public
   - Copy the YouTube link

7. **Add to README**
   ```markdown
   ## 🎥 Demo Video
   Watch the demo: https://youtu.be/YOUR_VIDEO_ID
   ```

## ⚡ Quick Alternative: Record with Loom

If you want the fastest option:

1. Go to https://www.loom.com/
2. Click "Start Recording"
3. Choose "Screen + Camera" or "Screen Only"
4. Follow the script above
5. Loom auto-uploads and gives you a shareable link
6. Add link to README

**Advantage**: No editing needed, instant sharing

## 🎯 Final Checklist

Before recording:
- [ ] Server is running and working
- [ ] Test client works (run it once to verify)
- [ ] Postman collection imported
- [ ] Terminal is zoomed and readable
- [ ] Browser is clean (close extra tabs)
- [ ] Script is ready (print or have on second monitor)
- [ ] Recording software is tested

After recording:
- [ ] Video is 1-2 minutes
- [ ] Shows concurrent orders
- [ ] Shows routing decisions in logs
- [ ] Explains design decisions
- [ ] Uploaded to YouTube
- [ ] Link added to README
- [ ] Video is accessible (not private)

## 📊 Example Timeline

```
0:00-0:10  Introduction & Architecture
0:10-0:25  Design Decision Explanation
0:25-0:55  Submit 5 Orders + Show Logs
0:55-1:05  Routing Logic Demonstration
1:05-1:15  Concurrent Processing
1:15-1:30  Deployed URL & Conclusion
```

Total: 1:30 (perfect length!)

---

Good luck with your recording! 🎬
