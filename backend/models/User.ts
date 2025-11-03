import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'teacher' | 'student';
  enrollmentNumber?: string;
  rollNumber?: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  walkthroughCompleted?: boolean;
  microsoftUserId?: string;
  needsPasswordReset?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (email: string) {
          // Accept any valid email format
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: 'Invalid email format',
      },
    },
    role: {
      type: String,
      enum: ['teacher', 'student'],
      required: [true, 'Role is required'],
    },
    enrollmentNumber: {
      type: String,
      sparse: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    walkthroughCompleted: {
      type: Boolean,
      default: false,
    },
    microsoftUserId: {
      type: String,
      sparse: true,
      unique: true,
    },
    needsPasswordReset: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// No email domain validation - users can choose their role freely
UserSchema.pre('save', function (next) {
  next();
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
