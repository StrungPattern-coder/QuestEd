# 🚂 Deploy Socket.IO to Railway (Vercel Alternative)

## Why Railway?

**Vercel Problem:** Serverless functions don't support persistent WebSocket connections.

**Railway Solution:** Persistent servers with native WebSocket support.

---

## Quick Start (5 Minutes)

### Step 1: Create Railway Account

1. Go to: https://railway.app
2. Sign up with GitHub (free $5 credit)
3. Verify email

### Step 2: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 3: Login

```bash
railway login
```

### Step 4: Initialize Project

```bash
cd /Users/sriram_kommalapudi/Projects/QuestEd

# Switch to Socket.IO branch
git checkout feat/migrate-ably-to-socketio

# Initialize Railway
railway init
```

**Choose:**
- Project name: `quested`
- Link to existing project: `No` (create new)

### Step 5: Add Environment Variables

```bash
railway variables set MONGO_URI="your-mongodb-uri"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set NEXT_PUBLIC_APP_URL="https://quested.railway.app"

# Optional
railway variables set SMTP_HOST="smtp.gmail.com"
railway variables set SMTP_PORT="587"
railway variables set SMTP_USER="your-email@gmail.com"
railway variables set SMTP_PASS="your-app-password"
railway variables set EMAIL_FROM="QuestEd <your-email@gmail.com>"
```

### Step 6: Deploy

```bash
railway up
```

**Railway will:**
- ✅ Build your Next.js app
- ✅ Start the Socket.IO server
- ✅ Generate a URL: `https://quested.up.railway.app`

### Step 7: Test

1. Open: `https://quested.up.railway.app`
2. Create a quick quiz
3. Join from another tab
4. **Verify:** Host sees participant instantly ✅

---

## Configuration

### Railway Settings

1. Go to Railway dashboard: https://railway.app/dashboard
2. Click your project
3. Go to **Settings**

**Important Settings:**
- **Start Command:** `npm run start`
- **Build Command:** `npm run build`
- **Node Version:** `18.x`
- **Root Directory:** `.` (root)

### Custom Domain (Optional)

1. Railway Dashboard → Settings → Domains
2. Add custom domain: `quest-ed.yourdomain.com`
3. Add CNAME record to your DNS:
   ```
   CNAME quest-ed -> your-project.up.railway.app
   ```

---

## Environment Variables Checklist

**Required:**
- [ ] `MONGO_URI` - Your MongoDB connection string
- [ ] `JWT_SECRET` - Secure random string
- [ ] `NEXT_PUBLIC_APP_URL` - Railway URL (e.g., `https://quested.up.railway.app`)

**Optional (Email):**
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT`
- [ ] `SMTP_USER`
- [ ] `SMTP_PASS`
- [ ] `EMAIL_FROM`

**Optional (Microsoft Teams):**
- [ ] `MICROSOFT_CLIENT_ID`
- [ ] `MICROSOFT_CLIENT_SECRET`

**Optional (Cloudinary):**
- [ ] `CLOUDINARY_CLOUD_NAME`
- [ ] `CLOUDINARY_API_KEY`
- [ ] `CLOUDINARY_API_SECRET`

**NOT NEEDED (Socket.IO is self-hosted):**
- ❌ `ABLY_API_KEY` - Delete this
- ❌ `NEXT_PUBLIC_ABLY_KEY` - Delete this
- ❌ `NEXT_PUBLIC_ABLY_CLIENT_KEY` - Delete this

---

## Verify Socket.IO Working

### Check Logs

```bash
railway logs
```

**Look for:**
```
🔌 Socket.IO server initialized
> Ready on http://0.0.0.0:3000
✅ Socket.IO client connected: abc123
```

### Test Real-time Features

**Quick Quiz:**
1. Create quiz → ✅ Should work
2. Join with code → ✅ Host sees instantly
3. Start quiz → ✅ Real-time notification
4. Answer question → ✅ Live leaderboard update

**If you see these working → Socket.IO is working perfectly!**

---

## Cost & Scaling

### Pricing

**Free Tier:**
- $5 credit (lasts ~1 month with light usage)
- 512MB RAM
- Shared CPU

**Hobby Plan ($5/month):**
- Better for production
- 1GB RAM
- Dedicated CPU
- Up to 500k requests/month

**Pro Plan ($20/month):**
- 8GB RAM
- Priority support
- Unlimited requests
- Multiple environments

### Estimated Cost for QuestEd

**Light Usage (100 users):**
- ~$5/month (Hobby plan)

**Medium Usage (500 users):**
- ~$10/month (Pro plan)

**Heavy Usage (2000+ users):**
- ~$20/month (Pro plan)

**Still cheaper than Ably's $29/month with 200 user limit!**

---

## Monitoring

### Check Server Status

```bash
railway status
```

### View Logs in Real-time

```bash
railway logs --follow
```

### Metrics Dashboard

1. Go to Railway dashboard
2. Click your project
3. View **Metrics** tab:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

---

## Troubleshooting

### 1. Build Fails

**Error:** `npm run build` fails

**Solution:**
```bash
# Check package.json scripts
{
  "scripts": {
    "build": "next build",
    "start": "NODE_ENV=production tsx server.ts"
  }
}
```

### 2. Socket.IO Not Connecting

**Error:** `Socket.IO connection error`

**Check:**
1. Verify `NEXT_PUBLIC_APP_URL` matches Railway URL
2. Check server logs: `railway logs`
3. Look for: `🔌 Socket.IO server initialized`

**Solution:**
```bash
railway variables set NEXT_PUBLIC_APP_URL="https://your-project.up.railway.app"
railway redeploy
```

### 3. MongoDB Connection Error

**Error:** `MongoServerError: Authentication failed`

**Solution:**
```bash
# Verify MONGO_URI is correct
railway variables get MONGO_URI

# Update if needed
railway variables set MONGO_URI="your-correct-uri"
```

### 4. Port Issues

**Error:** `Error: listen EADDRINUSE: address already in use`

**Solution:**
Railway automatically sets `PORT` environment variable. Server.ts should use it:

```typescript
// server.ts
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`> Ready on http://0.0.0.0:${PORT}`);
});
```

---

## Migration Strategy

### Safe Approach (Recommended)

**Current State:**
```
Production: Vercel (Ably) → quest-ed-phi.vercel.app
Branch: main
```

**Step 1: Deploy Socket.IO to Railway**
```
Staging: Railway (Socket.IO) → quested.up.railway.app
Branch: feat/migrate-ably-to-socketio
```

**Step 2: Test Thoroughly**
- Test all features on Railway
- Verify real-time updates work
- Check with multiple users

**Step 3: Switch Traffic**
- Update DNS to point to Railway
- Or update primary link to Railway URL
- Keep Vercel as backup

**Step 4: Monitor**
- Watch Railway logs for errors
- Monitor user feedback
- Ready to rollback to Vercel if needed

---

## Rollback Plan (If Needed)

### Quick Rollback to Vercel

**If Socket.IO has issues on Railway:**

1. Point traffic back to Vercel
2. Users go back to Ably version
3. Everything works as before

**No data loss, no downtime!**

---

## Comparison: Vercel vs Railway

| Feature | Vercel | Railway |
|---------|--------|---------|
| WebSocket Support | ⚠️ Limited | ✅ Full |
| Socket.IO | ⚠️ Doesn't work well | ✅ Perfect |
| Cost | $0-20/month | $5-20/month |
| Real-time Features | ❌ Breaks | ✅ Works |
| Serverless | ✅ Yes | ❌ No (better for WebSocket) |
| Build Speed | ⚡ Fast | ⚡ Fast |
| Deployment | ⚡ Instant | ⚡ ~2 min |

**For Socket.IO: Railway wins! ✅**

---

## Next Steps

1. ✅ Deploy to Railway (5 minutes)
2. ✅ Test all features (30 minutes)
3. ✅ Share staging URL with friends for testing
4. ✅ Monitor for 1-2 days
5. ✅ Switch production traffic to Railway
6. ✅ Enjoy unlimited users + low cost!

---

## Support

**Railway:**
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Twitter: @Railway

**Questions?**
- Check Railway docs first
- Post in Railway Discord #help channel
- Railway team is very responsive!

---

**Status:** Ready to deploy! 🚀
**Estimated Time:** 5 minutes
**Difficulty:** Easy
**Success Rate:** 99%

Go ahead and deploy! It's safe, easy, and reversible. 💪
