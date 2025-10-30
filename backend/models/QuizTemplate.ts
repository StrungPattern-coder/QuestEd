import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Quiz Template Model
 * 
 * Purpose: Store reusable quiz templates that can be cloned by teachers
 * Features:
 * - Public/private visibility
 * - Category organization
 * - Search and filtering
 * - Clone tracking and ratings
 * - Question embedding for faster loading
 */

export interface ITemplateQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
}

export interface IQuizTemplate extends Document {
  title: string;
  description: string;
  category: string;
  tags: string[];
  questions: ITemplateQuestion[];
  visibility: 'public' | 'private';
  authorId?: mongoose.Types.ObjectId;
  authorName: string;
  timeLimitPerQuestion: number;
  cloneCount: number;
  rating: number;
  ratingCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // in minutes
  thumbnail?: string;
  isOfficial: boolean; // QuestEd official templates
  createdAt: Date;
  updatedAt: Date;
}

const TemplateQuestionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function (options: string[]) {
        return options.length >= 2 && options.length <= 6;
      },
      message: 'Question must have between 2 and 6 options',
    },
  },
  correctAnswer: {
    type: String,
    required: true,
  },
}, { _id: false });

const QuizTemplateSchema: Schema<IQuizTemplate> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Template title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Education',
        'Science',
        'Math',
        'History',
        'Geography',
        'Language',
        'Corporate Training',
        'Trivia',
        'Entertainment',
        'Sports',
        'Technology',
        'Art & Culture',
        'Health & Wellness',
        'Business',
        'Other',
      ],
      index: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10;
        },
        message: 'Cannot have more than 10 tags',
      },
    },
    questions: {
      type: [TemplateQuestionSchema],
      required: [true, 'Questions are required'],
      validate: {
        validator: function (questions: ITemplateQuestion[]) {
          return questions.length >= 1 && questions.length <= 100;
        },
        message: 'Template must have between 1 and 100 questions',
      },
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'private',
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      sparse: true, // Allow null for guest-created templates
    },
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    timeLimitPerQuestion: {
      type: Number,
      required: [true, 'Time limit per question is required'],
      min: [5, 'Time limit must be at least 5 seconds'],
      max: [300, 'Time limit cannot exceed 300 seconds'],
      default: 30,
    },
    cloneCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
      index: true,
    },
    estimatedTime: {
      type: Number,
      default: function() {
        return Math.ceil((this.questions.length * this.timeLimitPerQuestion) / 60);
      },
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    isOfficial: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient searching and filtering
QuizTemplateSchema.index({ category: 1, visibility: 1 });
QuizTemplateSchema.index({ cloneCount: -1 }); // Popular templates
QuizTemplateSchema.index({ rating: -1, ratingCount: -1 }); // Top-rated templates
QuizTemplateSchema.index({ createdAt: -1 }); // Recent templates
QuizTemplateSchema.index({ authorId: 1 });

// Text index for full-text search
QuizTemplateSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text',
  category: 'text'
}, {
  weights: {
    title: 10,
    tags: 5,
    category: 3,
    description: 1,
  },
  name: 'template_text_search'
});

// Virtual for average rating display
QuizTemplateSchema.virtual('averageRating').get(function() {
  if (this.ratingCount === 0) return 0;
  return Math.round((this.rating / this.ratingCount) * 10) / 10;
});

// Method to increment clone count
QuizTemplateSchema.methods.incrementCloneCount = async function() {
  this.cloneCount += 1;
  await this.save();
};

// Method to add rating
QuizTemplateSchema.methods.addRating = async function(ratingValue: number) {
  if (ratingValue < 1 || ratingValue > 5) {
    throw new Error('Rating must be between 1 and 5');
  }
  this.rating += ratingValue;
  this.ratingCount += 1;
  await this.save();
};

const QuizTemplate: Model<IQuizTemplate> = 
  mongoose.models.QuizTemplate || mongoose.model<IQuizTemplate>('QuizTemplate', QuizTemplateSchema);

export default QuizTemplate;
