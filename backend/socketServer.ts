import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;

export const initializeSocketIO = (httpServer: HTTPServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Transports: WebSocket first, then polling fallback
    transports: ['websocket', 'polling'],
    // Connection options
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    console.log(`✅ Socket.IO client connected: ${socket.id}`);

    // Handle user identification (for user-specific notifications)
    socket.on('identify', (userId: string) => {
      socket.join(`user-${userId}`);
      console.log(`👤 User ${userId} identified, socket: ${socket.id}`);
    });

    // Handle classroom subscriptions
    socket.on('join-classroom', (classroomId: string) => {
      socket.join(`classroom-${classroomId}`);
      console.log(`🏫 Socket ${socket.id} joined classroom: ${classroomId}`);
    });

    socket.on('leave-classroom', (classroomId: string) => {
      socket.leave(`classroom-${classroomId}`);
      console.log(`🚪 Socket ${socket.id} left classroom: ${classroomId}`);
    });

    // Handle live test subscriptions
    socket.on('join-live-test', (testId: string) => {
      socket.join(`live-test-${testId}`);
      socket.join(`leaderboard-${testId}`);
      console.log(`📝 Socket ${socket.id} joined live test: ${testId}`);
    });

    socket.on('leave-live-test', (testId: string) => {
      socket.leave(`live-test-${testId}`);
      socket.leave(`leaderboard-${testId}`);
      console.log(`🚪 Socket ${socket.id} left live test: ${testId}`);
    });

    // Handle quick quiz subscriptions
    socket.on('join-quick-quiz', (quizId: string) => {
      socket.join(`quick-quiz-${quizId}`);
      console.log(`⚡ Socket ${socket.id} joined quick quiz: ${quizId}`);
    });

    socket.on('leave-quick-quiz', (quizId: string) => {
      socket.leave(`quick-quiz-${quizId}`);
      console.log(`🚪 Socket ${socket.id} left quick quiz: ${quizId}`);
    });

    // Handle materials room subscriptions
    socket.on('subscribe-materials', (classroomId: string) => {
      socket.join(`classroom-${classroomId}-materials`);
      console.log(`📚 Socket ${socket.id} subscribed to materials: ${classroomId}`);
    });

    socket.on('unsubscribe-materials', (classroomId: string) => {
      socket.leave(`classroom-${classroomId}-materials`);
      console.log(`🚪 Socket ${socket.id} unsubscribed from materials: ${classroomId}`);
    });

    // Handle announcements room subscriptions
    socket.on('subscribe-announcements', (classroomId: string) => {
      socket.join(`classroom-${classroomId}-announcements`);
      console.log(`📢 Socket ${socket.id} subscribed to announcements: ${classroomId}`);
    });

    socket.on('unsubscribe-announcements', (classroomId: string) => {
      socket.leave(`classroom-${classroomId}-announcements`);
      console.log(`🚪 Socket ${socket.id} unsubscribed from announcements: ${classroomId}`);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`❌ Socket.IO client disconnected: ${socket.id}, reason: ${reason}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error(`⚠️ Socket.IO error for ${socket.id}:`, error);
    });
  });

  console.log('🔌 Socket.IO server initialized');
  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error('Socket.IO not initialized! Call initializeSocketIO first.');
  }
  return io;
};

// Helper function to emit to a specific room
export const emitToRoom = (room: string, event: string, data: any) => {
  if (io) {
    io.to(room).emit(event, data);
    console.log(`📡 Emitted '${event}' to room '${room}'`);
  } else {
    console.error('❌ Socket.IO not initialized, cannot emit event');
  }
};

// Helper function to emit to a specific user
export const emitToUser = (userId: string, event: string, data: any) => {
  emitToRoom(`user-${userId}`, event, data);
};
