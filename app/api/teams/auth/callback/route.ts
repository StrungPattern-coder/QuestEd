import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import TeamsIntegration from '@/backend/models/TeamsIntegration';
import {
  exchangeCodeForToken,
  MicrosoftGraphClient,
} from '@/backend/utils/microsoftGraph';

/**
 * GET /api/teams/auth/callback
 * Handle OAuth callback from Microsoft
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Check for errors from Microsoft
    if (error) {
      console.error('Microsoft OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?teams_error=${encodeURIComponent(errorDescription || error)}`
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?teams_error=Missing+authorization+code+or+state`
      );
    }

    // Decode and validate state
    let stateData: any;
    try {
      const decodedState = Buffer.from(state, 'base64').toString('utf-8');
      stateData = JSON.parse(decodedState);

      // Verify state is not too old (5 minutes max)
      const stateAge = Date.now() - stateData.timestamp;
      if (stateAge > 5 * 60 * 1000) {
        throw new Error('State expired');
      }
    } catch (err) {
      console.error('Invalid state:', err);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?teams_error=Invalid+state+parameter`
      );
    }

    await connectDB();

    // Exchange code for tokens
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/teams/auth/callback`;
    const tokenResponse = await exchangeCodeForToken(code, redirectUri);

    // Get user profile from Microsoft Graph
    const graphClient = new MicrosoftGraphClient(tokenResponse.access_token);
    const userProfile = await graphClient.getUserProfile();

    // Calculate token expiration
    const tokenExpiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);

    // Check if integration already exists
    const existingIntegration = await TeamsIntegration.findOne({
      userId: stateData.userId,
    });

    if (existingIntegration) {
      // Update existing integration
      existingIntegration.microsoftUserId = userProfile.id;
      existingIntegration.accountType = userProfile.accountType;
      existingIntegration.email = userProfile.mail;
      existingIntegration.displayName = userProfile.displayName;
      existingIntegration.accessToken = tokenResponse.access_token;
      existingIntegration.refreshToken = tokenResponse.refresh_token;
      existingIntegration.tokenExpiresAt = tokenExpiresAt;
      existingIntegration.tenantId = userProfile.id; // Use user ID as tenant identifier
      existingIntegration.scopes = tokenResponse.scope.split(' ');
      existingIntegration.isActive = true;
      existingIntegration.lastSyncAt = new Date();

      await existingIntegration.save();
    } else {
      // Create new integration
      await TeamsIntegration.create({
        userId: stateData.userId,
        microsoftUserId: userProfile.id,
        accountType: userProfile.accountType,
        email: userProfile.mail,
        displayName: userProfile.displayName,
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        tokenExpiresAt: tokenExpiresAt,
        tenantId: userProfile.id,
        scopes: tokenResponse.scope.split(' '),
        isActive: true,
        connectedAt: new Date(),
        lastSyncAt: new Date(),
      });
    }

    // Redirect to dashboard with success message
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?teams_connected=true`
    );
  } catch (error: any) {
    console.error('Error handling Teams callback:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?teams_error=${encodeURIComponent(error.message || 'Authentication failed')}`
    );
  }
}
