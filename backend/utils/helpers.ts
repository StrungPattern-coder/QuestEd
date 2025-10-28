import crypto from 'crypto';

export const generateJoinCode = (): string => {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
};

export const calculateScore = (totalQuestions: number, correctAnswers: number): number => {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
};

export const isTestActive = (startTime: Date, endTime: Date): boolean => {
  const now = new Date();
  return now >= startTime && now <= endTime;
};

export const isSubmissionLate = (submittedAt: Date, endTime: Date): boolean => {
  return submittedAt > endTime;
};

export const validateEmail = (email: string): { valid: boolean; role?: 'teacher' | 'student' } => {
  const studentPattern = /^[^\s@]+@ms\.pict\.edu$/;
  const teacherPattern = /^[^\s@]+@pict\.edu$/;

  if (studentPattern.test(email)) {
    return { valid: true, role: 'student' };
  }

  if (teacherPattern.test(email) && !email.endsWith('@ms.pict.edu')) {
    return { valid: true, role: 'teacher' };
  }

  return { valid: false };
};

export const parseCSVQuestions = (csvContent: string): Array<{
  questionText: string;
  options: string[];
  correctAnswer: string;
}> => {
  const lines = csvContent.trim().split('\n');
  const questions = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',').map((part) => part.trim());
    
    if (parts.length < 3) continue;

    const questionText = parts[0];
    const correctAnswer = parts[1];
    const options = parts.slice(2).filter((opt) => opt.length > 0);

    if (questionText && correctAnswer && options.length >= 2) {
      questions.push({
        questionText,
        options,
        correctAnswer,
      });
    }
  }

  return questions;
};
