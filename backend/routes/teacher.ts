import { Router } from 'express';
import {
  createClassroom,
  getClassrooms,
  updateClassroom,
  deleteClassroom,
  addStudentToClassroom,
  removeStudentFromClassroom,
  createTest,
  uploadQuestions,
  getTests,
  startLiveTest,
  stopLiveTest,
  getTestResults,
  getClassroomLeaderboard,
} from '../controllers/teacherController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

// All routes require teacher authentication
router.use(authMiddleware, requireRole('teacher'));

// Classroom routes
router.post('/classrooms', createClassroom);
router.get('/classrooms', getClassrooms);
router.put('/classrooms/:id', updateClassroom);
router.delete('/classrooms/:id', deleteClassroom);

// Student management routes
router.post('/classrooms/:id/students', addStudentToClassroom);
router.delete('/classrooms/:id/students/:studentId', removeStudentFromClassroom);

// Test routes
router.post('/tests', createTest);
router.get('/tests', getTests);
router.post('/tests/:id/start', startLiveTest);
router.post('/tests/:id/stop', stopLiveTest);
router.post('/tests/:id/questions', uploadQuestions);
router.get('/tests/:id/results', getTestResults);

// Leaderboard routes
router.get('/leaderboard/:classroomId', getClassroomLeaderboard);

export default router;
