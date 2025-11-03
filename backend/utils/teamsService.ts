import axios from 'axios';
import { encrypt, decrypt } from './encryption';

// Microsoft Graph API endpoints
const GRAPH_API_BASE = 'https://graph.microsoft.com/v1.0';
const AUTH_ENDPOINT = 'https://login.microsoftonline.com';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

interface UserProfile {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
}

export class MicrosoftTeamsService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.MICROSOFT_CLIENT_ID!;
    this.clientSecret = process.env.MICROSOFT_CLIENT_SECRET!;
    this.redirectUri = process.env.MICROSOFT_REDIRECT_URI || 
      `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/teams/callback`;
  }

  /**
   * Generate OAuth authorization URL
   * Supports both personal and organizational accounts
   */
  getAuthorizationUrl(state: string, accountType: 'personal' | 'work' = 'work'): string {
    const tenant = accountType === 'personal' ? 'consumers' : 'common';
    
    const scopes = [
      'openid',
      'profile',
      'email',
      'offline_access',
      'User.Read',
      'Team.ReadBasic.All',
      'Channel.ReadBasic.All',
      'ChannelMessage.Send',
    ].join(' ');

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: scopes,
      state: state,
      response_mode: 'query',
    });

    return `${AUTH_ENDPOINT}/${tenant}/oauth2/v2.0/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string, accountType: 'personal' | 'work' = 'work'): Promise<TokenResponse> {
    const tenant = accountType === 'personal' ? 'consumers' : 'common';
    
    const response = await axios.post(
      `${AUTH_ENDPOINT}/${tenant}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(encryptedRefreshToken: string, tenantId: string): Promise<TokenResponse> {
    const refreshToken = decrypt(encryptedRefreshToken);
    
    const response = await axios.post(
      `${AUTH_ENDPOINT}/${tenantId}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  }

  /**
   * Get user profile from Microsoft Graph API
   */
  async getUserProfile(accessToken: string): Promise<UserProfile> {
    const response = await axios.get(`${GRAPH_API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  }

  /**
   * Get user's Teams
   */
  async getTeams(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get(`${GRAPH_API_BASE}/me/joinedTeams`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.value || [];
    } catch (error) {
      console.error('Error fetching teams:', error);
      return [];
    }
  }

  /**
   * Get channels in a Team
   */
  async getChannels(accessToken: string, teamId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${GRAPH_API_BASE}/teams/${teamId}/channels`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return response.data.value || [];
    } catch (error) {
      console.error('Error fetching channels:', error);
      return [];
    }
  }

  /**
   * Send message to a Teams channel
   */
  async sendMessageToChannel(
    accessToken: string,
    teamId: string,
    channelId: string,
    message: string
  ): Promise<boolean> {
    try {
      await axios.post(
        `${GRAPH_API_BASE}/teams/${teamId}/channels/${channelId}/messages`,
        {
          body: {
            content: message,
            contentType: 'text',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  /**
   * Send adaptive card to Teams channel
   */
  async sendAdaptiveCard(
    accessToken: string,
    teamId: string,
    channelId: string,
    card: any
  ): Promise<boolean> {
    try {
      await axios.post(
        `${GRAPH_API_BASE}/teams/${teamId}/channels/${channelId}/messages`,
        {
          body: {
            contentType: 'html',
            content: `<attachment id="1"></attachment>`,
          },
          attachments: [
            {
              id: '1',
              contentType: 'application/vnd.microsoft.card.adaptive',
              content: JSON.stringify(card),
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return true;
    } catch (error) {
      console.error('Error sending adaptive card:', error);
      return false;
    }
  }

  /**
   * Create adaptive card for quiz notification
   */
  createQuizNotificationCard(quizTitle: string, joinCode: string, teacherName: string): any {
    return {
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'TextBlock',
          text: '📚 New Quiz Available!',
          weight: 'Bolder',
          size: 'Large',
          color: 'Accent',
        },
        {
          type: 'TextBlock',
          text: quizTitle,
          weight: 'Bolder',
          size: 'Medium',
          wrap: true,
        },
        {
          type: 'FactSet',
          facts: [
            {
              title: 'Teacher:',
              value: teacherName,
            },
            {
              title: 'Join Code:',
              value: `**${joinCode}**`,
            },
          ],
        },
        {
          type: 'TextBlock',
          text: 'Click the button below to join the quiz!',
          wrap: true,
          spacing: 'Medium',
        },
      ],
      actions: [
        {
          type: 'Action.OpenUrl',
          title: '🎯 Join Quiz',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/quick-quiz/join?code=${joinCode}`,
          style: 'positive',
        },
      ],
    };
  }

  /**
   * Create adaptive card for test assignment
   */
  createTestAssignmentCard(testTitle: string, deadline: string, teacherName: string): any {
    return {
      type: 'AdaptiveCard',
      version: '1.4',
      body: [
        {
          type: 'TextBlock',
          text: '📝 New Test Assigned',
          weight: 'Bolder',
          size: 'Large',
          color: 'Attention',
        },
        {
          type: 'TextBlock',
          text: testTitle,
          weight: 'Bolder',
          size: 'Medium',
          wrap: true,
        },
        {
          type: 'FactSet',
          facts: [
            {
              title: 'Teacher:',
              value: teacherName,
            },
            {
              title: 'Deadline:',
              value: deadline,
            },
          ],
        },
      ],
      actions: [
        {
          type: 'Action.OpenUrl',
          title: '📖 View Test',
          url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/student`,
          style: 'positive',
        },
      ],
    };
  }
}

export const teamsService = new MicrosoftTeamsService();
