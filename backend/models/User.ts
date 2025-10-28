import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'teacher' | 'student';
  enrollmentNumber?: string;
  rollNumber?: string;
  password: string;
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
          // Teacher email: name@pict.edu
          // Student email: enrollment@ms.pict.edu
          return /^[^\s@]+@(pict\.edu|ms\.pict\.edu)$/.test(email);
        },
        message: 'Invalid email format. Use @pict.edu for teachers or @ms.pict.edu for students',
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
  },
  {
    timestamps: true,
  }
);

// Validate role based on email domain
UserSchema.pre('save', function (next) {
  if (this.email.endsWith('@ms.pict.edu') && this.role !== 'student') {
    return next(new Error('Email domain @ms.pict.edu is for students only'));
  }
  if (this.email.endsWith('@pict.edu') && !this.email.endsWith('@ms.pict.edu') && this.role !== 'teacher') {
    return next(new Error('Email domain @pict.edu is for teachers only'));
  }
  next();
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
