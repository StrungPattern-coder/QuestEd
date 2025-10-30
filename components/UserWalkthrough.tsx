'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ChevronLeft, ChevronRight, Check, 
  Users, ClipboardList, Zap, Trophy, Bell, 
  BookOpen, UserPlus, Mail, Target, Award
} from 'lucide-react';

interface WalkthroughStep {
  title: string;
  description: string;
  icon: any;
  highlightSelector?: string;
  action?: string;
}

const teacherSteps: WalkthroughStep[] = [
  {
    title: 'Welcome to QuestEd! 🎉',
    description: 'As a teacher, you can create classrooms, invite students, create tests, and host live quizzes. Let\'s get you started!',
    icon: Trophy,
  },
  {
    title: 'Create Your First Classroom',
    description: 'Classrooms help you organize students by subject or grade. Click "Create Classroom" to start.',
    icon: Users,
    action: 'Navigate to classrooms section',
  },
  {
    title: 'Invite Students',
    description: 'Add students to your classroom using their email addresses. They\'ll receive an invitation with a join link.',
    icon: UserPlus,
  },
  {
    title: 'Create Tests & Quizzes',
    description: 'Design custom tests with multiple question types, or host live Quick Quizzes for interactive learning.',
    icon: ClipboardList,
  },
  {
    title: 'Monitor Performance',
    description: 'View student submissions, track progress, and access analytics to identify areas for improvement.',
    icon: Target,
  },
  {
    title: 'Stay Notified',
    description: 'Click the bell icon 🔔 to see real-time notifications for student activities and submissions.',
    icon: Bell,
  },
  {
    title: 'You\'re All Set! 🚀',
    description: 'Start creating your first classroom and invite students. Check "How to Use" in the footer for detailed guides.',
    icon: Award,
  },
];

const studentSteps: WalkthroughStep[] = [
  {
    title: 'Welcome to QuestEd! 🎉',
    description: 'As a student, you can join classrooms, take tests, participate in live quizzes, and track your progress. Let\'s explore!',
    icon: Trophy,
  },
  {
    title: 'Join Classrooms',
    description: 'Wait for your teacher to send you a classroom invitation via email. Click the join link to accept.',
    icon: Users,
  },
  {
    title: 'Check Notifications',
    description: 'Click the bell icon 🔔 for real-time notifications about classroom invites, test assignments, and results.',
    icon: Bell,
  },
  {
    title: 'Take Tests',
    description: 'Complete assigned tests before the deadline. Read instructions carefully and watch the timer!',
    icon: ClipboardList,
  },
  {
    title: 'Join Quick Quizzes',
    description: 'Participate in live quizzes using a 6-digit code from your teacher. Answer fast to climb the leaderboard!',
    icon: Zap,
  },
  {
    title: 'Question of the Day',
    description: 'Answer daily questions to build your streak and earn points. New questions appear every 24 hours.',
    icon: BookOpen,
  },
  {
    title: 'Track Your Progress',
    description: 'View your scores, rankings, and achievements on your profile. Compete with classmates in a healthy way!',
    icon: Target,
  },
  {
    title: 'You\'re Ready! 🚀',
    description: 'Wait for classroom invitations and start learning. Check "How to Use" in the footer for detailed guides.',
    icon: Award,
  },
];

interface UserWalkthroughProps {
  role: 'student' | 'teacher';
  onComplete: () => void;
  onSkip: () => void;
}

export default function UserWalkthrough({ role, onComplete, onSkip }: UserWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const steps = role === 'teacher' ? teacherSteps : studentSteps;
  const CurrentIcon = steps[currentStep].icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(onComplete, 300);
  };

  const handleSkipWalkthrough = () => {
    setIsVisible(false);
    setTimeout(onSkip, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleSkipWalkthrough}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden h-full md:h-auto flex flex-col">
              {/* Header */}
              <div className="relative px-8 pt-8 pb-6 border-b border-purple-500/30">
                <button
                  onClick={handleSkipWalkthrough}
                  className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close walkthrough"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                    <span className="text-sm text-purple-400 font-semibold">
                      {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Role Badge */}
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-full text-orange-400 text-sm font-semibold mb-4">
                  {role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'} Guide
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 py-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/50"
                    >
                      <CurrentIcon className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {steps[currentStep].title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-300 text-lg leading-relaxed max-w-xl mx-auto">
                      {steps[currentStep].description}
                    </p>

                    {/* Action Hint */}
                    {steps[currentStep].action && (
                      <div className="mt-6 inline-block px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-300 text-sm">
                        💡 {steps[currentStep].action}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-purple-500/30 bg-black/30">
                <div className="flex items-center justify-between gap-4">
                  {/* Back Button */}
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      currentStep === 0
                        ? 'opacity-0 pointer-events-none'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Back</span>
                  </button>

                  {/* Step Indicators */}
                  <div className="flex gap-2">
                    {steps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentStep
                            ? 'w-8 bg-gradient-to-r from-orange-500 to-orange-600'
                            : index < currentStep
                            ? 'bg-orange-500/50'
                            : 'bg-gray-700'
                        }`}
                        aria-label={`Go to step ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Next/Complete Button */}
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Get Started</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Next</span>
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Skip Button */}
                <div className="mt-4 text-center">
                  <button
                    onClick={handleSkipWalkthrough}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Skip walkthrough
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
