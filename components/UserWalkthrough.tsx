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
            className="fixed inset-0 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-2xl max-h-[90vh] bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden flex flex-col my-auto">
              {/* Header */}
              <div className="relative px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-purple-500/30 flex-shrink-0">
                <button
                  onClick={handleSkipWalkthrough}
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close walkthrough"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs sm:text-sm text-gray-400">
                      Step {currentStep + 1} of {steps.length}
                    </span>
                    <span className="text-xs sm:text-sm text-purple-400 font-semibold">
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
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-full text-orange-400 text-xs sm:text-sm font-semibold">
                  {role === 'teacher' ? '👨‍🏫 Teacher' : '🎓 Student'} Guide
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 sm:py-8 min-h-0">
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
                      className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/50"
                    >
                      <CurrentIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-2">
                      {steps[currentStep].title}
                    </h2>

                    {/* Description */}
                    <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-xl mx-auto px-2">
                      {steps[currentStep].description}
                    </p>

                    {/* Action Hint */}
                    {steps[currentStep].action && (
                      <div className="mt-4 sm:mt-6 inline-block px-3 sm:px-4 py-2 bg-purple-900/30 border border-purple-500/30 rounded-lg text-purple-300 text-xs sm:text-sm">
                        💡 {steps[currentStep].action}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 sm:px-8 py-4 sm:py-6 border-t border-purple-500/30 bg-black/30 flex-shrink-0">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  {/* Back Button */}
                  <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all text-sm sm:text-base ${
                      currentStep === 0
                        ? 'opacity-0 pointer-events-none'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Back</span>
                  </button>

                  {/* Step Indicators */}
                  <div className="flex gap-1.5 sm:gap-2">
                    {steps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                          index === currentStep
                            ? 'w-6 sm:w-8 bg-gradient-to-r from-orange-500 to-orange-600'
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
                    className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all text-sm sm:text-base whitespace-nowrap"
                  >
                    {currentStep === steps.length - 1 ? (
                      <>
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Start</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </>
                    )}
                  </button>
                </div>

                {/* Skip Button */}
                <div className="mt-3 sm:mt-4 text-center">
                  <button
                    onClick={handleSkipWalkthrough}
                    className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
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
