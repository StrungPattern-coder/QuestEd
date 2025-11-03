/**
 * Microsoft Teams Integration API Client
 */

export interface Team {
  id: string;
  displayName: string;
  description?: string;
  webUrl: string;
}

export interface Channel {
  id: string;
  displayName: string;
  description?: string;
  webUrl: string;
}

export interface TeamsIntegrationStatus {
  connected: boolean;
  needsRefresh?: boolean;
  integration?: {
    id: string;
    accountType: 'personal' | 'work' | 'school';
    displayName: string;
    email: string;
    connectedAt: Date;
    lastSyncAt: Date;
  };
}

class TeamsApiClient {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Initiate Teams OAuth flow
   */
  async initiateAuth(): Promise<{ authUrl: string; state: string }> {
    const response = await fetch('/api/teams/auth/initiate', {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initiate authentication');
    }

    return response.json();
  }

  /**
   * Get Teams integration status
   */
  async getStatus(): Promise<TeamsIntegrationStatus> {
    const response = await fetch('/api/teams/integration/status', {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get status');
    }

    return response.json();
  }

  /**
   * Disconnect Teams integration
   */
  async disconnect(): Promise<void> {
    const response = await fetch('/api/teams/integration/status', {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to disconnect');
    }
  }

  /**
   * Get user's Teams
   */
  async getTeams(): Promise<Team[]> {
    const response = await fetch('/api/teams/integration/teams', {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get Teams');
    }

    const data = await response.json();
    return data.teams;
  }

  /**
   * Get channels for a specific team
   */
  async getChannels(teamId: string): Promise<Channel[]> {
    const response = await fetch(`/api/teams/integration/channels?teamId=${teamId}`, {
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get channels');
    }

    const data = await response.json();
    return data.channels;
  }

  /**
   * Post a message to a Teams channel
   */
  async postMessage(
    teamId: string,
    channelId: string,
    message: string,
    title?: string,
    buttons?: Array<{ title: string; url: string }>
  ): Promise<void> {
    const response = await fetch('/api/teams/integration/post-message', {
      method: 'POST',
      headers: this.getAuthHeader(),
      body: JSON.stringify({
        teamId,
        channelId,
        message,
        title,
        buttons,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to post message');
    }
  }

  /**
   * Sync Microsoft Teams classes and students into QuestEd
   */
  async syncFromTeams(): Promise<{
    success: boolean;
    message: string;
    results: {
      classroomsCreated: number;
      classroomsUpdated: number;
      studentsAdded: number;
      errors: string[];
    };
    totalClasses: number;
  }> {
    const response = await fetch('/api/teams/sync', {
      method: 'POST',
      headers: this.getAuthHeader(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to sync Teams data');
    }

    return response.json();
  }
}

export const teamsApi = new TeamsApiClient();
