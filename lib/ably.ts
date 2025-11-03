import Ably from 'ably';

let ablyClient: Ably.Realtime | null = null;

export const getAblyClient = () => {
  if (!ablyClient) {
    // In production, you'd want to use token authentication
    // For now, using API key (should be in env variables)
    const ablyKey = process.env.NEXT_PUBLIC_ABLY_CLIENT_KEY || process.env.NEXT_PUBLIC_ABLY_KEY || 'demo-key';
    
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

// Materials real-time functions
export const subscribeToClassroomMaterials = (
  classroomId: string,
  onMaterialAdded: (material: any) => void,
  onMaterialDeleted: (materialId: string) => void
) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`classroom-${classroomId}-materials`);
  
  channel.subscribe('material-added', (message) => {
    onMaterialAdded(message.data);
  });
  
  channel.subscribe('material-deleted', (message) => {
    onMaterialDeleted(message.data.materialId);
  });
  
  return () => {
    channel.unsubscribe();
  };
};

export const publishMaterialAdded = (classroomId: string, material: any) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`classroom-${classroomId}-materials`);
  
  channel.publish('material-added', material);
};

export const publishMaterialDeleted = (classroomId: string, materialId: string) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`classroom-${classroomId}-materials`);
  
  channel.publish('material-deleted', { materialId });
};

// Announcements real-time functions
export const subscribeToClassroomAnnouncements = (
  classroomId: string,
  onAnnouncementAdded: (announcement: any) => void,
  onAnnouncementUpdated: (announcement: any) => void,
  onAnnouncementDeleted: (announcementId: string) => void
) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`classroom-${classroomId}-announcements`);
  
  channel.subscribe('announcement-added', (message) => {
    onAnnouncementAdded(message.data);
  });
  
  channel.subscribe('announcement-updated', (message) => {
    onAnnouncementUpdated(message.data);
  });
  
  channel.subscribe('announcement-deleted', (message) => {
    onAnnouncementDeleted(message.data.announcementId);
  });
  
  return () => {
    channel.unsubscribe();
  };
};

export const publishAnnouncementAdded = (classroomId: string, announcement: any) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`classroom-${classroomId}-announcements`);
  
  channel.publish('announcement-added', announcement);
};

export const publishAnnouncementUpdated = (classroomId: string, announcement: any) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`classroom-${classroomId}-announcements`);
  
  channel.publish('announcement-updated', announcement);
};

export const publishAnnouncementDeleted = (classroomId: string, announcementId: string) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`classroom-${classroomId}-announcements`);
  
  channel.publish('announcement-deleted', { announcementId });
};

// Test completion events (for notifying students when teacher ends test)
export const subscribeToTestEnded = (
  testId: string,
  onTestEnded: (data: { message: string; redirectUrl?: string }) => void
) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`live-test-${testId}`);
  
  channel.subscribe('test-ended', (message) => {
    onTestEnded(message.data);
  });
  
  return () => {
    channel.unsubscribe('test-ended');
  };
};

export const publishTestEnded = (testId: string, message: string, redirectUrl?: string) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`live-test-${testId}`);
  
  channel.publish('test-ended', { message, redirectUrl });
};

// Quick Quiz completion events
export const subscribeToQuizEnded = (
  quizId: string,
  onQuizEnded: (data: { message: string }) => void
) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`quick-quiz-${quizId}`);
  
  channel.subscribe('quiz-ended', (message) => {
    onQuizEnded(message.data);
  });
  
  return () => {
    channel.unsubscribe('quiz-ended');
  };
};

export const publishQuizEnded = (quizId: string, message: string) => {
  const ably = getAblyClient();
  const channel = ably.channels.get(`quick-quiz-${quizId}`);
  
  channel.publish('quiz-ended', { message });
};
