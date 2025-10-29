import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  classroomId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  priority: 'low' | 'medium' | 'high';
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: 'Classroom',
      required: [true, 'Classroom is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
AnnouncementSchema.index({ classroomId: 1, pinned: -1, createdAt: -1 });
AnnouncementSchema.index({ createdBy: 1 });

const Announcement: Model<IAnnouncement> = mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

export default Announcement;
