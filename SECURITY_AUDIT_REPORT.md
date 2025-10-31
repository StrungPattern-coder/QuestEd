# 🔒 QuestEd Security Audit & Performance Report
**Date**: November 1, 2025  
**Project**: QuestEd - Interactive Quiz Platform  
**Audit Type**: Comprehensive Security & Load Analysis

---

## 📋 Executive Summary

### Critical Findings
- **🔴 CRITICAL**: Ably API key exposed in client-side code via `NEXT_PUBLIC_` prefix
- **🔴 CRITICAL**: No rate limiting on authentication endpoints (brute-force vulnerability)
- **🟡 HIGH**: Missing input sanitization for NoSQL injection prevention
- **🟡 HIGH**: No security headers implemented
- **🟡 HIGH**: JWT tokens have long expiration (7 days) without refresh token mechanism
- **🟢 GOOD**: Password hashing with bcrypt implemented correctly
- **🟢 GOOD**: Password reset tokens properly hashed and time-limited
- **🟢 GOOD**: CORS configured (needs minor improvements)

---

## 🏗️ Architecture Analysis

### Backend Structure

**Where does the server code run?**

The application uses a **hybrid architecture**:

1. **Next.js API Routes** (`/app/api/*`)
   - **Runtime**: Vercel Serverless Functions (AWS Lambda-based)
   - **Location**: Deployed on Vercel
   - **Scaling**: Automatic, serverless (scales to zero)
   - **Handles**: 
     - Authentication (login, signup, password reset)
     - CRUD operations (classrooms, tests, submissions)
     - Question bank management
     - Template operations

2. **Express Backend** (`/backend/server.ts`)
   - **Status**: ⚠️ **Currently NOT deployed in production**
   - **Purpose**: Legacy/development server
   - **Note**: All routes duplicated in Next.js API routes
   - **Recommendation**: Remove or deploy separately if needed

3. **Ably Real-Time Service** (Third-party managed)
   - **Runtime**: Ably's distributed infrastructure
   - **Purpose**: Real-time websocket communication
   - **Features**:
     - Live quiz synchronization
     - Leaderboard updates
     - Materials/announcements broadcasting
   - **Free Tier Limits**:
     - 6 million messages/month
     - 200 concurrent connections
     - 50 channels

4. **MongoDB Atlas** (Database)
   - **Runtime**: MongoDB managed cloud (AWS)
   - **Scaling**: Automatic with cluster tier
   - **Current**: Shared cluster (M0 free tier)

### Request Flow
```
User Browser
    ↓
Next.js Frontend (Vercel CDN)
    ↓
Next.js API Routes (Vercel Serverless)
    ↓
MongoDB Atlas ← → Ably (WebSockets)
```

---

## ⚡ Performance & Load Handling

### Current Capacity Analysis

**Scenario: 10,000+ Concurrent Users**

#### 1. Next.js API Routes (Vercel)
**✅ Can Handle**
- Vercel automatically scales serverless functions
- Each function instance handles 1 request at a time
- Multiple instances spawn as needed
- **Limit**: 100 concurrent executions (Hobby plan), 1000+ (Pro plan)
- **Function timeout**: 10s (Hobby), 60s (Pro)
- **Max payload**: 4.5MB

**Scaling Strategy**:
```typescript
// Each API route scales independently
GET  /api/auth/login          → Instance 1, 2, 3...
POST /api/teacher/tests       → Instance 1, 2, 3...
GET  /api/student/classrooms  → Instance 1, 2, 3...
```

#### 2. MongoDB Atlas (Free Tier - M0)
**⚠️ WILL BOTTLENECK**
- **Current**: Shared CPU, 512MB RAM
- **Max connections**: ~100-500 concurrent
- **Throughput**: Limited shared cluster
- **10k users**: Database will be the primary bottleneck

**Required Upgrade**:
- **M10 Cluster** ($57/month):
  - 2GB RAM, Dedicated CPU
  - ~1500 concurrent connections
  - Better for 1000-5000 users
- **M30 Cluster** ($270/month):
  - 8GB RAM, Multi-core
  - ~5000 concurrent connections
  - Handles 10k+ users with proper indexing

#### 3. Ably (Real-Time)
**✅ Can Handle (with upgrade)**
- **Free Tier**:
  - 200 concurrent connections ❌
  - 6M messages/month
  - NOT sufficient for 10k users

- **Standard Tier** ($29/month):
  - 500 concurrent connections ❌
  - 20M messages/month

- **Pro Tier** ($299/month):
  - **10,000 concurrent connections** ✅
  - 200M messages/month
  - Required for 10k simultaneous users

**Message Load Estimation**:
- 10k users taking live quiz
- 20 questions, 1 submission per question
- = 200,000 messages during quiz
- Leaderboard updates: ~10k messages
- **Total**: ~210k messages per major event

#### 4. Network/CDN (Vercel)
**✅ Can Handle**
- Global CDN automatically scales
- No connection limits for static assets
- Edge caching reduces server load

### Scaling Recommendations

**Immediate (0-1000 users):**
- ✅ Current setup sufficient
- Upgrade to MongoDB M10 if >500 concurrent

**Medium (1000-5000 users):**
- MongoDB: M10 cluster ($57/month)
- Ably: Standard tier ($29/month)
- Vercel: Pro plan ($20/month)
- **Total**: ~$106/month

**Large (10,000+ users):**
- MongoDB: M30 cluster ($270/month)
- Ably: Pro tier ($299/month)
- Vercel: Pro plan ($20/month)
- **Total**: ~$589/month

---

## 🚨 Security Vulnerabilities

### 1. 🔴 CRITICAL: Exposed Ably API Key

**Issue**: `NEXT_PUBLIC_ABLY_CLIENT_KEY` is exposed in client-side code

**File**: `/lib/ably.ts`
```typescript
const ablyKey = process.env.NEXT_PUBLIC_ABLY_CLIENT_KEY // ❌ EXPOSED TO CLIENT
```

**Risk**:
- Anyone can inspect browser network tab and see the key
- Malicious users can publish fake messages to any channel
- Leaderboard manipulation possible
- Can spam channels with fake data

**Impact**: HIGH - Complete compromise of real-time features

**Fix**: Implement Token Authentication
```typescript
// Server-side: Generate token with capabilities
export async function POST(request: NextRequest) {
  const { userId, testId } = await request.json();
  
  const ably = new Ably.Rest({ key: process.env.ABLY_API_KEY });
  
  const tokenRequest = await ably.auth.createTokenRequest({
    clientId: userId,
    capability: {
      [`live-test-${testId}`]: ['subscribe', 'publish'],
      [`leaderboard-${testId}`]: ['subscribe']
    },
    ttl: 3600000 // 1 hour
  });
  
  return NextResponse.json({ tokenRequest });
}

// Client-side: Use token
const response = await fetch('/api/ably/token', {
  method: 'POST',
  body: JSON.stringify({ userId, testId })
});
const { tokenRequest } = await response.json();

const ably = new Ably.Realtime({
  authCallback: (tokenParams, callback) => {
    callback(null, tokenRequest);
  }
});
```

**Status**: ⚠️ **NEEDS IMMEDIATE FIX**

---

### 2. 🔴 CRITICAL: No Rate Limiting

**Issue**: Authentication and API endpoints have no rate limiting

**Files Affected**:
- `/app/api/auth/login/route.ts`
- `/app/api/auth/signup/route.ts`
- All API routes

**Risk**:
- Brute force password attacks
- Account enumeration
- Credential stuffing
- DDoS via API spam
- Resource exhaustion

**Attack Scenario**:
```bash
# Attacker can try unlimited login attempts
for i in {1..1000000}; do
  curl -X POST /api/auth/login \
    -d '{"email":"victim@email.com","password":"attempt'$i'"}'
done
```

**Impact**: HIGH - Account takeover, service disruption

**Fix**: ✅ **Rate limiting middleware created**

Files created:
- `/backend/middleware/rateLimiter.ts`

Implementation needed in `/backend/server.ts`:
```typescript
import { authRateLimiter, apiRateLimiter } from './middleware/rateLimiter';

// Apply to auth routes
app.use('/api/auth/login', authRateLimiter);
app.use('/api/auth/signup', signupRateLimiter);

// Apply globally to all API routes
app.use('/api', apiRateLimiter);
```

**Status**: ⚠️ **MIDDLEWARE CREATED - NEEDS INTEGRATION**

---

### 3. 🟡 HIGH: NoSQL Injection Vulnerability

**Issue**: User input not sanitized before MongoDB queries

**Example Vulnerable Code**:
```typescript
// Attacker can send: { "email": { "$ne": null } }
const user = await User.findOne({ email: req.body.email });
// This returns ANY user instead of specific email
```

**Attack Scenarios**:
1. **Authentication Bypass**:
```javascript
POST /api/auth/login
{
  "email": { "$ne": null },
  "password": { "$ne": null }
}
// Could bypass authentication
```

2. **Data Extraction**:
```javascript
GET /api/classrooms?name[$regex]=.*
// Extract all classroom names
```

**Impact**: HIGH - Data breach, authentication bypass

**Fix**: ✅ **Sanitization middleware created**

Files created:
- `/backend/middleware/sanitization.ts`

Implementation:
```typescript
import { sanitizeAll } from './middleware/sanitization';

// Apply globally to sanitize all inputs
app.use(sanitizeAll);
```

**Status**: ⚠️ **MIDDLEWARE CREATED - NEEDS INTEGRATION**

---

### 4. 🟡 HIGH: Missing Security Headers

**Issue**: No security headers to protect against common attacks

**Missing Headers**:
- `X-Frame-Options` - Clickjacking protection
- `X-Content-Type-Options` - MIME sniffing protection
- `Content-Security-Policy` - XSS protection
- `Strict-Transport-Security` - HTTPS enforcement
- `X-XSS-Protection` - Browser XSS filter

**Risk**:
- Clickjacking attacks
- XSS vulnerabilities
- MIME sniffing attacks
- Mixed content issues

**Impact**: MEDIUM-HIGH - Multiple attack vectors

**Fix**: ✅ **Security headers middleware created**

Files created:
- `/backend/middleware/security.ts`

Implementation:
```typescript
import { securityHeaders, hidePoweredBy, corsOptions } from './middleware/security';

app.use(hidePoweredBy);
app.use(securityHeaders);
app.use(cors(corsOptions));
```

**Status**: ⚠️ **MIDDLEWARE CREATED - NEEDS INTEGRATION**

---

### 5. 🟡 MEDIUM: Long JWT Expiration

**Issue**: JWT tokens expire after 7 days without refresh mechanism

**File**: `/backend/middleware/auth.ts`
```typescript
jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); // ❌ Too long
```

**Risk**:
- Stolen tokens valid for 7 days
- No way to revoke tokens
- Compromised sessions persist

**Recommended Fix**:
```typescript
// Short-lived access token
const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });

// Long-lived refresh token (stored in httpOnly cookie)
const refreshToken = jwt.sign(
  { userId: payload.userId }, 
  REFRESH_SECRET, 
  { expiresIn: '7d' }
);

// Store refresh token in database with ability to revoke
await RefreshToken.create({
  userId: payload.userId,
  token: refreshToken,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
});
```

**Status**: 🔄 **NEEDS IMPLEMENTATION**

---

### 6. 🟢 GOOD: Password Security

**What's Working**:
- ✅ Passwords hashed with bcrypt (cost factor 10)
- ✅ Password reset tokens hashed before storage
- ✅ Reset tokens expire after 10 minutes
- ✅ Email enumeration prevention
- ✅ Generic error messages

**File**: `/backend/controllers/authController.ts`
```typescript
const hashedPassword = await bcrypt.hash(password, 10); // ✅ Good
```

---

## 🛡️ Security Recommendations

### Immediate Actions (Critical)

#### 1. Fix Ably Key Exposure
**Priority**: 🔴 CRITICAL  
**Time**: 2-4 hours

Steps:
1. Create `/app/api/ably/token/route.ts`
2. Implement token authentication
3. Remove `NEXT_PUBLIC_ABLY_CLIENT_KEY` from `.env`
4. Update all client-side Ably connections
5. Rotate Ably API key in dashboard

#### 2. Implement Rate Limiting
**Priority**: 🔴 CRITICAL  
**Time**: 1-2 hours

Steps:
1. Use created middleware in `/backend/middleware/rateLimiter.ts`
2. Apply to auth routes: 5 attempts per 15 min
3. Apply to API routes: 100 requests per minute
4. Apply to signup: 3 attempts per hour per IP

#### 3. Add Input Sanitization
**Priority**: 🟡 HIGH  
**Time**: 1 hour

Steps:
1. Use created middleware in `/backend/middleware/sanitization.ts`
2. Apply globally to all routes
3. Test with injection payloads

#### 4. Add Security Headers
**Priority**: 🟡 HIGH  
**Time**: 30 minutes

Steps:
1. Use created middleware in `/backend/middleware/security.ts`
2. Apply to all responses
3. Test CSP with browser console

### Short-term Actions (1-2 weeks)

#### 5. Implement Refresh Tokens
**Priority**: 🟡 MEDIUM  
**Time**: 4-6 hours

- Create RefreshToken model
- Shorten access token to 15 minutes
- Implement refresh endpoint
- Store refresh tokens in httpOnly cookies

#### 6. Add Request Logging
**Priority**: 🟡 MEDIUM  
**Time**: 2-3 hours

```typescript
// middleware/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

export const requestLogger = (req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: req.user?.userId,
    timestamp: new Date().toISOString()
  });
  next();
};
```

#### 7. Add MongoDB Indexes
**Priority**: 🟢 LOW (but improves performance)  
**Time**: 1 hour

```typescript
// Improve query performance
UserSchema.index({ email: 1 }, { unique: true });
TestSchema.index({ teacherId: 1, createdAt: -1 });
SubmissionSchema.index({ testId: 1, studentId: 1 });
ClassroomSchema.index({ teacherId: 1 });
```

### Long-term Actions (1-2 months)

#### 8. Move to Production Database
- Upgrade MongoDB from M0 (free) to M10 ($57/month)
- Implement connection pooling
- Set up replica sets for high availability

#### 9. Implement API Key Management
- Generate API keys for third-party integrations
- Implement key rotation system
- Add usage analytics per key

#### 10. Add Monitoring & Alerts
- Set up Sentry for error tracking
- Configure Vercel analytics
- Set up MongoDB Atlas alerts
- Monitor Ably usage

---

## 📝 Integration Checklist

### Files Created (Ready to Use)

✅ **Rate Limiting**:
- `/backend/middleware/rateLimiter.ts`
- Exports: `authRateLimiter`, `apiRateLimiter`, `signupRateLimiter`

✅ **Input Sanitization**:
- `/backend/middleware/sanitization.ts`
- Exports: `sanitizeAll`, `sanitizeBody`, `sanitizeQuery`

✅ **Security Headers**:
- `/backend/middleware/security.ts`
- Exports: `securityHeaders`, `hidePoweredBy`, `corsOptions`

### Integration Steps

**Step 1**: Update `/backend/server.ts`
```typescript
import { authRateLimiter, apiRateLimiter, signupRateLimiter } from './middleware/rateLimiter';
import { sanitizeAll } from './middleware/sanitization';
import { securityHeaders, hidePoweredBy, corsOptions } from './middleware/security';
import cors from 'cors';

// Security middleware (apply before routes)
app.use(hidePoweredBy);
app.use(securityHeaders);
app.use(cors(corsOptions)); // Replace existing cors()
app.use(sanitizeAll);

// Rate limiting on specific routes
app.use('/api/auth/login', authRateLimiter);
app.use('/api/auth/signup', signupRateLimiter);
app.use('/api', apiRateLimiter); // General API rate limit

// ... rest of server config
```

**Step 2**: Update `.env` file
```bash
# Remove this line (security risk):
NEXT_PUBLIC_ABLY_CLIENT_KEY=xxx

# Keep this (server-only):
ABLY_API_KEY=xxx

# Add rate limit configs:
RATE_LIMIT_LOGIN=5
RATE_LIMIT_SIGNUP=3
RATE_LIMIT_API=100
```

**Step 3**: Implement Ably Token Auth
Create `/app/api/ably/token/route.ts` (see fix #1 above)

**Step 4**: Update Ably client
Modify `/lib/ably.ts` to use token authentication instead of API key

**Step 5**: Test Everything
```bash
# Test rate limiting
for i in {1..10}; do curl http://localhost:3000/api/auth/login; done

# Test sanitization
curl -X POST http://localhost:3000/api/auth/login \
  -d '{"email": {"$ne": null}, "password": "test"}'

# Check security headers
curl -I http://localhost:3000/api/health
```

---

## 💰 Cost Analysis for Scale

### Current (Development)
- Vercel: Free (Hobby)
- MongoDB: Free (M0)
- Ably: Free (200 connections)
- **Total**: $0/month

### Small Scale (100-500 users)
- Vercel: Free or $20/month (Pro)
- MongoDB: Free or $57/month (M10)
- Ably: Free or $29/month (Standard)
- **Total**: $0 - $106/month

### Medium Scale (1000-5000 users)
- Vercel: $20/month (Pro)
- MongoDB: $57/month (M10)
- Ably: $29/month (Standard)
- Sentry: $26/month (Team)
- **Total**: ~$132/month

### Large Scale (10,000+ users)
- Vercel: $20/month (Pro)
- MongoDB: $270/month (M30)
- Ably: $299/month (Pro)
- Sentry: $80/month (Business)
- CDN/Cache: $50/month (Redis)
- **Total**: ~$719/month

---

## ✅ What's Already Secure

1. ✅ Password hashing with bcrypt
2. ✅ JWT-based authentication
3. ✅ Password reset token hashing
4. ✅ Email validation
5. ✅ CORS configuration (basic)
6. ✅ MongoDB connection security
7. ✅ HTTPS in production (Vercel)
8. ✅ Environment variable separation

---

## 📚 Additional Resources

### Security Best Practices
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- JWT Security: https://jwt.io/introduction
- MongoDB Security: https://docs.mongodb.com/manual/security/

### Monitoring Tools
- Sentry: https://sentry.io
- LogRocket: https://logrocket.com
- Datadog: https://www.datadoghq.com

### Rate Limiting (Redis-based for production)
```bash
npm install ioredis express-rate-limit rate-limit-redis
```

---

## 🎯 Final Recommendations

### Priority Order
1. 🔴 **Fix Ably key exposure** (2-4 hours) - CRITICAL
2. 🔴 **Add rate limiting** (1-2 hours) - CRITICAL
3. 🟡 **Add input sanitization** (1 hour) - HIGH
4. 🟡 **Add security headers** (30 min) - HIGH
5. 🟡 **Implement refresh tokens** (4-6 hours) - MEDIUM
6. 🟢 **Add logging** (2-3 hours) - MEDIUM
7. 🟢 **Upgrade MongoDB** (when needed) - LOW

### Total Implementation Time
- **Critical fixes**: 4-6 hours
- **High priority**: 1.5 hours
- **Medium priority**: 6-9 hours
- **Total**: 12-16 hours of development work

### Estimated Security Score
- **Current**: 4/10 (Multiple critical vulnerabilities)
- **After critical fixes**: 7/10 (Production-ready)
- **After all fixes**: 9/10 (Enterprise-grade)

---

## 📄 Conclusion

QuestEd has a solid foundation with proper password security and basic authentication. However, **critical security gaps** exist that must be addressed before handling real users at scale:

1. **Ably API key is publicly exposed** - immediate security risk
2. **No rate limiting** - vulnerable to brute force and DDoS
3. **Missing input sanitization** - NoSQL injection possible
4. **No security headers** - vulnerable to XSS and clickjacking

All necessary middleware has been created and is ready to integrate. The architecture can scale to 10,000+ users with proper infrastructure upgrades (MongoDB M30 + Ably Pro).

**Recommendation**: Spend 4-6 hours implementing critical fixes before public launch.

---

**Generated**: November 1, 2025  
**Next Review**: After critical fixes implementation
