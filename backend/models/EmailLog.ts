import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmailLog extends Document {
  to: string;
  subject: string;
  type: 'welcome' | 'passwordReset' | 'classroomInvitation' | 'testNotification' | 'testReminder' | 'testResult' | 'teacherSummary' | 'accountActivity';
  status: 'sent' | 'failed' | 'bounced';
  messageId?: string;
  trackingId?: string; // Custom tracking ID for email opens/clicks
  opened: boolean;
  openedAt?: Date;
  clickedLinks: string[];
  clickedAt?: Date[];
  errorMessage?: string;
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailLogSchema: Schema<IEmailLog> = new Schema(
  {
    to: {
      type: String,
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'welcome',
        'passwordReset',
        'classroomInvitation',
        'testNotification',
        'testReminder',
        'testResult',
        'teacherSummary',
        'accountActivity',
      ],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['sent', 'failed', 'bounced'],
      default: 'sent',
      index: true,
    },
    messageId: {
      type: String,
      sparse: true,
    },
    trackingId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    opened: {
      type: Boolean,
      default: false,
      index: true,
    },
    openedAt: {
      type: Date,
    },
    clickedLinks: {
      type: [String],
      default: [],
    },
    clickedAt: {
      type: [Date],
      default: [],
    },
    errorMessage: {
      type: String,
    },
    sentAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for analytics queries
EmailLogSchema.index({ type: 1, sentAt: -1 });
EmailLogSchema.index({ to: 1, sentAt: -1 });

const EmailLog: Model<IEmailLog> =
  mongoose.models.EmailLog || mongoose.model<IEmailLog>('EmailLog', EmailLogSchema);

export default EmailLog;
