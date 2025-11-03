/**
 * Microsoft Graph API Helper for Teams Integration
 * Handles authentication, token refresh, and Teams API calls
 */

import axios, { AxiosInstance } from 'axios';

const GRAPH_API_ENDPOINT = 'https://graph.microsoft.com/v1.0';
const GRAPH_API_BETA = 'https://graph.microsoft.com/beta';

export interface MicrosoftTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface MicrosoftUserProfile {
  id: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  accountType: 'personal' | 'work' | 'school';
}

export interface TeamsChannel {
  id: string;
  displayName: string;
  description?: string;
  webUrl: string;
}

export interface Team {
  id: string;
  displayName: string;
  description?: string;
  webUrl: string;
}

export interface TeamMember {
  id: string;
  displayName: string;
  email: string;
  roles: string[];
  userId: string;
}

export interface TeamsAssignment {
  id: string;
  displayName: string;
  instructions?: string;
  dueDateTime?: string;
  assignedDateTime: string;
  status: string;
  classId: string;
  webUrl: string;
}

export interface TeamsClass {
  id: string;
  displayName: string;
  description?: string;
  mailNickname: string;
  createdDateTime: string;
  members: TeamMember[];
  webUrl: string;
}

export class MicrosoftGraphClient {
  private axiosInstance: AxiosInstance;

  constructor(accessToken: string) {
    this.axiosInstance = axios.create({
      baseURL: GRAPH_API_ENDPOINT,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Get current user's profile
   */
  async getUserProfile(): Promise<MicrosoftUserProfile> {
    try {
      const response = await this.axiosInstance.get('/me');
      const data = response.data;

      return {
        id: data.id,
        displayName: data.displayName,
        mail: data.mail || data.userPrincipalName,
        userPrincipalName: data.userPrincipalName,
        accountType: this.detectAccountType(data),
      };
    } catch (error: any) {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      throw new Error('Failed to fetch Microsoft user profile');
    }
  }

  /**
   * Detect account type based on user data
   */
  private detectAccountType(userData: any): 'personal' | 'work' | 'school' {
    const upn = userData.userPrincipalName || '';
    
    // Personal accounts typically have @outlook.com, @hotmail.com, @live.com
    if (upn.includes('@outlook.com') || upn.includes('@hotmail.com') || upn.includes('@live.com')) {
      return 'personal';
    }
    
    // Check if it's an edu domain
    if (upn.includes('.edu') || upn.includes('.ac.')) {
      return 'school';
    }
    
    // Default to work for organizational accounts
    return 'work';
  }

  /**
   * Get all teams the user is a member of
   */
  async getUserTeams(): Promise<Team[]> {
    try {
      const response = await this.axiosInstance.get('/me/joinedTeams');
      return response.data.value.map((team: any) => ({
        id: team.id,
        displayName: team.displayName,
        description: team.description,
        webUrl: team.webUrl,
      }));
    } catch (error: any) {
      console.error('Error fetching teams:', error.response?.data || error.message);
      throw new Error('Failed to fetch Teams');
    }
  }

  /**
   * Get channels for a specific team
   */
  async getTeamChannels(teamId: string): Promise<TeamsChannel[]> {
    try {
      const response = await this.axiosInstance.get(`/teams/${teamId}/channels`);
      return response.data.value.map((channel: any) => ({
        id: channel.id,
        displayName: channel.displayName,
        description: channel.description,
        webUrl: channel.webUrl,
      }));
    } catch (error: any) {
      console.error('Error fetching channels:', error.response?.data || error.message);
      throw new Error('Failed to fetch Team channels');
    }
  }

  /**
   * Post a message to a Teams channel
   */
  async postMessageToChannel(teamId: string, channelId: string, message: string): Promise<void> {
    try {
      const messagePayload = {
        body: {
          content: message,
          contentType: 'html',
        },
      };

      await this.axiosInstance.post(
        `/teams/${teamId}/channels/${channelId}/messages`,
        messagePayload
      );
    } catch (error: any) {
      console.error('Error posting message:', error.response?.data || error.message);
      throw new Error('Failed to post message to Teams channel');
    }
  }

  /**
   * Post a rich card message to a Teams channel
   */
  async postCardToChannel(
    teamId: string,
    channelId: string,
    title: string,
    text: string,
    buttons?: Array<{ title: string; url: string }>
  ): Promise<void> {
    try {
      const cardContent = {
        body: {
          contentType: 'html',
          content: `<h2>${title}</h2><p>${text}</p>`,
        },
        attachments: buttons ? [{
          contentType: 'application/vnd.microsoft.card.hero',
          content: {
            title: title,
            text: text,
            buttons: buttons.map(btn => ({
              type: 'openUrl',
              title: btn.title,
              value: btn.url,
            })),
          },
        }] : [],
      };

      await this.axiosInstance.post(
        `/teams/${teamId}/channels/${channelId}/messages`,
        cardContent
      );
    } catch (error: any) {
      console.error('Error posting card:', error.response?.data || error.message);
      throw new Error('Failed to post card to Teams channel');
    }
  }

  /**
   * Create a meeting in user's calendar
   */
  async createMeeting(
    subject: string,
    startTime: Date,
    endTime: Date,
    attendees: string[]
  ): Promise<any> {
    try {
      const meetingPayload = {
        subject: subject,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'UTC',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'UTC',
        },
        attendees: attendees.map(email => ({
          emailAddress: {
            address: email,
          },
          type: 'required',
        })),
        isOnlineMeeting: true,
        onlineMeetingProvider: 'teamsForBusiness',
      };

      const response = await this.axiosInstance.post('/me/events', meetingPayload);
      return response.data;
    } catch (error: any) {
      console.error('Error creating meeting:', error.response?.data || error.message);
      throw new Error('Failed to create Teams meeting');
    }
  }

  /**
   * Get all education classes (Teams for Education)
   * This retrieves Teams that are set up as classes
   */
  async getEducationClasses(): Promise<TeamsClass[]> {
    try {
      // Get all joined teams
      const teamsResponse = await this.axiosInstance.get('/me/joinedTeams');
      const teams = teamsResponse.data.value;

      // Filter for education teams and get members
      const classes: TeamsClass[] = [];
      
      for (const team of teams) {
        try {
          // Get team members
          const membersResponse = await this.axiosInstance.get(`/teams/${team.id}/members`);
          const members = membersResponse.data.value.map((member: any) => ({
            id: member.id,
            displayName: member.displayName,
            email: member.email || member.userPrincipalName,
            roles: member.roles || [],
            userId: member.userId,
          }));

          classes.push({
            id: team.id,
            displayName: team.displayName,
            description: team.description || '',
            mailNickname: team.mailNickname || '',
            createdDateTime: team.createdDateTime,
            members: members,
            webUrl: team.webUrl,
          });
        } catch (error) {
          console.error(`Error fetching members for team ${team.id}:`, error);
        }
      }

      return classes;
    } catch (error: any) {
      console.error('Error fetching education classes:', error.response?.data || error.message);
      throw new Error('Failed to fetch education classes');
    }
  }

  /**
   * Get assignments for a specific class
   */
  async getClassAssignments(classId: string): Promise<TeamsAssignment[]> {
    try {
      // Use beta endpoint for education assignments
      const response = await axios.get(
        `${GRAPH_API_BETA}/education/classes/${classId}/assignments`,
        {
          headers: {
            'Authorization': this.axiosInstance.defaults.headers['Authorization'],
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.value.map((assignment: any) => ({
        id: assignment.id,
        displayName: assignment.displayName,
        instructions: assignment.instructions?.content || '',
        dueDateTime: assignment.dueDateTime,
        assignedDateTime: assignment.assignedDateTime,
        status: assignment.status,
        classId: classId,
        webUrl: assignment.webUrl,
      }));
    } catch (error: any) {
      console.error('Error fetching assignments:', error.response?.data || error.message);
      // Return empty array if assignments endpoint not available
      return [];
    }
  }

  /**
   * Get all members of a team (students and teachers)
   */
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    try {
      const response = await this.axiosInstance.get(`/teams/${teamId}/members`);
      
      return response.data.value.map((member: any) => ({
        id: member.id,
        displayName: member.displayName,
        email: member.email || member.userPrincipalName,
        roles: member.roles || [],
        userId: member.userId,
      }));
    } catch (error: any) {
      console.error('Error fetching team members:', error.response?.data || error.message);
      throw new Error('Failed to fetch team members');
    }
  }

  /**
   * Get user's role in a team (owner/member)
   */
  async getUserRoleInTeam(teamId: string): Promise<string[]> {
    try {
      const members = await this.getTeamMembers(teamId);
      const userProfile = await this.getUserProfile();
      
      const currentUser = members.find(m => m.userId === userProfile.id);
      return currentUser?.roles || ['member'];
    } catch (error: any) {
      console.error('Error getting user role:', error.response?.data || error.message);
      return ['member'];
    }
  }
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<MicrosoftTokenResponse> {
  const clientId = process.env.MICROSOFT_CLIENT_ID!;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET!;
  const tenantId = 'common'; // 'common' allows both personal and work accounts

  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        scope: 'https://graph.microsoft.com/.default offline_access',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    throw new Error('Failed to exchange authorization code');
  }
}

/**
 * Refresh an expired access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<MicrosoftTokenResponse> {
  const clientId = process.env.MICROSOFT_CLIENT_ID!;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET!;
  const tenantId = 'common';

  try {
    const response = await axios.post(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
        scope: 'https://graph.microsoft.com/.default offline_access',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    throw new Error('Failed to refresh access token');
  }
}

/**
 * Get authorization URL for OAuth flow
 */
export function getAuthorizationUrl(redirectUri: string, state: string): string {
  const clientId = process.env.MICROSOFT_CLIENT_ID!;
  const tenantId = 'common'; // Supports both personal and organizational accounts
  
  const scopes = [
    'User.Read',
    'Team.ReadBasic.All',
    'TeamMember.Read.All',
    'Channel.ReadBasic.All',
    'ChannelMessage.Send',
    'Calendars.ReadWrite',
    'EduAssignments.ReadBasic',
    'EduRoster.ReadBasic',
    'offline_access',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    response_mode: 'query',
    scope: scopes,
    state: state,
    prompt: 'consent', // Always ask for consent to ensure we get all permissions
  });

  return `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?${params.toString()}`;
}
