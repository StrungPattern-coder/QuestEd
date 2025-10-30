import mongoose, { Schema, Document, Model } from 'mongoose';

interface IAnswer {
  questionId: mongoose.Types.ObjectId;
  selectedAnswer: string;
  isCorrect: boolean;
  points?: number; // Points earned for this answer (for live tests with time-based scoring)
  timeSpent?: number; // Time spent on this question in seconds
}

export interface ISubmission extends Document {
  testId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  answers: IAnswer[];
  score: number;
  maxScore?: number; // Maximum possible score
  submittedAt: Date;
  submittedLate: boolean;
}

const AnswerSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedAnswer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
    points: {
      type: Number,
      min: 0,
      default: 0,
    },
    timeSpent: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

const SubmissionSchema: Schema<ISubmission> = new Schema(
  {
    testId: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
      required: [true, 'Test ID is required'],
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    answers: [AnswerSchema],
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    maxScore: {
      type: Number,
      min: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    submittedLate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one submission per student per test
SubmissionSchema.index({ testId: 1, studentId: 1 }, { unique: true });
SubmissionSchema.index({ testId: 1 });
SubmissionSchema.index({ studentId: 1 });

const Submission: Model<ISubmission> =
  mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
