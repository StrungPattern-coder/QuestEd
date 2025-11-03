import mongoose, { Schema, Document } from 'mongoose';

export interface ITeamsIntegration extends Document {
  userId: mongoose.Types.ObjectId;
  tenantId: string; // Microsoft tenant ID (organization)
  accountType: 'personal' | 'work' | 'school';
  accessToken: string; // Encrypted
  refreshToken: string; // Encrypted
  tokenExpiresAt: Date;
  microsoftUserId: string; // Microsoft user ID
  email: string;
  displayName: string;
  connectedAt: Date;
  lastSyncAt: Date;
  isActive: boolean;
  scopes: string[]; // Permissions granted
}

const TeamsIntegrationSchema = new Schema<ITeamsIntegration>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tenantId: {
      type: String,
      required: true,
      index: true,
    },
    accountType: {
      type: String,
      enum: ['personal', 'work', 'school'],
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
      select: false, // Don't return by default
    },
    refreshToken: {
      type: String,
      required: true,
      select: false, // Don't return by default
    },
    tokenExpiresAt: {
      type: Date,
      required: true,
    },
    microsoftUserId: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    connectedAt: {
      type: Date,
      default: Date.now,
    },
    lastSyncAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    scopes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
TeamsIntegrationSchema.index({ userId: 1, isActive: 1 });
TeamsIntegrationSchema.index({ microsoftUserId: 1, tenantId: 1 }, { unique: true });

// Methods to check if token needs refresh
TeamsIntegrationSchema.methods.isTokenExpired = function (): boolean {
  return this.tokenExpiresAt && this.tokenExpiresAt < new Date();
};

const TeamsIntegration = mongoose.models.TeamsIntegration || 
  mongoose.model<ITeamsIntegration>('TeamsIntegration', TeamsIntegrationSchema);

export default TeamsIntegration;
