import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClassroom extends Document {
  teacherId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  students: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ClassroomSchema: Schema<IClassroom> = new Schema(
  {
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Classroom name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ClassroomSchema.index({ teacherId: 1 });
ClassroomSchema.index({ students: 1 });

const Classroom: Model<IClassroom> =
  mongoose.models.Classroom || mongoose.model<IClassroom>('Classroom', ClassroomSchema);

export default Classroom;
