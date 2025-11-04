import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISiteStats extends Document {
  totalVisitors: number;
  uniqueVisitors: string[]; // Store IP addresses or session IDs
  lastVisitDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SiteStatsSchema: Schema<ISiteStats> = new Schema(
  {
    totalVisitors: {
      type: Number,
      default: 0,
      min: 0,
    },
    uniqueVisitors: {
      type: [String],
      default: [],
    },
    lastVisitDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const SiteStats: Model<ISiteStats> =
  mongoose.models.SiteStats || mongoose.model<ISiteStats>('SiteStats', SiteStatsSchema);

export default SiteStats;
