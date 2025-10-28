import mongoose, { Schema, Document, Model } from 'mongoose';

interface IRanking {
  studentId: mongoose.Types.ObjectId;
  score: number;
  rank: number;
}

interface IOverallRanking {
  studentId: mongoose.Types.ObjectId;
  totalScore: number;
}

export interface ILeaderboard extends Document {
  classroomId: mongoose.Types.ObjectId;
  testId?: mongoose.Types.ObjectId;
  rankings: IRanking[];
  overallRankings?: IOverallRanking[];
  updatedAt: Date;
}

const RankingSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
    },
    rank: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const OverallRankingSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const LeaderboardSchema: Schema<ILeaderboard> = new Schema(
  {
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: 'Classroom',
      required: [true, 'Classroom ID is required'],
    },
    testId: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
    },
    rankings: [RankingSchema],
    overallRankings: [OverallRankingSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
LeaderboardSchema.index({ classroomId: 1, testId: 1 });
LeaderboardSchema.index({ testId: 1 });

const Leaderboard: Model<ILeaderboard> =
  mongoose.models.Leaderboard || mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);

export default Leaderboard;
