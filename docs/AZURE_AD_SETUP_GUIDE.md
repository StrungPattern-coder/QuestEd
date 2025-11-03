# Azure AD App Registration - Step-by-Step Visual Guide

## 📋 Before You Start

You need:
- Microsoft account with Azure AD access
- Your production URL: `https://quest-ed-phi.vercel.app`
- 10 minutes of time

---

## Step 1: Go to Azure Portal

**URL**: https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade

Click **"+ New registration"**

---

## Step 2: Fill Registration Form

### Name Field
```
QuestEd
```

### Supported account types
Select the **THIRD option** (very important!):
```
☐ Accounts in this organizational directory only
☐ Accounts in any organizational directory
☑ Accounts in any organizational directory AND personal Microsoft accounts
☐ Personal Microsoft accounts only
```

### Redirect URI
- **Platform**: Select "Web" from dropdown
- **URI**: Enter **ONE** of these (you'll add the other later):

**For Production:**
```
https://quest-ed-phi.vercel.app/api/teams/auth/callback
```

**For Local Development:**
```
http://localhost:3000/api/teams/auth/callback
```

💡 **Tip**: Start with production URI, then add local dev URI in Step 8.

Click **"Register"** button at the bottom.

---

## Step 3: Copy Your Client ID

After registration, you'll see the Overview page.

**Look for**: "Application (client) ID"

**Copy this value** - it looks like:
```
12345678-1234-1234-1234-123456789abc
```

Save it somewhere safe - you'll need it for your `.env` file.

---

## Step 4: Add API Permissions

### 4.1 Click "API permissions" in left sidebar

### 4.2 Click "+ Add a permission"

### 4.3 Click "Microsoft Graph"

### 4.4 Click "Delegated permissions"

### 4.5 Search and add these permissions (one by one):

| Permission Name | What to Type | What it Does |
|----------------|-------------|--------------|
| `User.Read` | "user.read" | Read signed-in user's profile |
| `Team.ReadBasic.All` | "team.readbasic" | Read team names |
| `TeamMember.Read.All` | "teammember.read" | Read team members |
| `Channel.ReadBasic.All` | "channel.readbasic" | Read channel names |
| `ChannelMessage.Send` | "channelmessage.send" | Post messages to channels |
| `Calendars.ReadWrite` | "calendars.readwrite" | Create Teams meetings |
| `EduAssignments.ReadBasic` | "eduassignments" | Read education assignments |
| `EduRoster.ReadBasic` | "eduroster" | Read education rosters |
| `offline_access` | "offline" | Maintain access to data |

**How to add each permission:**
1. Type permission name in search box
2. Check the checkbox next to it
3. Click "Add permissions" at bottom
4. Repeat for all 9 permissions

### 4.6 Grant Admin Consent (Optional but Recommended)

If you're an admin or have admin rights:
- Click **"Grant admin consent for [Your Organization]"**
- Click "Yes" to confirm

If you're not an admin:
- Skip this step
- Users will be prompted to consent when they first connect

---

## Step 5: Create Client Secret

### 5.1 Click "Certificates & secrets" in left sidebar

### 5.2 Click "+ New client secret"

### 5.3 Fill in:
- **Description**: `QuestEd Integration`
- **Expires**: Select "24 months" (recommended)

### 5.4 Click "Add"

### 5.5 **IMMEDIATELY** Copy the Value

⚠️ **CRITICAL**: You'll see two columns:
- "Secret ID" (ignore this)
- **"Value"** ← Copy THIS one!

The value looks like:
```
AbC123XyZ~456-789_qwErTy
```

**This is shown ONLY ONCE!** If you lose it, you'll need to create a new secret.

Save it somewhere secure - you'll need it for your `.env` file.

---

## Step 6: Configure Vercel Environment Variables

### 6.1 Go to Vercel Dashboard

**URL**: https://vercel.com/dashboard

### 6.2 Select your QuestEd project

Click on your "quest-ed-phi" project

### 6.3 Go to Settings → Environment Variables

Click "Settings" tab → "Environment Variables" in sidebar

### 6.4 Add These Variables

Click "Add New" for each:

**Variable 1:**
- Key: `MICROSOFT_CLIENT_ID`
- Value: `[paste your Application (client) ID from Step 3]`
- Environments: ☑ Production ☑ Preview ☑ Development

**Variable 2:**
- Key: `MICROSOFT_CLIENT_SECRET`
- Value: `[paste your secret Value from Step 5]`
- Environments: ☑ Production ☑ Preview ☑ Development

**Variable 3:**
- Key: `NEXT_PUBLIC_APP_URL`
- Value: `https://quest-ed-phi.vercel.app`
- Environments: ☑ Production ☑ Preview

**Variable 4 (for local dev):**
- Key: `NEXT_PUBLIC_APP_URL`
- Value: `http://localhost:3000`
- Environments: ☑ Development

### 6.5 Redeploy

After adding variables:
1. Go to "Deployments" tab
2. Click "..." on latest deployment
3. Click "Redeploy"

---

## Step 7: Configure Local Development

### 7.1 Create `.env.local` file

In your QuestEd project folder, create `.env.local`:

```bash
# Microsoft Teams Integration
MICROSOFT_CLIENT_ID=your-client-id-from-step-3
MICROSOFT_CLIENT_SECRET=your-secret-value-from-step-5
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Other env vars (copy from .env)
MONGO_URI=...
JWT_SECRET=...
# ... etc
```

### 7.2 Restart development server

```bash
npm run dev
```

---

## Step 8: Add Multiple Redirect URIs (Recommended)

To use the same Azure AD app for BOTH production and local development:

### 8.1 Go back to Azure AD app

### 8.2 Click "Authentication" in left sidebar

### 8.3 Under "Web" section → "Redirect URIs"

Click "+ Add URI"

### 8.4 Add the other URI

If you added production URI in Step 2, now add local dev:
```
http://localhost:3000/api/teams/auth/callback
```

If you added local dev URI in Step 2, now add production:
```
https://quest-ed-phi.vercel.app/api/teams/auth/callback
```

### 8.5 Click "Save" at top

Now you should have BOTH URIs:
- ✅ `https://quest-ed-phi.vercel.app/api/teams/auth/callback`
- ✅ `http://localhost:3000/api/teams/auth/callback`

---

## Step 9: Test the Integration

### 9.1 On Production (quest-ed-phi.vercel.app)

1. Go to https://quest-ed-phi.vercel.app
2. Log in as a teacher
3. Go to Dashboard → Settings → Integrations
4. Click "Connect Microsoft Teams"
5. Choose "Work or School" or "Personal"
6. Sign in with your Microsoft account
7. Grant permissions
8. You should be redirected back to QuestEd dashboard

### 9.2 On Local Development (localhost:3000)

1. Go to http://localhost:3000
2. Follow same steps as above
3. Should work identically

### 9.3 Test Sync

After connecting:
1. Click **"Sync from Teams"** button
2. Wait 10-30 seconds
3. You should see:
   ```
   ✅ Sync Completed!
   ✅ Created X new classrooms
   ✅ Added Y new students
   ```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Azure AD app shows "Multi-tenant + Personal accounts"
- [ ] All 9 API permissions are listed
- [ ] Client secret is saved securely
- [ ] Both redirect URIs are added (production + local)
- [ ] Vercel environment variables are set
- [ ] Production deployment completed
- [ ] OAuth flow works on production
- [ ] OAuth flow works on localhost
- [ ] Sync button works
- [ ] Students are imported correctly

---

## 🐛 Troubleshooting

### "Redirect URI mismatch" error

**Problem**: The callback URL doesn't match Azure AD configuration

**Solution**:
1. Check "Authentication" page in Azure AD
2. Verify exact URL is added (including `/api/teams/auth/callback`)
3. Check for typos: `http` vs `https`, trailing slashes, etc.
4. Make sure `NEXT_PUBLIC_APP_URL` in Vercel matches exactly

### "Invalid client secret" error

**Problem**: Client secret is wrong or expired

**Solution**:
1. Go to "Certificates & secrets" in Azure AD
2. Check if secret is expired
3. Create new client secret
4. Update `MICROSOFT_CLIENT_SECRET` in Vercel
5. Redeploy

### "Permissions not granted" error

**Problem**: Missing API permissions or consent not given

**Solution**:
1. Go to "API permissions" in Azure AD
2. Verify all 9 permissions are listed
3. Try "Grant admin consent" button
4. Or: User needs to manually consent during OAuth flow

### OAuth works locally but not on production

**Problem**: Environment variables not set in Vercel

**Solution**:
1. Go to Vercel → Settings → Environment Variables
2. Verify all 3 Teams variables are set for Production
3. Redeploy after adding/updating

### Students not getting created during sync

**Problem**: Missing education permissions or not using Teams for Education

**Solution**:
1. Verify `EduRoster.ReadBasic` permission is granted
2. If personal Teams: Education features may not be available
3. Check console for specific error messages

---

## 📞 Need Help?

- **Azure AD Issues**: [Microsoft Support](https://learn.microsoft.com/en-us/azure/active-directory/)
- **Vercel Issues**: [Vercel Documentation](https://vercel.com/docs)
- **QuestEd Issues**: Check GitHub Issues or documentation

---

## 🎉 Success!

If everything works, you should be able to:
1. ✅ Connect Microsoft Teams account
2. ✅ Sync all your Teams classrooms
3. ✅ Import all students automatically
4. ✅ Post quiz results to Teams channels
5. ✅ Create Teams meetings from QuestEd

Your Microsoft Teams integration is now live! 🚀
