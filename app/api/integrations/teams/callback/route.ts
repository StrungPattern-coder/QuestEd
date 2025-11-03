import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/backend/utils/db';
import TeamsIntegration from '@/backend/models/TeamsIntegration';
import { teamsService } from '@/backend/utils/teamsService';
import { encrypt } from '@/backend/utils/encryption';

export const dynamic = 'force-dynamic';

/**
 * GET /api/integrations/teams/callback
 * Handle Microsoft OAuth callback
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?teams_error=${encodeURIComponent(error)}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?teams_error=missing_params`
      );
    }

    // Decode and verify state
    let stateData: any;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
    } catch (e) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?teams_error=invalid_state`
      );
    }

    const { userId, accountType, timestamp } = stateData;

    // Check state is not too old (5 minutes)
    if (Date.now() - timestamp > 5 * 60 * 1000) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?teams_error=state_expired`
      );
    }

    // Exchange code for tokens
    const tokenResponse = await teamsService.exchangeCodeForToken(code, accountType);

    // Get user profile from Microsoft
    const userProfile = await teamsService.getUserProfile(tokenResponse.access_token);

    // Connect to database
    await connectDB();

    // Calculate token expiration
    const tokenExpiresAt = new Date(Date.now() + tokenResponse.expires_in * 1000);

    // Encrypt tokens before storing
    const encryptedAccessToken = encrypt(tokenResponse.access_token);
    const encryptedRefreshToken = encrypt(tokenResponse.refresh_token);

    // Extract tenant ID from user profile
    const tenantId = accountType === 'personal' ? 'consumers' : 'common';

    // Check if integration already exists
    const existingIntegration = await TeamsIntegration.findOne({
      userId,
      microsoftUserId: userProfile.id,
    });

    if (existingIntegration) {
      // Update existing integration
      existingIntegration.accessToken = encryptedAccessToken;
      existingIntegration.refreshToken = encryptedRefreshToken;
      existingIntegration.tokenExpiresAt = tokenExpiresAt;
      existingIntegration.email = userProfile.mail || userProfile.userPrincipalName;
      existingIntegration.displayName = userProfile.displayName;
      existingIntegration.lastSyncAt = new Date();
      existingIntegration.isActive = true;
      existingIntegration.scopes = tokenResponse.scope.split(' ');
      
      await existingIntegration.save();
    } else {
      // Create new integration
      await TeamsIntegration.create({
        userId,
        tenantId,
        accountType,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        tokenExpiresAt,
        microsoftUserId: userProfile.id,
        email: userProfile.mail || userProfile.userPrincipalName,
        displayName: userProfile.displayName,
        isActive: true,
        scopes: tokenResponse.scope.split(' '),
      });
    }

    // Redirect to success page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?teams_success=true`
    );
  } catch (error: any) {
    console.error('Teams callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?teams_error=callback_failed`
    );
  }
}
