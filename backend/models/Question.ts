import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion extends Document {
  testId: mongoose.Types.ObjectId;
  questionText: string;
  options: string[];
  correctAnswer: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema<IQuestion> = new Schema(
  {
    testId: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
      required: [true, 'Test ID is required'],
    },
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: {
        validator: function (options: string[]) {
          return options.length >= 2 && options.length <= 6;
        },
        message: 'Question must have between 2 and 6 options',
      },
    },
    correctAnswer: {
      type: String,
      required: [true, 'Correct answer is required'],
      validate: {
        validator: function (answer: string) {
          return this.options.includes(answer);
        },
        message: 'Correct answer must be one of the options',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
QuestionSchema.index({ testId: 1 });

const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);

export default Question;
