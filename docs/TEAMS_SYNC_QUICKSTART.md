# Microsoft Teams Sync - Quick Start Guide

## 🎯 What This Does

When you connect your Microsoft Teams account and click **"Sync from Teams"**, QuestEd will automatically:

✅ **Import all your Teams classrooms** into QuestEd  
✅ **Create student accounts** for all members in your Teams  
✅ **Preserve classroom relationships** (which students belong to which class)  
✅ **Import assignment information** (if available)  
✅ **Set up automatic notifications** to Teams channels  

## 📝 Azure AD App Registration (One-Time Setup)

### Step 1: Register Your App

1. Go to [Azure Portal - App Registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Click **"New registration"**
3. Fill in:
   - **Name**: `QuestEd` (or your preferred name)
   - **Supported account types**: Select **"Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts"**
   - **Redirect URI**: 
     - Platform: **Web**
     - URI (choose based on environment):
       - **Production**: `https://quest-ed-phi.vercel.app/api/teams/auth/callback`
       - **Local dev**: `http://localhost:3000/api/teams/auth/callback`
       - **Note**: You can add multiple redirect URIs later for different environments
4. Click **"Register"**

### Step 2: Configure Permissions

1. In your app, go to **"API permissions"**
2. Click **"Add a permission"** → **"Microsoft Graph"** → **"Delegated permissions"**
3. Add these permissions (search for each):
   - ✅ `User.Read`
   - ✅ `Team.ReadBasic.All`
   - ✅ `TeamMember.Read.All`
   - ✅ `Channel.ReadBasic.All`
   - ✅ `ChannelMessage.Send`
   - ✅ `Calendars.ReadWrite`
   - ✅ `EduAssignments.ReadBasic`
   - ✅ `EduRoster.ReadBasic`
   - ✅ `offline_access`
4. Click **"Add permissions"**
5. (Optional) Click **"Grant admin consent for [Your Organization]"** if you have admin rights

### Step 3: Create Client Secret

1. Go to **"Certificates & secrets"**
2. Click **"New client secret"**
3. Description: `QuestEd Integration`
4. Expires: **24 months** (recommended)
5. Click **"Add"**
6. **⚠️ IMPORTANT**: Copy the secret **VALUE** immediately (not the Secret ID)

### Step 4: Get Your Client ID

1. Go to **"Overview"**
2. Copy the **"Application (client) ID"**

### Step 5: Configure QuestEd

Add to your `.env` file (or Vercel environment variables for production):

**For Production (Vercel):**
```bash
MICROSOFT_CLIENT_ID=your-application-client-id-here
MICROSOFT_CLIENT_SECRET=your-client-secret-value-here
NEXT_PUBLIC_APP_URL=https://quest-ed-phi.vercel.app
```

**For Local Development:**
```bash
MICROSOFT_CLIENT_ID=your-application-client-id-here
MICROSOFT_CLIENT_SECRET=your-client-secret-value-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Setting Environment Variables in Vercel:**
1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add each variable with the production values
4. Redeploy your application

Restart your development server:
```bash
npm run dev
```

### Step 6: Add Multiple Redirect URIs (Optional but Recommended)

To use the same Azure AD app for both local development AND production:

1. Go back to your Azure AD app
2. Click **"Authentication"** in the sidebar
3. Under "Web" → "Redirect URIs", click **"Add URI"**
4. Add both:
   - ✅ `https://quest-ed-phi.vercel.app/api/teams/auth/callback` (Production)
   - ✅ `http://localhost:3000/api/teams/auth/callback` (Local dev)
5. Click **"Save"**

Now the same app works in both environments!

## 🚀 Using the Integration

### For Teachers

#### 1. Connect Your Account

1. Log in to QuestEd
2. Go to **Dashboard** → **Settings** → **Integrations**
3. Find "Microsoft Teams Integration"
4. Click **"Connect Microsoft Teams"**
5. Choose your account type:
   - **Work or School**: For organization accounts (college email)
   - **Personal**: For outlook.com/hotmail.com/live.com
6. Sign in with your Microsoft account
7. Grant all requested permissions
8. You'll be redirected back to QuestEd

#### 2. Import Your Teams Data

1. After connecting, you'll see a **"Sync from Teams"** button
2. Click it and confirm
3. QuestEd will:
   - Find all your Teams classes
   - Import all students
   - Create classrooms in QuestEd
   - Match up all relationships
4. Wait for the sync to complete (usually 10-30 seconds)
5. You'll see a summary:
   ```
   ✅ Created 3 new classrooms
   ✅ Updated 2 existing classrooms
   ✅ Added 45 new students
   ```
6. Page will auto-reload

#### 3. What Happens to Students?

**New Students:**
- Auto-created with their Teams name and email
- Receive temporary random password
- Marked as "needs password reset"
- Should receive email invitation (if email configured)
- Must reset password on first login

**Existing Students:**
- If email already exists in QuestEd, they're added to new classrooms
- No duplicate accounts created

#### 4. Classroom Mapping

Each Teams class becomes a QuestEd classroom:
- **Name**: Same as Teams class name
- **Description**: "Synced from Microsoft Teams: [Class Name]"
- **Students**: All Team members (except owners)
- **Teacher**: You (the person who synced)
- **Join Code**: Auto-generated
- **Teams Link**: Preserved for reference

## 📊 What Gets Synced

| Microsoft Teams | QuestEd |
|----------------|---------|
| Team (class) | Classroom |
| Team members (students) | Student accounts |
| Team owners | Not imported (you're the teacher) |
| Team name | Classroom name |
| Team description | Classroom description |
| Assignments | Metadata only (stored for reference) |

## 🔄 Re-Syncing

You can sync multiple times:
- **New classrooms**: Will be created
- **Existing classrooms**: Will be updated with new students
- **New students**: Will be added
- **Removed students**: Must be manually removed in QuestEd

## ⚠️ Important Notes

### For Organizational Accounts

If you're using your college/school email:
- Your IT admin may need to approve the app
- Some organizations require admin consent for API permissions
- Contact your IT department if you can't grant permissions

### For Personal Accounts

- Personal accounts can only access Teams where you're a member
- May not have access to education-specific features (EduAssignments)
- Works great for personal Teams groups

### Security

- All student passwords are randomly generated and hashed
- Students **must** reset password on first login
- Microsoft tokens are encrypted in database
- No passwords are stored in plain text

### Email Notifications

For students to receive login credentials:
1. Configure email in `.env` (SMTP settings)
2. Students will get "Welcome to QuestEd" email with instructions
3. If email not configured, you'll need to share login info manually

## 🐛 Troubleshooting

### "Failed to sync Teams data"

**Possible causes:**
- Token expired → Try disconnecting and reconnecting
- Missing permissions → Check Azure AD permissions granted
- Network issue → Check console for errors

**Solution:**
1. Disconnect Teams integration
2. Reconnect and grant all permissions
3. Try sync again

### "No teams found"

**Possible causes:**
- You're not a member of any Teams
- Missing `Team.ReadBasic.All` permission
- Organizational restrictions

**Solution:**
1. Join at least one Team in Microsoft Teams
2. Verify permissions in Azure AD
3. Contact IT if organizational account

### Students not receiving emails

**Possible causes:**
- Email not configured in `.env`
- SMTP credentials incorrect
- Firewall blocking SMTP

**Solution:**
1. Check email configuration in `.env`
2. Test with `test-email.js` script
3. See [Email Setup Guide](./EMAIL_QUICKSTART.md)

### Duplicate students

**Possible causes:**
- Student email slightly different (case, spacing)
- Student changed email in Teams

**Solution:**
- QuestEd matches by email (case-insensitive)
- Manually remove duplicates if needed
- Re-sync will skip existing emails

## 📞 Support

**For Azure AD/Teams issues:**
- [Microsoft Graph Support](https://learn.microsoft.com/en-us/graph/support)
- [Azure AD Documentation](https://learn.microsoft.com/en-us/azure/active-directory/)

**For QuestEd issues:**
- Check [Full Documentation](./TEAMS_INTEGRATION.md)
- Open GitHub Issue
- Check console logs for errors

## 🎓 Example: Teacher Workflow

1. **Monday morning**: Connect Teams account in QuestEd
2. **Monday 9:00 AM**: Click "Sync from Teams"
3. **Monday 9:01 AM**: 45 students auto-imported, 3 classrooms created
4. **Monday 10:00 AM**: Create quiz in QuestEd
5. **Monday 11:00 AM**: Assign quiz to Teams-synced classroom
6. **Monday 2:00 PM**: Students complete quiz (auto-login with Teams email)
7. **Monday 3:00 PM**: Share results to Teams channel with one click

## ✨ Benefits

✅ **No manual data entry** - Import everything at once  
✅ **Automatic student accounts** - No signup friction  
✅ **Preserved relationships** - Students stay in their classes  
✅ **Single source of truth** - Teams is your master data  
✅ **Easy updates** - Re-sync anytime to add new students  
✅ **Two-way integration** - Post results back to Teams  

---

**Ready to get started?** Follow the Azure AD setup above, then connect your Teams account in QuestEd!
