import Ably from 'ably';

let ablyClient: Ably.Realtime | null = null;

export const getAblyClient = () => {
  if (!ablyClient) {
    // In production, you'd want to use token authentication
    // For now, using API key (should be in env variables)
    const ablyKey = process.env.NEXT_PUBLIC_ABLY_KEY || 'demo-key';
    
    ablyClient = new Ably.Realtime({
      key: ablyKey,
      clientId: typeof window !== 'undefined' ? localStorage.getItem('userId') || 'anonymous' : 'server',
    });
  }
  
  return ablyClient;
};

export const subscribeToLiveTest = (
  testId: string,
  onUpdate: (data: any) => void
) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`live-test-${testId}`);
  
  channel.subscribe('update', (message) => {
    onUpdate(message.data);
  });
  
  return () => {
    channel.unsubscribe();
  };
};

export const publishToLiveTest = (testId: string, data: any) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`live-test-${testId}`);
  
  channel.publish('update', data);
};

export const subscribeToLeaderboard = (
  testId: string,
  onUpdate: (leaderboard: any[]) => void
) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`leaderboard-${testId}`);
  
  channel.subscribe('update', (message) => {
    onUpdate(message.data);
  });
  
  return () => {
    channel.unsubscribe();
  };
};

export const publishLeaderboardUpdate = (testId: string, leaderboard: any[]) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`leaderboard-${testId}`);
  
  channel.publish('update', leaderboard);
};
