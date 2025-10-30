import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Test Model
 * 
 * IMPORTANT: Automatic Cleanup Policy
 * ====================================
 * - Quick Quizzes (guest quizzes): Automatically deleted after 24 hours via TTL index
 *   - Identified by: NO teacherId, NO classroomId, HAS hostName
 *   - Related questions are cascaded deleted automatically
 * 
 * - Teacher Tests (classroom tests): Stored permanently for record-keeping
 *   - Identified by: HAS teacherId OR classroomId
 *   - Never auto-deleted, can only be manually deleted by teacher
 */

export interface ITest extends Document {
  classroomId?: mongoose.Types.ObjectId;
  teacherId?: mongoose.Types.ObjectId;
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
  hostName?: string; // For guest quizzes without teacher
  createdAt: Date;
  updatedAt: Date;
}

const TestSchema: Schema<ITest> = new Schema(
  {
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: 'Classroom',
      required: false, // Optional for guest quizzes
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for guest quizzes
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
      default: Date.now, // Default to now for quick quizzes
    },
    endTime: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Default 24h from now
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
    hostName: {
      type: String,
      trim: true,
      // For guest/quick quizzes without teacher accounts
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

// TTL Index for Quick Quizzes ONLY (automatic cleanup after 24 hours)
// This ONLY applies to guest/quick quizzes without teachers or classrooms
// Teacher-created tests are preserved forever for record-keeping
TestSchema.index(
  { createdAt: 1 }, 
  { 
    expireAfterSeconds: 86400, // 24 hours = 86400 seconds
    partialFilterExpression: { 
      $and: [
        { teacherId: { $exists: false } },      // No teacher = quick quiz
        { classroomId: { $exists: false } },    // No classroom = quick quiz
        { hostName: { $exists: true } }         // Has hostName = quick quiz
      ]
    },
    name: 'quick_quiz_ttl_index'
  }
);

// Middleware to cascade delete questions when a test is deleted
TestSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    const Question = mongoose.model('Question');
    await Question.deleteMany({ testId: this._id });
    next();
  } catch (error: any) {
    next(error);
  }
});

// Handle findOneAndDelete and findByIdAndDelete
TestSchema.pre('findOneAndDelete', async function(next) {
  try {
    const doc = await this.model.findOne(this.getFilter());
    if (doc) {
      const Question = mongoose.model('Question');
      await Question.deleteMany({ testId: doc._id });
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

const Test: Model<ITest> = mongoose.models.Test || mongoose.model<ITest>('Test', TestSchema);

export default Test;
