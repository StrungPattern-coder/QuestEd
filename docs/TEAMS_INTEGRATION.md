# Microsoft Teams Integration

QuestEd includes a secure Microsoft Teams integration that allows teachers to share quiz results, announcements, and notifications directly to Teams channels. The integration supports **both personal Microsoft accounts and organizational (work/school) accounts**.

## Features

✅ **OAuth 2.0 Authentication** - Secure authorization flow with CSRF protection  
✅ **Multi-Account Support** - Personal, work, and school Microsoft accounts  
✅ **Automatic Token Refresh** - Seamless reconnection without user intervention  
✅ **Full Data Synchronization** - Import Teams classrooms, students, and assignments  
✅ **Team & Channel Management** - Browse and select Teams and channels  
✅ **Message Posting** - Send simple messages or rich adaptive cards  
✅ **Meeting Creation** - Create Teams meetings for live sessions  
✅ **Encrypted Storage** - Access and refresh tokens stored securely

## Setup Instructions

### 1. Register Azure AD Application

1. Go to [Azure Portal - App Registrations](https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade)
2. Click **"New registration"**
3. Configure:
   - **Name**: QuestEd (or your preferred name)
   - **Supported account types**: "Accounts in any organizational directory and personal Microsoft accounts"
   - **Redirect URI**: 
     - Platform: Web
     - URI (for production): `https://quest-ed-phi.vercel.app/api/teams/auth/callback`
     - URI (for local dev): `http://localhost:3000/api/teams/auth/callback`
     - **TIP**: You can add multiple redirect URIs in the "Authentication" section later

### 2. Configure API Permissions

1. In your app registration, go to **"API permissions"**
2. Click **"Add a permission"** → **"Microsoft Graph"** → **"Delegated permissions"**
3. Add the following permissions:
   - `User.Read` - Read user profile
   - `Team.ReadBasic.All` - Read team names
   - `TeamMember.Read.All` - Read team members
   - `Channel.ReadBasic.All` - Read channel names
   - `ChannelMessage.Send` - Post messages to channels
   - `Calendars.ReadWrite` - Create meetings
   - `EduAssignments.ReadBasic` - Read education assignments
   - `EduRoster.ReadBasic` - Read education rosters
   - `offline_access` - Maintain access via refresh tokens
4. Click **"Add permissions"**
5. (Optional) Click **"Grant admin consent"** if you have admin rights

### 3. Create Client Secret

1. Go to **"Certificates & secrets"**
2. Click **"New client secret"**
3. Add description: "QuestEd Integration"
4. Select expiration: 24 months (or as needed)
5. Click **"Add"**
6. **⚠️ Copy the secret value immediately** (it won't be shown again)

### 4. Configure Environment Variables

Add to your `.env` file:

```bash
# Microsoft Teams Integration
MICROSOFT_CLIENT_ID=your-application-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret-value
NEXT_PUBLIC_APP_URL=https://quest-ed-phi.vercel.app  # Production
# or for local development:
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Finding your Client ID:**
- Go to app registration **"Overview"** page
- Copy the **"Application (client) ID"**

### 5. Restart Application

```bash
npm run dev
```

## Usage

### For Teachers

1. **Connect Teams Account:**
   - Go to Dashboard → Settings → Integrations
   - Click **"Connect Microsoft Teams"**
   - Choose account type:
     - **Work or School** - For organizational accounts
     - **Personal** - For outlook.com, hotmail.com, live.com accounts
   - Sign in with your Microsoft account
   - Grant requested permissions

2. **Import Your Teams Data:**
   - After connecting, click **"Sync from Teams"**
   - This will automatically:
     - Import all your Microsoft Teams classrooms
     - Create QuestEd classrooms for each Teams class
     - Add all students from Teams to QuestEd
     - Import assignment information (if available)
   - Students will receive temporary passwords and need to reset on first login
   - All classroom relationships are preserved

3. **Select Default Channel:**
   - Choose a Team from the dropdown
   - Select a Channel where notifications will be posted
   - Click **"Send Test Notification"** to verify connection

4. **Post Announcements:**
   - When creating announcements, check "Post to Teams"
   - Messages will automatically appear in your selected channel

5. **Share Test Results:**
   - After students complete a test, click "Share to Teams"
   - Results summary will be posted with formatting

### For Students

- Students synced from Teams will receive an email with their temporary password
- They must reset their password on first login
- All their Teams classroom memberships are automatically set up in QuestEd
- They can view if Teams integration is active

## Security Features

### 🔐 OAuth 2.0 with State Parameter
- CSRF protection using base64-encoded state with timestamp and nonce
- State expires after 5 minutes
- Validates state before exchanging tokens

### 🔒 Encrypted Token Storage
- Access tokens marked `select: false` in database schema
- Never exposed in API responses
- Stored with encryption at rest

### 🔄 Automatic Token Refresh
- Tokens checked before each API call
- Automatic refresh if expired
- No user intervention required

### 🛡️ JWT Authentication
- All API endpoints require valid JWT token
- User authentication validated on every request

### 🌐 Tenant: Common
- Supports all account types (personal, work, school)
- No tenant lock-in

## API Endpoints

### Authentication

**Initiate OAuth Flow**
```
GET /api/teams/auth/initiate
Authorization: Bearer {jwt_token}

Response:
{
  "authUrl": "https://login.microsoftonline.com/...",
  "state": "base64_encoded_state"
}
```

**OAuth Callback**
```
GET /api/teams/auth/callback?code={code}&state={state}

Redirects to:
- Success: /dashboard?teams_connected=true
- Error: /dashboard?teams_error={error_message}
```

### Integration Management

**Get Status**
```
GET /api/teams/integration/status
Authorization: Bearer {jwt_token}

Response:
{
  "connected": true,
  "needsRefresh": false,
  "integration": {
    "accountType": "work",
    "displayName": "John Doe",
    "email": "john@example.com",
    "connectedAt": "2025-01-01T00:00:00.000Z",
    "lastSyncAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Disconnect**
```
DELETE /api/teams/integration/status
Authorization: Bearer {jwt_token}

Response:
{
  "success": true
}
```

**Sync Teams Data**
```
POST /api/teams/sync
Authorization: Bearer {jwt_token}

Response:
{
  "success": true,
  "message": "Successfully synced Microsoft Teams data",
  "results": {
    "classroomsCreated": 3,
    "classroomsUpdated": 2,
    "studentsAdded": 45,
    "errors": []
  },
  "totalClasses": 5
}
```

### Teams & Channels

**List Teams**
```
GET /api/teams/integration/teams
Authorization: Bearer {jwt_token}

Response:
{
  "teams": [
    {
      "id": "team-id",
      "displayName": "My Team",
      "description": "Team description"
    }
  ]
}
```

**List Channels**
```
GET /api/teams/integration/channels?teamId={teamId}
Authorization: Bearer {jwt_token}

Response:
{
  "channels": [
    {
      "id": "channel-id",
      "displayName": "General",
      "description": "Channel description"
    }
  ]
}
```

### Messaging

**Post Message**
```
POST /api/teams/integration/post-message
Authorization: Bearer {jwt_token}
Content-Type: application/json

Body:
{
  "teamId": "team-id",
  "channelId": "channel-id",
  "message": "Hello from QuestEd!",
  "title": "Quiz Notification",  // Optional
  "buttons": [                    // Optional
    {
      "title": "View Results",
      "url": "https://app.com/results/123"
    }
  ]
}

Response:
{
  "success": true
}
```

## Account Type Detection

The system automatically detects account type based on email domain:

| Domain Pattern | Account Type |
|---------------|-------------|
| @outlook.com, @hotmail.com, @live.com | Personal |
| .edu, .ac. (e.g., .ac.uk) | School |
| All others | Work |

## Troubleshooting

### "Failed to initiate connection"

**Possible Causes:**
- Missing or incorrect `MICROSOFT_CLIENT_ID` in .env
- Invalid redirect URI in Azure AD app registration
- JWT token expired or missing

**Solutions:**
- Verify environment variables are set correctly
- Ensure redirect URI matches exactly: `{NEXT_PUBLIC_APP_URL}/api/teams/auth/callback`
- Re-login to QuestEd to refresh JWT token

### "Token refresh failed"

**Possible Causes:**
- Refresh token expired (typically after 90 days)
- User revoked permissions
- Client secret expired in Azure AD

**Solutions:**
- Disconnect and reconnect Teams integration
- Check client secret expiration in Azure Portal
- Regenerate client secret if expired

### "No teams found"

**Possible Causes:**
- User is not a member of any Teams
- Missing Team.ReadBasic.All permission
- Permissions not granted by admin (for org accounts)

**Solutions:**
- Ensure user has at least one Team membership
- Verify API permissions in Azure AD
- Request admin consent for organizational accounts

### "Failed to post message"

**Possible Causes:**
- Missing ChannelMessage.Send permission
- User doesn't have posting rights in the channel
- Token expired and refresh failed

**Solutions:**
- Verify ChannelMessage.Send permission is granted
- Check user's role in the Team/Channel
- Disconnect and reconnect integration

## Code Examples

### Frontend: Using the Teams API Client

```typescript
import { teamsApi } from '@/lib/teamsApi';

// Check connection status
const status = await teamsApi.getStatus();
if (status.connected) {
  console.log('Connected as:', status.integration.displayName);
}

// Initiate OAuth flow
const { authUrl } = await teamsApi.initiateAuth();
window.location.href = authUrl;

// Get teams
const teams = await teamsApi.getTeams();

// Get channels for a team
const channels = await teamsApi.getChannels(teamId);

// Post a simple message
await teamsApi.postMessage({
  teamId,
  channelId,
  message: 'Test completed!'
});

// Post a rich card with button
await teamsApi.postMessage({
  teamId,
  channelId,
  message: 'Quiz results are ready',
  title: '📊 Quiz Results',
  buttons: [
    {
      title: 'View Results',
      url: 'https://app.com/results/123'
    }
  ]
});

// Disconnect
await teamsApi.disconnect();
```

### Backend: Using Microsoft Graph Client

```typescript
import { MicrosoftGraphClient } from '@/backend/utils/microsoftGraph';

// Create client with access token
const client = new MicrosoftGraphClient(accessToken);

// Get user profile
const profile = await client.getUserProfile();

// Get teams
const teams = await client.getUserTeams();

// Get channels
const channels = await client.getTeamChannels(teamId);

// Post simple message
await client.postMessageToChannel(teamId, channelId, 'Hello!');

// Post rich card
await client.postCardToChannel(
  teamId,
  channelId,
  'Quiz Notification',
  'A new quiz is available',
  [{ title: 'Start Quiz', url: 'https://app.com/quiz/456' }]
);

// Create meeting
await client.createMeeting(
  'Live Quiz Session',
  '2025-02-01T10:00:00Z',
  '2025-02-01T11:00:00Z',
  ['student1@example.com', 'student2@example.com']
);
```

## Production Checklist

Before deploying to production:

### Azure AD Configuration
- [ ] Azure AD app registered with correct name
- [ ] **Redirect URI added**: `https://quest-ed-phi.vercel.app/api/teams/auth/callback`
- [ ] (Optional) Local dev URI also added: `http://localhost:3000/api/teams/auth/callback`
- [ ] All 9 API permissions granted
- [ ] Client secret created and copied
- [ ] Client ID copied

### Vercel Environment Variables
- [ ] Add `MICROSOFT_CLIENT_ID` to Vercel env vars
- [ ] Add `MICROSOFT_CLIENT_SECRET` to Vercel env vars
- [ ] Set `NEXT_PUBLIC_APP_URL=https://quest-ed-phi.vercel.app`
- [ ] Redeploy application after adding env vars

### Testing
- [ ] Test OAuth flow with personal account on production
- [ ] Test OAuth flow with organizational account on production
- [ ] Test sync functionality on production
- [ ] Verify callback redirects to correct domain
- [ ] Test with different Microsoft account types
- [ ] Verify email notifications work (if configured)

### Security
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Client secret stored securely (never committed to git)
- [ ] Rate limiting configured (if needed)
- [ ] Token refresh working correctly

### Documentation
- [ ] Internal team knows how to use Teams integration
- [ ] Teachers have guide for syncing classrooms
- [ ] Support contact info available
- [ ] Error messages are user-friendly

### Monitoring (Optional)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Monitor token refresh failures
- [ ] Track sync success/failure rates
- [ ] Set up alerts for API errors

## Best Practices

### 1. Token Management
- Always check token expiration before API calls
- Let the system handle automatic refresh
- Don't store tokens in localStorage or frontend code

### 2. Error Handling
- Implement retry logic for transient errors
- Prompt user to reconnect if refresh fails
- Show clear error messages to users

### 3. User Experience
- Test notification feature to verify connection
- Cache teams/channels list to reduce API calls
- Show loading states during API operations

### 4. Security
- Never log access tokens or refresh tokens
- Validate state parameter on OAuth callback
- Use HTTPS in production (required by Microsoft)
- Rotate client secrets regularly

### 5. Performance
- Fetch teams list only when needed
- Cache channel list per team
- Use lastSyncAt to determine if data needs refresh

## Production Checklist

Before deploying to production:

- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Update Azure AD redirect URI to production callback URL
- [ ] Enable HTTPS (required by Microsoft OAuth)
- [ ] Set client secret expiration reminder
- [ ] Request admin consent for organizational accounts (if applicable)
- [ ] Test with all account types (personal, work, school)
- [ ] Implement monitoring for token refresh failures
- [ ] Set up alerts for API errors
- [ ] Document internal procedures for users needing help

## Resources

- [Microsoft Graph API Documentation](https://learn.microsoft.com/en-us/graph/overview)
- [Azure AD App Registration Guide](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Microsoft Teams API Reference](https://learn.microsoft.com/en-us/graph/api/resources/teams-api-overview)
- [OAuth 2.0 Authorization Code Flow](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)

## Support

For issues specific to QuestEd integration:
- Check this documentation first
- Review error messages in browser console
- Check server logs for API errors

For Microsoft-specific issues:
- [Microsoft Graph Support](https://learn.microsoft.com/en-us/graph/support)
- [Azure AD Support](https://azure.microsoft.com/en-us/support/community/)
