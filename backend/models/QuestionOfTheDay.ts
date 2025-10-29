import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestionOfTheDay extends Document {
  question: string;
  optionA: string;
  optionB: string;
  date: Date;
  votesA: number;
  votesB: number;
  isActive: boolean;
  category: string; // e.g., "Sports", "Entertainment", "Food", "Tech"
  createdAt: Date;
  updatedAt: Date;
}

const QuestionOfTheDaySchema: Schema<IQuestionOfTheDay> = new Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    optionA: {
      type: String,
      required: [true, 'Option A is required'],
      trim: true,
    },
    optionB: {
      type: String,
      required: [true, 'Option B is required'],
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      unique: true,
      index: true,
    },
    votesA: {
      type: Number,
      default: 0,
      min: 0,
    },
    votesB: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ['Sports', 'Entertainment', 'Food', 'Tech', 'General'],
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
QuestionOfTheDaySchema.index({ date: -1, isActive: 1 });

const QuestionOfTheDay: Model<IQuestionOfTheDay> = 
  mongoose.models.QuestionOfTheDay || 
  mongoose.model<IQuestionOfTheDay>('QuestionOfTheDay', QuestionOfTheDaySchema);

export default QuestionOfTheDay;
