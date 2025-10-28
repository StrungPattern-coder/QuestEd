import { Request, Response } from 'express';
import Classroom from '../models/Classroom';
import Test from '../models/Test';
import Question from '../models/Question';
import Submission from '../models/Submission';
import { calculateScore, isTestActive, isSubmissionLate } from '../utils/helpers';

export const getStudentClassrooms = async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.userId;

    const classrooms = await Classroom.find({ students: studentId })
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ classrooms });
  } catch (error: any) {
    console.error('Get student classrooms error:', error);
    res.status(500).json({ error: error.message || 'Failed to get classrooms' });
  }
};

export const getStudentTests = async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.userId;

    // Find all classrooms the student belongs to
    const classrooms = await Classroom.find({ students: studentId });
    const classroomIds = classrooms.map((c) => c._id);

    // Find all tests in those classrooms
    const tests = await Test.find({ classroomId: { $in: classroomIds } })
      .populate('classroomId', 'name')
      .sort({ startTime: -1 });

    // Check if student has submitted each test
    const testIds = tests.map((t) => t._id);
    const submissions = await Submission.find({
      testId: { $in: testIds },
      studentId,
    });

    const submissionMap = new Map(
      submissions.map((s) => [s.testId.toString(), s])
    );

    const testsWithStatus = tests.map((test) => ({
      ...test.toObject(),
      hasSubmitted: submissionMap.has(test._id?.toString() || ''),
      submission: submissionMap.get(test._id?.toString() || '') || null,
      isActive: test.mode === 'live' ? test.isActive : isTestActive(test.startTime, test.endTime),
    }));

    res.json({ tests: testsWithStatus });
  } catch (error: any) {
    console.error('Get student tests error:', error);
    res.status(500).json({ error: error.message || 'Failed to get tests' });
  }
};

export const getTestDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const studentId = req.user!.userId;

    const test = await Test.findById(id).populate('classroomId', 'name students');

    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Verify student is in the classroom
    const classroom = await Classroom.findById(test.classroomId);
    if (!classroom || !classroom.students.some((sid) => sid.toString() === studentId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if student has already submitted
    const existingSubmission = await Submission.findOne({ testId: test._id, studentId });
    if (existingSubmission) {
      return res.status(409).json({ 
        error: 'You have already submitted this test',
        submission: existingSubmission,
      });
    }

    // Get questions without correct answers
    const questions = await Question.find({ testId: test._id }).select('-correctAnswer');

    res.json({
      test: {
        ...test.toObject(),
        isActive: test.mode === 'live' ? test.isActive : isTestActive(test.startTime, test.endTime),
      },
      questions,
    });
  } catch (error: any) {
    console.error('Get test details error:', error);
    res.status(500).json({ error: error.message || 'Failed to get test details' });
  }
};

export const joinLiveTest = async (req: Request, res: Response) => {
  try {
    const { joinCode } = req.body;
    const studentId = req.user!.userId;

    if (!joinCode) {
      return res.status(400).json({ error: 'Join code is required' });
    }

    const test = await Test.findOne({ joinCode, mode: 'live', isActive: true })
      .populate('classroomId', 'name students');

    if (!test) {
      return res.status(404).json({ error: 'Live test not found or not active' });
    }

    // Verify student is in the classroom
    const classroom = await Classroom.findById(test.classroomId);
    if (!classroom || !classroom.students.some((sid) => sid.toString() === studentId)) {
      return res.status(403).json({ error: 'You are not enrolled in this classroom' });
    }

    // Check if student has already submitted
    const existingSubmission = await Submission.findOne({ testId: test._id, studentId });
    if (existingSubmission) {
      return res.status(409).json({ 
        error: 'You have already submitted this test',
        submission: existingSubmission,
      });
    }

    // Get questions without correct answers
    const questions = await Question.find({ testId: test._id }).select('-correctAnswer');

    res.json({
      test,
      questions,
    });
  } catch (error: any) {
    console.error('Join live test error:', error);
    res.status(500).json({ error: error.message || 'Failed to join live test' });
  }
};

export const submitTest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // answers: [{ questionId, selectedAnswer }]
    const studentId = req.user!.userId;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers are required' });
    }

    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Verify student is in the classroom
    const classroom = await Classroom.findById(test.classroomId);
    if (!classroom || !classroom.students.some((sid) => sid.toString() === studentId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if student has already submitted
    const existingSubmission = await Submission.findOne({ testId: test._id, studentId });
    if (existingSubmission) {
      return res.status(409).json({ 
        error: 'You have already submitted this test',
        submission: existingSubmission,
      });
    }

    // Get all questions with correct answers
    const questions = await Question.find({ testId: test._id });
    const questionMap = new Map(questions.map((q) => [q._id?.toString(), q]));

    // Grade answers
    let correctCount = 0;
    const gradedAnswers = answers.map((answer) => {
      const question = questionMap.get(answer.questionId);
      const isCorrect = question ? question.correctAnswer === answer.selectedAnswer : false;
      if (isCorrect) correctCount++;

      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      };
    });

    const score = calculateScore(questions.length, correctCount);
    const submittedAt = new Date();
    const submittedLate = isSubmissionLate(submittedAt, test.endTime);

    // Create submission
    const submission = await Submission.create({
      testId: test._id,
      studentId,
      answers: gradedAnswers,
      score,
      submittedAt,
      submittedLate,
    });

    res.json({
      message: 'Test submitted successfully',
      submission,
      correctAnswers: correctCount,
      totalQuestions: questions.length,
      score,
    });
  } catch (error: any) {
    console.error('Submit test error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit test' });
  }
};

export const getTestResult = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const studentId = req.user!.userId;

    const submission = await Submission.findOne({ testId: id, studentId })
      .populate('testId', 'title description mode');

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Get questions with correct answers for review
    const questions = await Question.find({ testId: id });

    // Get ranking
    const allSubmissions = await Submission.find({ testId: id })
      .sort({ score: -1, submittedAt: 1 });

    const rank = allSubmissions.findIndex(
      (s) => s._id?.toString() === submission._id?.toString()
    ) + 1;

    res.json({
      submission,
      questions,
      rank,
      totalSubmissions: allSubmissions.length,
    });
  } catch (error: any) {
    console.error('Get test result error:', error);
    res.status(500).json({ error: error.message || 'Failed to get test result' });
  }
};
