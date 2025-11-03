# 🎨 Deploy Socket.IO to Render

## Why Render?

**Benefits:**
- ✅ Native WebSocket support (Socket.IO works perfectly)
- ✅ Free tier available ($0 for testing)
- ✅ Persistent servers (not serverless like Vercel)
- ✅ Easy deployment from GitHub
- ✅ Auto-deploy on push
- ✅ Free SSL certificates

---

## Quick Deploy (10 Minutes)

### Step 1: Create Render Account

1. Go to: https://render.com
2. Sign up with GitHub (free)
3. Verify email

### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `QuestEd`
3. Select branch: `feat/migrate-ably-to-socketio`

### Step 3: Configure Service

**Basic Settings:**
- **Name:** `quested`
- **Region:** Choose closest to your users (e.g., Oregon USA, Frankfurt EU)
- **Branch:** `feat/migrate-ably-to-socketio`
- **Root Directory:** `.` (leave blank or root)

**Build & Deploy:**
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start`

**Instance Type:**
- **Free:** Good for testing (sleeps after 15 min inactivity)
- **Starter ($7/month):** Better for production (always on)

### Step 4: Add Environment Variables

Click **"Environment"** → **"Add Environment Variable"**

**Required:**
```
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
NEXT_PUBLIC_APP_URL=https://quested.onrender.com
NODE_ENV=production
```

**Optional (Email):**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=QuestEd <your-email@gmail.com>
```

**Optional (Microsoft Teams):**
```
MICROSOFT_CLIENT_ID=your-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret
```

**Optional (Cloudinary):**
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**NOT NEEDED (Socket.IO is self-hosted):**
```
# DELETE THESE - Not needed anymore!
ABLY_API_KEY
NEXT_PUBLIC_ABLY_KEY
NEXT_PUBLIC_ABLY_CLIENT_KEY
```

### Step 5: Deploy!

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repo
   - Install dependencies
   - Build Next.js app
   - Start Socket.IO server
   - Generate URL: `https://quested.onrender.com`

**Deployment time:** 2-5 minutes

### Step 6: Verify Deployment

1. Open: `https://quested.onrender.com`
2. Check logs for:
   ```
   🔌 Socket.IO server initialized
   > Ready on http://0.0.0.0:3000
   ✅ Socket.IO client connected
   ```

---

## Testing Checklist

### Quick Quiz Flow

**Create & Join:**
- [ ] Create quick quiz on Render
- [ ] Copy join code
- [ ] Open incognito/another browser
- [ ] Join with code
- [ ] **Verify:** Host sees participant INSTANTLY (within 1 second)

**Start & Play:**
- [ ] Host clicks "Start Quiz"
- [ ] **Verify:** Participant screen updates immediately
- [ ] Answer questions
- [ ] **Verify:** Host sees answers in real-time
- [ ] **Verify:** Leaderboard updates live
- [ ] Complete quiz
- [ ] **Verify:** Both see results page

**Expected logs:**
```
⚡ Published participant-joined for quiz xxx
🚀 Published quiz-started for quiz xxx
✅ Relayed answer submission for quiz xxx
```

**If all ✅ → Socket.IO working perfectly!**

### Live Test Flow

- [ ] Create live test
- [ ] Students join
- [ ] **Verify:** Leaderboard appears instantly
- [ ] Students answer questions
- [ ] **Verify:** Scores update in real-time
- [ ] **Verify:** Position changes animate
- [ ] Teacher ends test
- [ ] **Verify:** Students redirected immediately

### Classroom Features

- [ ] Upload material
- [ ] **Verify:** Students see notification instantly
- [ ] Create announcement
- [ ] **Verify:** Students notified immediately
- [ ] Invite student
- [ ] **Verify:** Email sent + bell notification

---

## Performance Testing

### Load Test with Multiple Users

**Test 1: 10 Concurrent Users**
- [ ] Create quiz
- [ ] Have 10 people join simultaneously
- [ ] **Verify:** All see updates in real-time
- [ ] **Verify:** No lag or delay

**Test 2: Connection Stability**
- [ ] Keep quiz running for 30 minutes
- [ ] **Verify:** No disconnections
- [ ] **Verify:** Updates still real-time

**Test 3: Network Resilience**
- [ ] Turn off WiFi mid-quiz
- [ ] Turn WiFi back on
- [ ] **Verify:** Socket.IO reconnects automatically
- [ ] **Verify:** Catches up on missed updates

---

## Monitoring

### Check Logs

**Render Dashboard:**
1. Go to: https://dashboard.render.com
2. Click your service
3. Click **"Logs"** tab
4. Look for:
   ```
   ✅ Socket.IO server initialized
   ✅ Socket.IO client connected: abc123
   ⚡ Published participant-joined
   🚀 Published quiz-started
   ✅ Relayed answer submission
   ```

**No errors = Everything working!**

### Monitor Metrics

**Render Dashboard → Metrics:**
- CPU usage
- Memory usage
- Response time
- Request count

**Healthy app:**
- CPU: < 50%
- Memory: < 80%
- Response time: < 500ms

---

## Custom Domain (Optional)

### Add Your Own Domain

**Example:** `app.questEd.com`

1. Render Dashboard → Settings → Custom Domains
2. Add: `app.questEd.com`
3. Add DNS records to your domain registrar:
   ```
   Type: CNAME
   Name: app
   Value: quested.onrender.com
   ```
4. Wait for DNS propagation (5-30 minutes)
5. Render auto-generates SSL certificate

**Result:** Users visit `https://app.questEd.com`

---

## Troubleshooting

### 1. Build Fails

**Error:** `npm run build` fails

**Check:**
```bash
# Verify package.json scripts
{
  "scripts": {
    "build": "next build",
    "start": "NODE_ENV=production tsx server.ts"
  }
}
```

**Solution:**
- Check Render build logs
- Look for TypeScript errors
- Verify all dependencies installed

### 2. Socket.IO Not Connecting

**Error:** Client shows `Socket.IO connection error`

**Check:**
1. Verify `NEXT_PUBLIC_APP_URL` matches Render URL
2. Open browser console, look for connection errors
3. Check Render logs for `Socket.IO server initialized`

**Solution:**
```bash
# Update environment variable in Render dashboard
NEXT_PUBLIC_APP_URL=https://quested.onrender.com
```

### 3. MongoDB Connection Error

**Error:** `MongoServerError: Authentication failed`

**Solution:**
1. Verify `MONGO_URI` in Render dashboard
2. Check MongoDB Atlas:
   - Network Access → Allow Render IPs (or 0.0.0.0/0)
   - Database Access → Verify credentials

### 4. Free Tier Sleeping

**Issue:** App sleeps after 15 minutes of inactivity

**Solutions:**

**Option A: Upgrade to Starter ($7/month)**
- Always on
- No sleep
- Better for production

**Option B: Keep Free, Add Ping Service**
- Use: https://uptimerobot.com (free)
- Ping your Render URL every 5 minutes
- Keeps app awake

**Option C: Accept 1-2 second cold start**
- Fine for testing
- Users wait slightly on first load

---

## Cost Comparison

### Render Pricing

**Free Tier:**
- $0/month
- 750 hours/month
- Sleeps after 15 min inactivity
- Good for: Testing, low-traffic staging

**Starter:**
- $7/month per service
- Always on (no sleep)
- 512MB RAM
- Good for: Production (< 1000 users)

**Standard:**
- $25/month per service
- 2GB RAM
- Better performance
- Good for: Production (1000+ users)

### Total Cost Comparison

| Platform | Monthly Cost | User Limit | Socket.IO |
|----------|--------------|------------|-----------|
| **Vercel + Ably** (current) | $0-29 | 200 | ✅ Via Ably |
| **Render Free** (testing) | $0 | Unlimited | ✅ Works |
| **Render Starter** (production) | $7 | Unlimited | ✅ Works |
| **Render Standard** (scale) | $25 | Unlimited | ✅ Works |

**Savings:** $2-22/month vs Ably, unlimited users!

---

## Production Readiness Checklist

Before switching production traffic:

**Testing:**
- [ ] All features tested on Render
- [ ] Quick quiz flow working
- [ ] Live test flow working
- [ ] Classroom features working
- [ ] Multiple users tested simultaneously
- [ ] Connection stability verified (30+ min test)
- [ ] Mobile browsers tested
- [ ] Incognito mode tested

**Performance:**
- [ ] Response time < 1 second
- [ ] Real-time updates < 100ms
- [ ] No connection drops
- [ ] CPU usage < 50%
- [ ] Memory usage stable

**Security:**
- [ ] HTTPS working (automatic on Render)
- [ ] Environment variables secure
- [ ] No API keys exposed
- [ ] CORS configured correctly

**Monitoring:**
- [ ] Logs show no errors
- [ ] Metrics look healthy
- [ ] Error tracking set up (optional)

**Backup:**
- [ ] Vercel version still running
- [ ] Can rollback if needed
- [ ] Database backups current

---

## Next Steps

1. ✅ Deploy to Render (follow steps above)
2. ✅ Test thoroughly (use checklist)
3. ✅ Monitor for 1-2 weeks
4. ✅ Gather user feedback
5. ✅ Implement Vercel redirect (see next doc)
6. ✅ Switch production traffic

---

## Support

**Render:**
- Docs: https://render.com/docs
- Discord: https://discord.gg/render
- Email: support@render.com

**Need Help?**
- Check Render docs first
- Post in Discord #help channel
- Check logs in dashboard

---

**Status:** Ready to deploy! 🚀  
**Estimated Time:** 10 minutes  
**Difficulty:** Easy  
**Success Rate:** 99%

Go ahead and deploy - it's safe, easy, and you can test without any risk to your current production! 💪
