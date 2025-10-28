import { Router } from 'express';
import {
  getStudentClassrooms,
  getStudentTests,
  getTestDetails,
  joinLiveTest,
  submitTest,
  getTestResult,
} from '../controllers/studentController';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

// All routes require student authentication
router.use(authMiddleware, requireRole('student'));

// Classroom routes
router.get('/classrooms', getStudentClassrooms);

// Test routes
router.get('/tests', getStudentTests);
router.get('/tests/:id', getTestDetails);
router.post('/tests/join', joinLiveTest);
router.post('/tests/:id/submit', submitTest);
router.get('/tests/:id/result', getTestResult);

export default router;
