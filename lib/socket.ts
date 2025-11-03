import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocketClient = (): Socket => {
  if (!socket || !socket.connected) {
    // Connect to the Socket.IO server
    const serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';
    
    socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', socket?.id);
      
      // Identify user if logged in
      if (typeof window !== 'undefined') {
        const userId = localStorage.getItem('userId');
        if (userId && socket) {
          socket.emit('identify', userId);
        }
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('⚠️ Socket.IO connection error:', error);
    });
  }

  return socket;
};

// Live Test Functions
export const subscribeToLiveTest = (
  testId: string,
  onUpdate: (data: any) => void
) => {
  const socket = getSocketClient();
  socket.emit('join-live-test', testId);
  
  socket.on('update', onUpdate);
  
  return () => {
    socket.off('update', onUpdate);
    socket.emit('leave-live-test', testId);
  };
};

export const publishToLiveTest = (testId: string, data: any) => {
  const socket = getSocketClient();
  socket.emit('live-test-update', { testId, data });
};

// Leaderboard Functions
export const subscribeToLeaderboard = (
  testId: string,
  onUpdate: (leaderboard: any[]) => void
) => {
  const socket = getSocketClient();
  socket.emit('join-live-test', testId); // Leaderboard is part of live-test room
  
  socket.on('update', onUpdate);
  
  return () => {
    socket.off('update', onUpdate);
    socket.emit('leave-live-test', testId);
  };
};

export const publishLeaderboardUpdate = (testId: string, leaderboard: any[]) => {
  const socket = getSocketClient();
  socket.emit('leaderboard-update', { testId, leaderboard });
};

// Materials Functions
export const subscribeToClassroomMaterials = (
  classroomId: string,
  onMaterialAdded: (material: any) => void,
  onMaterialDeleted: (materialId: string) => void
) => {
  const socket = getSocketClient();
  socket.emit('subscribe-materials', classroomId);
  
  socket.on('material-added', onMaterialAdded);
  socket.on('material-deleted', (data: { materialId: string }) => {
    onMaterialDeleted(data.materialId);
  });
  
  return () => {
    socket.off('material-added', onMaterialAdded);
    socket.off('material-deleted');
    socket.emit('unsubscribe-materials', classroomId);
  };
};

export const publishMaterialAdded = (classroomId: string, material: any) => {
  const socket = getSocketClient();
  socket.emit('material-added-client', { classroomId, material });
};

export const publishMaterialDeleted = (classroomId: string, materialId: string) => {
  const socket = getSocketClient();
  socket.emit('material-deleted-client', { classroomId, materialId });
};

// Announcements Functions
export const subscribeToClassroomAnnouncements = (
  classroomId: string,
  onAnnouncementAdded: (announcement: any) => void,
  onAnnouncementUpdated: (announcement: any) => void,
  onAnnouncementDeleted: (announcementId: string) => void
) => {
  const socket = getSocketClient();
  socket.emit('subscribe-announcements', classroomId);
  
  socket.on('announcement-added', onAnnouncementAdded);
  socket.on('announcement-updated', onAnnouncementUpdated);
  socket.on('announcement-deleted', (data: { announcementId: string }) => {
    onAnnouncementDeleted(data.announcementId);
  });
  
  return () => {
    socket.off('announcement-added', onAnnouncementAdded);
    socket.off('announcement-updated', onAnnouncementUpdated);
    socket.off('announcement-deleted');
    socket.emit('unsubscribe-announcements', classroomId);
  };
};

export const publishAnnouncementAdded = (classroomId: string, announcement: any) => {
  const socket = getSocketClient();
  socket.emit('announcement-added-client', { classroomId, announcement });
};

export const publishAnnouncementUpdated = (classroomId: string, announcement: any) => {
  const socket = getSocketClient();
  socket.emit('announcement-updated-client', { classroomId, announcement });
};

export const publishAnnouncementDeleted = (classroomId: string, announcementId: string) => {
  const socket = getSocketClient();
  socket.emit('announcement-deleted-client', { classroomId, announcementId });
};

// Test Completion Events
export const subscribeToTestEnded = (
  testId: string,
  onTestEnded: (data: { message: string; redirectUrl?: string }) => void
) => {
  const socket = getSocketClient();
  socket.emit('join-live-test', testId);
  
  socket.on('test-ended', onTestEnded);
  
  return () => {
    socket.off('test-ended', onTestEnded);
    socket.emit('leave-live-test', testId);
  };
};

export const publishTestEnded = (testId: string, message: string, redirectUrl?: string) => {
  const socket = getSocketClient();
  socket.emit('test-ended-client', { testId, message, redirectUrl });
};

// Quick Quiz Functions
export const subscribeToQuizEnded = (
  quizId: string,
  onQuizEnded: (data: { message: string }) => void
) => {
  const socket = getSocketClient();
  socket.emit('join-quick-quiz', quizId);
  
  socket.on('quiz-ended', onQuizEnded);
  
  return () => {
    socket.off('quiz-ended', onQuizEnded);
    socket.emit('leave-quick-quiz', quizId);
  };
};

export const publishQuizEnded = (quizId: string, message: string) => {
  const socket = getSocketClient();
  socket.emit('quiz-ended-client', { quizId, message });
};

// Quick Quiz Participant Functions
export const subscribeToQuickQuizParticipants = (
  quizId: string,
  onParticipantJoined: (participant: any) => void
) => {
  const socket = getSocketClient();
  socket.emit('join-quick-quiz', quizId);
  
  socket.on('participant-joined', onParticipantJoined);
  
  return () => {
    socket.off('participant-joined', onParticipantJoined);
    socket.emit('leave-quick-quiz', quizId);
  };
};

export const subscribeToQuickQuizStart = (
  quizId: string,
  onQuizStarted: (data: { testId: string }) => void
) => {
  const socket = getSocketClient();
  socket.emit('join-quick-quiz', quizId);
  
  socket.on('quiz-started', onQuizStarted);
  
  return () => {
    socket.off('quiz-started', onQuizStarted);
    socket.emit('leave-quick-quiz', quizId);
  };
};

// Quick Quiz Answer Submission
export const subscribeToQuickQuizAnswers = (
  quizId: string,
  onAnswerSubmitted: (data: {
    participantName: string;
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
    score: number;
    timeToAnswer: number;
    timestamp: number;
  }) => void
) => {
  const socket = getSocketClient();
  socket.emit('join-quick-quiz', quizId);
  
  socket.on('answer-submitted', onAnswerSubmitted);
  
  return () => {
    socket.off('answer-submitted', onAnswerSubmitted);
    socket.emit('leave-quick-quiz', quizId);
  };
};

export const publishQuickQuizAnswer = (
  quizId: string,
  answerData: {
    participantName: string;
    questionIndex: number;
    selectedAnswer: number;
    isCorrect: boolean;
    score: number;
    timeToAnswer: number;
    timestamp: number;
  }
) => {
  const socket = getSocketClient();
  socket.emit('answer-submitted', { testId: quizId, ...answerData });
};

// User Notifications
export const subscribeToUserNotifications = (
  userId: string,
  onNotification: (notification: any) => void
) => {
  const socket = getSocketClient();
  socket.emit('identify', userId);
  
  socket.on('new-notification', onNotification);
  
  return () => {
    socket.off('new-notification', onNotification);
  };
};
