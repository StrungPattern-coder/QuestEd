import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITest extends Document {
  classroomId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  mode: 'live' | 'deadline';
  questions: mongoose.Types.ObjectId[];
  startTime: Date;
  endTime: Date;
  timeLimitPerQuestion: number;
  isActive: boolean;
  isCompleted: boolean;
  joinCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestSchema: Schema<ITest> = new Schema(
  {
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: 'Classroom',
      required: [true, 'Classroom ID is required'],
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Test title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    mode: {
      type: String,
      enum: ['live', 'deadline'],
      required: [true, 'Test mode is required'],
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
    ],
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
      validate: {
        validator: function (endTime: Date) {
          return endTime > this.startTime;
        },
        message: 'End time must be after start time',
      },
    },
    timeLimitPerQuestion: {
      type: Number,
      required: [true, 'Time limit per question is required'],
      min: [5, 'Time limit must be at least 5 seconds'],
      max: [300, 'Time limit cannot exceed 300 seconds'],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    joinCode: {
      type: String,
      sparse: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
TestSchema.index({ classroomId: 1 });
TestSchema.index({ teacherId: 1 });
TestSchema.index({ startTime: 1, endTime: 1 });

const Test: Model<ITest> = mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);

export default Test;
