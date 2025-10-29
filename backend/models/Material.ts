import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMaterial extends Document {
  title: string;
  description?: string;
  type: 'pdf' | 'image' | 'video' | 'link' | 'document';
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  classroomId: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['pdf', 'image', 'video', 'link', 'document'],
      required: [true, 'Material type is required'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    fileName: {
      type: String,
    },
    fileSize: {
      type: Number, // in bytes
    },
    classroomId: {
      type: Schema.Types.ObjectId,
      ref: 'Classroom',
      required: [true, 'Classroom is required'],
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
MaterialSchema.index({ classroomId: 1, createdAt: -1 });
MaterialSchema.index({ uploadedBy: 1 });

const Material: Model<IMaterial> = mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);

export default Material;
