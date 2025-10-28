import { Request, Response } from 'express';
import Classroom from '../models/Classroom';
import Test from '../models/Test';
import Question from '../models/Question';
import Submission from '../models/Submission';
import Leaderboard from '../models/Leaderboard';
import User from '../models/User';
import { generateJoinCode, parseCSVQuestions } from '../utils/helpers';
import mongoose from 'mongoose';

// Classroom Management
export const createClassroom = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const teacherId = req.user!.userId;

    if (!name) {
      return res.status(400).json({ error: 'Classroom name is required' });
    }

    const classroom = await Classroom.create({
      teacherId,
      name,
      description: description || '',
      students: [],
    });

    res.status(201).json({
      message: 'Classroom created successfully',
      classroom,
    });
  } catch (error: any) {
    console.error('Create classroom error:', error);
    res.status(500).json({ error: error.message || 'Failed to create classroom' });
  }
};

export const getClassrooms = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user!.userId;

    const classrooms = await Classroom.find({ teacherId })
      .populate('students', 'name email enrollmentNumber')
      .sort({ createdAt: -1 });

    res.json({ classrooms });
  } catch (error: any) {
    console.error('Get classrooms error:', error);
    res.status(500).json({ error: error.message || 'Failed to get classrooms' });
  }
};

export const updateClassroom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const teacherId = req.user!.userId;

    const classroom = await Classroom.findOne({ _id: id, teacherId });
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    if (name) classroom.name = name;
    if (description !== undefined) classroom.description = description;

    await classroom.save();

    res.json({
      message: 'Classroom updated successfully',
      classroom,
    });
  } catch (error: any) {
    console.error('Update classroom error:', error);
    res.status(500).json({ error: error.message || 'Failed to update classroom' });
  }
};

export const deleteClassroom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user!.userId;

    const classroom = await Classroom.findOneAndDelete({ _id: id, teacherId });
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    res.json({ message: 'Classroom deleted successfully' });
  } catch (error: any) {
    console.error('Delete classroom error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete classroom' });
  }
};

// Student Management
export const addStudentToClassroom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { studentEmail } = req.body;
    const teacherId = req.user!.userId;

    const classroom = await Classroom.findOne({ _id: id, teacherId });
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    const student = await User.findOne({ email: studentEmail, role: 'student' });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (classroom.students.includes(student._id as any)) {
      return res.status(409).json({ error: 'Student already in classroom' });
    }

    classroom.students.push(student._id as any);
    await classroom.save();

    res.json({
      message: 'Student added successfully',
      classroom: await classroom.populate('students', 'name email enrollmentNumber'),
    });
  } catch (error: any) {
    console.error('Add student error:', error);
    res.status(500).json({ error: error.message || 'Failed to add student' });
  }
};

export const removeStudentFromClassroom = async (req: Request, res: Response) => {
  try {
    const { id, studentId } = req.params;
    const teacherId = req.user!.userId;

    const classroom = await Classroom.findOne({ _id: id, teacherId });
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    classroom.students = classroom.students.filter(
      (sid) => sid.toString() !== studentId
    );
    await classroom.save();

    res.json({ message: 'Student removed successfully', classroom });
  } catch (error: any) {
    console.error('Remove student error:', error);
    res.status(500).json({ error: error.message || 'Failed to remove student' });
  }
};

// Test Management
export const createTest = async (req: Request, res: Response) => {
  try {
    const {
      classroomId,
      title,
      description,
      mode,
      startTime,
      endTime,
      timeLimitPerQuestion,
      questions,
    } = req.body;
    const teacherId = req.user!.userId;

    // Validate classroom ownership
    const classroom = await Classroom.findOne({ _id: classroomId, teacherId });
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    // Create test
    const test = await Test.create({
      classroomId,
      teacherId,
      title,
      description: description || '',
      mode,
      startTime,
      endTime,
      timeLimitPerQuestion,
      questions: [],
      joinCode: mode === 'live' ? generateJoinCode() : undefined,
    });

    // Create questions if provided
    if (questions && Array.isArray(questions)) {
      const createdQuestions = await Question.insertMany(
        questions.map((q: any) => ({
          testId: test._id,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
        }))
      );

      test.questions = createdQuestions.map((q) => q._id) as any;
      await test.save();
    }

    res.status(201).json({
      message: 'Test created successfully',
      test: await test.populate('questions'),
    });
  } catch (error: any) {
    console.error('Create test error:', error);
    res.status(500).json({ error: error.message || 'Failed to create test' });
  }
};

export const uploadQuestions = async (req: Request, res: Response) => {
  try {
    const { testId, questions, csvContent } = req.body;
    const teacherId = req.user!.userId;

    // Validate test ownership
    const test = await Test.findOne({ _id: testId, teacherId });
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    let parsedQuestions = questions;

    // Parse CSV if provided
    if (csvContent) {
      parsedQuestions = parseCSVQuestions(csvContent);
    }

    if (!parsedQuestions || !Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      return res.status(400).json({ error: 'No valid questions provided' });
    }

    // Create questions
    const createdQuestions = await Question.insertMany(
      parsedQuestions.map((q: any) => ({
        testId: test._id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
      }))
    );

    test.questions.push(...(createdQuestions.map((q) => q._id) as any));
    await test.save();

    res.json({
      message: `${createdQuestions.length} questions uploaded successfully`,
      questions: createdQuestions,
    });
  } catch (error: any) {
    console.error('Upload questions error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload questions' });
  }
};

export const getTests = async (req: Request, res: Response) => {
  try {
    const teacherId = req.user!.userId;
    const { classroomId } = req.query;

    const query: any = { teacherId };
    if (classroomId) {
      query.classroomId = classroomId;
    }

    const tests = await Test.find(query)
      .populate('classroomId', 'name')
      .populate('questions')
      .sort({ createdAt: -1 });

    res.json({ tests });
  } catch (error: any) {
    console.error('Get tests error:', error);
    res.status(500).json({ error: error.message || 'Failed to get tests' });
  }
};

export const startLiveTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user!.userId;

    const test = await Test.findOne({ _id: id, teacherId, mode: 'live' });
    if (!test) {
      return res.status(404).json({ error: 'Live test not found' });
    }

    test.isActive = true;
    if (!test.joinCode) {
      test.joinCode = generateJoinCode();
    }
    await test.save();

    res.json({
      message: 'Live test started',
      test: await test.populate('questions'),
      joinCode: test.joinCode,
    });
  } catch (error: any) {
    console.error('Start live test error:', error);
    res.status(500).json({ error: error.message || 'Failed to start live test' });
  }
};

export const stopLiveTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user!.userId;

    const test = await Test.findOne({ _id: id, teacherId, mode: 'live' });
    if (!test) {
      return res.status(404).json({ error: 'Live test not found' });
    }

    test.isActive = false;
    await test.save();

    res.json({ message: 'Live test stopped', test });
  } catch (error: any) {
    console.error('Stop live test error:', error);
    res.status(500).json({ error: error.message || 'Failed to stop live test' });
  }
};

// Analytics & Results
export const getTestResults = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user!.userId;

    const test = await Test.findOne({ _id: id, teacherId })
      .populate('classroomId', 'name students')
      .populate('questions');

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const submissions = await Submission.find({ testId: test._id })
      .populate('studentId', 'name email enrollmentNumber')
      .sort({ score: -1 });

    const classroom = await Classroom.findById(test.classroomId).populate('students', 'name email');
    const studentsWhoSubmitted = submissions.map((s) => s.studentId._id.toString());
    const studentsWhoDidnt = classroom?.students.filter(
      (s: any) => !studentsWhoSubmitted.includes(s._id.toString())
    ) || [];

    res.json({
      test,
      submissions,
      analytics: {
        totalStudents: classroom?.students.length || 0,
        submitted: submissions.length,
        notSubmitted: studentsWhoDidnt.length,
        studentsWhoDidnt,
        averageScore: submissions.length > 0
          ? submissions.reduce((acc, s) => acc + s.score, 0) / submissions.length
          : 0,
        lateSubmissions: submissions.filter((s) => s.submittedLate).length,
      },
    });
  } catch (error: any) {
    console.error('Get test results error:', error);
    res.status(500).json({ error: error.message || 'Failed to get test results' });
  }
};

export const getClassroomLeaderboard = async (req: Request, res: Response) => {
  try {
    const { classroomId } = req.params;
    const teacherId = req.user!.userId;

    const classroom = await Classroom.findOne({ _id: classroomId, teacherId });
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    // Get all tests for this classroom
    const tests = await Test.find({ classroomId });
    const testIds = tests.map((t) => t._id);

    // Get all submissions for these tests
    const submissions = await Submission.find({ testId: { $in: testIds } })
      .populate('studentId', 'name email enrollmentNumber');

    // Calculate overall scores
    const studentScores = new Map<string, { student: any; totalScore: number; testCount: number }>();

    submissions.forEach((submission) => {
      const studentId = submission.studentId._id.toString();
      if (!studentScores.has(studentId)) {
        studentScores.set(studentId, {
          student: submission.studentId,
          totalScore: 0,
          testCount: 0,
        });
      }
      const current = studentScores.get(studentId)!;
      current.totalScore += submission.score;
      current.testCount += 1;
    });

    // Convert to array and sort
    const overallRankings = Array.from(studentScores.values())
      .map((entry) => ({
        studentId: entry.student._id,
        student: entry.student,
        totalScore: entry.totalScore,
        averageScore: entry.totalScore / entry.testCount,
        testCount: entry.testCount,
      }))
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    res.json({
      classroomId,
      overallRankings,
      totalTests: tests.length,
    });
  } catch (error: any) {
    console.error('Get classroom leaderboard error:', error);
    res.status(500).json({ error: error.message || 'Failed to get leaderboard' });
  }
};
