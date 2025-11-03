import { getIO } from '../socketServer';

// Materials
export const publishMaterialAdded = async (classroomId: string, material: any) => {
  try {
    const io = getIO();
    io.to(`classroom-${classroomId}-materials`).emit('material-added', material);
    console.log(`📚 Published material-added to classroom ${classroomId}`);
  } catch (error) {
    console.error('Failed to publish material-added event:', error);
  }
};

export const publishMaterialDeleted = async (classroomId: string, materialId: string) => {
  try {
    const io = getIO();
    io.to(`classroom-${classroomId}-materials`).emit('material-deleted', { materialId });
    console.log(`🗑️ Published material-deleted to classroom ${classroomId}`);
  } catch (error) {
    console.error('Failed to publish material-deleted event:', error);
  }
};

// Announcements
export const publishAnnouncementAdded = async (classroomId: string, announcement: any) => {
  try {
    const io = getIO();
    io.to(`classroom-${classroomId}-announcements`).emit('announcement-added', announcement);
    console.log(`📢 Published announcement-added to classroom ${classroomId}`);
  } catch (error) {
    console.error('Failed to publish announcement-added event:', error);
  }
};

export const publishAnnouncementUpdated = async (classroomId: string, announcement: any) => {
  try {
    const io = getIO();
    io.to(`classroom-${classroomId}-announcements`).emit('announcement-updated', announcement);
    console.log(`📝 Published announcement-updated to classroom ${classroomId}`);
  } catch (error) {
    console.error('Failed to publish announcement-updated event:', error);
  }
};

export const publishAnnouncementDeleted = async (classroomId: string, announcementId: string) => {
  try {
    const io = getIO();
    io.to(`classroom-${classroomId}-announcements`).emit('announcement-deleted', { announcementId });
    console.log(`🗑️ Published announcement-deleted to classroom ${classroomId}`);
  } catch (error) {
    console.error('Failed to publish announcement-deleted event:', error);
  }
};

// Live Tests
export const publishLeaderboardUpdate = async (testId: string, leaderboard: any[]) => {
  try {
    const io = getIO();
    io.to(`leaderboard-${testId}`).emit('update', leaderboard);
    console.log(`🏆 Published leaderboard update for test ${testId}`);
  } catch (error) {
    console.error('Failed to publish leaderboard update:', error);
  }
};

export const publishTestEnded = async (testId: string, message: string, redirectUrl?: string) => {
  try {
    const io = getIO();
    io.to(`live-test-${testId}`).emit('test-ended', { message, redirectUrl });
    console.log(`🏁 Published test-ended for test ${testId}`);
  } catch (error) {
    console.error('Failed to publish test-ended event:', error);
  }
};

// Quick Quiz
export const publishQuickQuizParticipantJoined = async (quizId: string, participant: any) => {
  try {
    const io = getIO();
    io.to(`quick-quiz-${quizId}`).emit('participant-joined', participant);
    console.log(`⚡ Published participant-joined for quiz ${quizId}`);
  } catch (error) {
    console.error('Failed to publish participant-joined event:', error);
  }
};

export const publishQuickQuizStarted = async (quizId: string) => {
  try {
    const io = getIO();
    io.to(`quick-quiz-${quizId}`).emit('quiz-started', { testId: quizId });
    console.log(`🚀 Published quiz-started for quiz ${quizId}`);
  } catch (error) {
    console.error('Failed to publish quiz-started event:', error);
  }
};

export const publishQuizEnded = async (quizId: string, message: string) => {
  try {
    const io = getIO();
    io.to(`quick-quiz-${quizId}`).emit('quiz-ended', { message });
    console.log(`🏁 Published quiz-ended for quiz ${quizId}`);
  } catch (error) {
    console.error('Failed to publish quiz-ended event:', error);
  }
};

// User Notifications
export const publishUserNotification = async (userId: string, notification: any) => {
  try {
    const io = getIO();
    io.to(`user-${userId}`).emit('new-notification', notification);
    console.log(`🔔 Published notification to user ${userId}`);
  } catch (error) {
    console.error('Failed to publish user notification:', error);
  }
};
