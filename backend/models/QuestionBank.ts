import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestionBank extends Document {
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option (0-3)
  difficulty: 'easy' | 'medium' | 'hard';
  subject?: string;
  topic?: string;
  tags: string[];
  explanation?: string;
  createdBy: mongoose.Types.ObjectId;
  timesUsed: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionBankSchema = new Schema<IQuestionBank>(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: {
        validator: function(v: string[]) {
          return v.length === 4;
        },
        message: 'Must provide exactly 4 options',
      },
    },
    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer is required'],
      min: 0,
      max: 3,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    subject: {
      type: String,
      trim: true,
    },
    topic: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    explanation: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
QuestionBankSchema.index({ createdBy: 1 });
QuestionBankSchema.index({ subject: 1, difficulty: 1 });
QuestionBankSchema.index({ tags: 1 });
QuestionBankSchema.index({ createdAt: -1 });

const QuestionBank: Model<IQuestionBank> = mongoose.models.QuestionBank || mongoose.model<IQuestionBank>('QuestionBank', QuestionBankSchema);

export default QuestionBank;
