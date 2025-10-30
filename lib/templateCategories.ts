import {
  GraduationCap,
  Microscope,
  Calculator,
  Globe,
  BookOpen,
  Languages,
  Briefcase,
  Sparkles,
  Gamepad,
  Trophy,
  Laptop,
  Palette,
  Heart,
  TrendingUp,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

/**
 * Template Categories Configuration
 * 
 * Defines all available quiz template categories with:
 * - Display names
 * - Icon components
 * - Color schemes
 * - Descriptions
 */

export interface TemplateCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  description: string;
  examples: string[];
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'Education',
    name: 'Education',
    icon: GraduationCap,
    color: '#3B82F6', // blue-500
    gradient: 'from-blue-500 to-blue-600',
    description: 'General educational content and learning materials',
    examples: ['Study guides', 'Test prep', 'Homework practice'],
  },
  {
    id: 'Science',
    name: 'Science',
    icon: Microscope,
    color: '#8B5CF6', // violet-500
    gradient: 'from-violet-500 to-purple-600',
    description: 'Biology, Chemistry, Physics, and Natural Sciences',
    examples: ['Lab experiments', 'Scientific concepts', 'Research topics'],
  },
  {
    id: 'Math',
    name: 'Math',
    icon: Calculator,
    color: '#10B981', // emerald-500
    gradient: 'from-emerald-500 to-green-600',
    description: 'Mathematics, Algebra, Geometry, and Calculus',
    examples: ['Problem solving', 'Formulas', 'Calculations'],
  },
  {
    id: 'History',
    name: 'History',
    icon: BookOpen,
    color: '#F59E0B', // amber-500
    gradient: 'from-amber-500 to-orange-600',
    description: 'Historical events, dates, and civilizations',
    examples: ['World history', 'Historical figures', 'Time periods'],
  },
  {
    id: 'Geography',
    name: 'Geography',
    icon: Globe,
    color: '#06B6D4', // cyan-500
    gradient: 'from-cyan-500 to-blue-600',
    description: 'Countries, capitals, maps, and world geography',
    examples: ['World capitals', 'Landmarks', 'Continents'],
  },
  {
    id: 'Language',
    name: 'Language',
    icon: Languages,
    color: '#EC4899', // pink-500
    gradient: 'from-pink-500 to-rose-600',
    description: 'Languages, vocabulary, grammar, and literature',
    examples: ['Vocabulary', 'Grammar rules', 'Literature'],
  },
  {
    id: 'Corporate Training',
    name: 'Corporate Training',
    icon: Briefcase,
    color: '#6366F1', // indigo-500
    gradient: 'from-indigo-500 to-blue-600',
    description: 'Professional development and workplace training',
    examples: ['Onboarding', 'Compliance', 'Skill development'],
  },
  {
    id: 'Trivia',
    name: 'Trivia',
    icon: Sparkles,
    color: '#F97316', // orange-500
    gradient: 'from-orange-500 to-red-600',
    description: 'Fun facts, general knowledge, and trivia questions',
    examples: ['Pop culture', 'Fun facts', 'General knowledge'],
  },
  {
    id: 'Entertainment',
    name: 'Entertainment',
    icon: Gamepad,
    color: '#A855F7', // purple-500
    gradient: 'from-purple-500 to-fuchsia-600',
    description: 'Movies, music, TV shows, and pop culture',
    examples: ['Movie trivia', 'Music knowledge', 'TV shows'],
  },
  {
    id: 'Sports',
    name: 'Sports',
    icon: Trophy,
    color: '#EAB308', // yellow-500
    gradient: 'from-yellow-500 to-orange-600',
    description: 'Sports history, rules, and athletic knowledge',
    examples: ['Sports history', 'Rules', 'Athletes'],
  },
  {
    id: 'Technology',
    name: 'Technology',
    icon: Laptop,
    color: '#14B8A6', // teal-500
    gradient: 'from-teal-500 to-cyan-600',
    description: 'Programming, software, hardware, and tech trends',
    examples: ['Coding', 'Software', 'Tech trends'],
  },
  {
    id: 'Art & Culture',
    name: 'Art & Culture',
    icon: Palette,
    color: '#F43F5E', // rose-500
    gradient: 'from-rose-500 to-pink-600',
    description: 'Arts, culture, music, and creative subjects',
    examples: ['Art history', 'Artists', 'Cultural movements'],
  },
  {
    id: 'Health & Wellness',
    name: 'Health & Wellness',
    icon: Heart,
    color: '#EF4444', // red-500
    gradient: 'from-red-500 to-rose-600',
    description: 'Health, fitness, nutrition, and wellness topics',
    examples: ['Nutrition', 'Fitness', 'Mental health'],
  },
  {
    id: 'Business',
    name: 'Business',
    icon: TrendingUp,
    color: '#0EA5E9', // sky-500
    gradient: 'from-sky-500 to-blue-600',
    description: 'Business, economics, marketing, and finance',
    examples: ['Marketing', 'Finance', 'Economics'],
  },
  {
    id: 'Other',
    name: 'Other',
    icon: HelpCircle,
    color: '#64748B', // slate-500
    gradient: 'from-slate-500 to-gray-600',
    description: 'Miscellaneous topics and custom categories',
    examples: ['Mixed topics', 'Custom content', 'Various subjects'],
  },
];

/**
 * Get category by ID
 */
export function getCategoryById(id: string): TemplateCategory | undefined {
  return TEMPLATE_CATEGORIES.find(cat => cat.id === id);
}

/**
 * Get category color
 */
export function getCategoryColor(id: string): string {
  return getCategoryById(id)?.color || '#64748B';
}

/**
 * Get category gradient
 */
export function getCategoryGradient(id: string): string {
  return getCategoryById(id)?.gradient || 'from-slate-500 to-gray-600';
}

/**
 * Get category icon
 */
export function getCategoryIcon(id: string): LucideIcon {
  return getCategoryById(id)?.icon || HelpCircle;
}

/**
 * Difficulty levels configuration
 */
export interface DifficultyLevel {
  id: 'easy' | 'medium' | 'hard';
  name: string;
  color: string;
  badge: string;
  description: string;
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    id: 'easy',
    name: 'Easy',
    color: '#10B981', // emerald-500
    badge: 'bg-emerald-100 text-emerald-700',
    description: 'Beginner-friendly questions',
  },
  {
    id: 'medium',
    name: 'Medium',
    color: '#F59E0B', // amber-500
    badge: 'bg-amber-100 text-amber-700',
    description: 'Moderate difficulty level',
  },
  {
    id: 'hard',
    name: 'Hard',
    color: '#EF4444', // red-500
    badge: 'bg-red-100 text-red-700',
    description: 'Advanced and challenging',
  },
];

/**
 * Get difficulty by ID
 */
export function getDifficultyById(id: 'easy' | 'medium' | 'hard'): DifficultyLevel | undefined {
  return DIFFICULTY_LEVELS.find(diff => diff.id === id);
}
