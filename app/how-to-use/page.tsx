'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Book, Users, ClipboardList, Zap, Trophy, Bell, 
  ChevronDown, ChevronRight, GraduationCap, UserCheck,
  FileText, BarChart3, Clock, Award, Target, Mail, ArrowLeft
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  icon: any;
  content: {
    subtitle: string;
    description: string;
    steps?: string[];
    tips?: string[];
  }[];
}

const sections: Section[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: GraduationCap,
    content: [
      {
        subtitle: 'Creating Your Account',
        description: 'Sign up with your email and choose your role (Teacher or Student).',
        steps: [
          'Click "Sign Up" from the homepage',
          'Enter your name, email, and password',
          'Select your role: Teacher or Student',
          'For students: optionally add enrollment/roll number',
          'Click "Create Account" and verify your email'
        ],
        tips: [
          'Use a valid email address to receive important notifications',
          'Choose a strong password with at least 8 characters',
          'Teachers and students have different features'
        ]
      },
      {
        subtitle: 'Logging In',
        description: 'Access your dashboard with your credentials.',
        steps: [
          'Click "Login" from the homepage',
          'Enter your registered email and password',
          'Click "Sign In" to access your dashboard'
        ]
      }
    ]
  },
  {
    id: 'for-teachers',
    title: 'For Teachers',
    icon: UserCheck,
    content: [
      {
        subtitle: 'Creating a Classroom',
        description: 'Set up virtual classrooms to organize your students.',
        steps: [
          'Go to your dashboard and click "Create Classroom"',
          'Enter classroom name (e.g., "Math 101", "Physics Grade 10")',
          'Add an optional description',
          'Set the subject area',
          'Click "Create" to finalize'
        ],
        tips: [
          'Use descriptive names to help students identify the right class',
          'You can create multiple classrooms for different subjects'
        ]
      },
      {
        subtitle: 'Inviting Students',
        description: 'Add students to your classroom via email invitations.',
        steps: [
          'Open the classroom you want to add students to',
          'Click "Invite Students"',
          'Enter student email addresses (one per line or comma-separated)',
          'Click "Send Invitations"',
          'Students will receive an email with a join link'
        ],
        tips: [
          'Students get real-time notifications when invited',
          'Invitations are valid for 7 days',
          'Students must have an account to accept invitations'
        ]
      },
      {
        subtitle: 'Creating Tests',
        description: 'Design custom tests with various question types.',
        steps: [
          'Navigate to "Question Bank" or your classroom',
          'Click "Create New Test"',
          'Add test title and description',
          'Set duration, passing marks, and total marks',
          'Add questions: Multiple choice, True/False, Short answer',
          'Set correct answers and point values',
          'Assign to specific classrooms',
          'Publish the test'
        ],
        tips: [
          'Save drafts and edit before publishing',
          'You can import questions from CSV files',
          'Set deadlines to create urgency'
        ]
      },
      {
        subtitle: 'Quick Quizzes (Live)',
        description: 'Host interactive live quizzes like Kahoot.',
        steps: [
          'Click "Quick Quiz" from the dashboard',
          'Click "Create Quick Quiz"',
          'Add quiz title and time limit per question (5-300 seconds)',
          'Add multiple choice questions (2-4 options)',
          'Click "Create Quiz" to generate a join code',
          'Share the code with students',
          'Wait for participants to join',
          'Click "Start Quiz" when ready',
          'Monitor live leaderboard as students answer',
          'View final results and podium'
        ],
        tips: [
          'Quick quizzes auto-delete after 24 hours',
          'Students can join using code + name (no account needed)',
          'Perfect for reviewing material or ice-breakers',
          'Real-time leaderboard keeps students engaged'
        ]
      },
      {
        subtitle: 'Viewing Results',
        description: 'Track student performance and analytics.',
        steps: [
          'Go to your classroom',
          'Click on a published test',
          'View "Submissions" tab',
          'See student scores, time taken, and answers',
          'Export results as CSV if needed'
        ],
        tips: [
          'Use analytics to identify struggling students',
          'Compare class averages across tests',
          'Provide feedback through comments'
        ]
      }
    ]
  },
  {
    id: 'for-students',
    title: 'For Students',
    icon: Users,
    content: [
      {
        subtitle: 'Joining a Classroom',
        description: 'Accept invitations from your teachers.',
        steps: [
          'Check your email for classroom invitation',
          'Click the "Join Classroom" button in the email',
          'Or click the bell icon 🔔 for real-time notifications',
          'Click "Accept" on the invitation',
          'Classroom will appear in your dashboard'
        ],
        tips: [
          'Enable browser notifications for instant alerts',
          'You can join multiple classrooms',
          'Ask your teacher for a new invite if it expired'
        ]
      },
      {
        subtitle: 'Taking Tests',
        description: 'Complete assigned tests within the deadline.',
        steps: [
          'Go to your classroom dashboard',
          'Find assigned tests under "Active Tests"',
          'Click "Start Test" (note: timer starts immediately)',
          'Answer all questions',
          'Click "Submit" before time runs out',
          'View your score and correct answers'
        ],
        tips: [
          'Read all questions carefully before starting',
          'Watch the timer at the top',
          'You cannot retake tests once submitted',
          'Review results to learn from mistakes'
        ]
      },
      {
        subtitle: 'Joining Quick Quizzes',
        description: 'Participate in live quizzes using a join code.',
        steps: [
          'Get the 6-digit code from your teacher',
          'Go to Quick Quiz page',
          'Enter the code and your name',
          'Click "Join Quiz"',
          'Wait for the host to start',
          'Answer questions as fast as possible',
          'See your rank on the live leaderboard',
          'Celebrate your score at the end!'
        ],
        tips: [
          'Speed matters - faster correct answers earn more points',
          'Watch out for the time limit per question',
          'See celebrations and podium for top 3 finishers',
          'No account needed - great for guest participation'
        ]
      },
      {
        subtitle: 'Question of the Day',
        description: 'Answer daily questions to maintain your streak.',
        steps: [
          'Check your dashboard daily',
          'Find "Question of the Day" widget',
          'Read the question and options',
          'Select your answer',
          'Get instant feedback',
          'Earn streak points for consecutive days'
        ],
        tips: [
          'New question appears every 24 hours',
          'Build streaks to climb the leaderboard',
          'Questions cover various subjects'
        ]
      },
      {
        subtitle: 'Tracking Progress',
        description: 'Monitor your performance and achievements.',
        steps: [
          'Visit your profile page',
          'View test scores and averages',
          'Check your classroom rankings',
          'See earned badges and achievements',
          'Track your learning streaks'
        ],
        tips: [
          'Set personal goals to improve scores',
          'Compare with class averages',
          'Celebrate milestones and achievements'
        ]
      }
    ]
  },
  {
    id: 'features',
    title: 'Key Features',
    icon: Zap,
    content: [
      {
        subtitle: 'Real-Time Notifications',
        description: 'Stay updated with instant alerts.',
        steps: [
          'Click the bell icon 🔔 in the top navigation',
          'Enable browser notifications when prompted',
          'Receive alerts for classroom invites, test assignments, results',
          'Click notifications to navigate directly',
          'Mark as read or clear all'
        ]
      },
      {
        subtitle: 'Leaderboards',
        description: 'Compete with classmates in a healthy way.',
        steps: [
          'View classroom leaderboards on dashboard',
          'See rankings based on test scores',
          'Track position changes with indicators',
          'Celebrate top performers with podium animations'
        ]
      },
      {
        subtitle: 'Question Bank',
        description: 'Access a library of questions across subjects.',
        steps: [
          'Navigate to "Question Bank"',
          'Filter by subject, difficulty, or topic',
          'Preview questions before adding to tests',
          'Import/export questions as CSV',
          'Reuse questions across multiple tests'
        ]
      },
      {
        subtitle: 'Email Notifications',
        description: 'Receive important updates via email.',
        steps: [
          'Welcome email upon signup',
          'Classroom invitation emails',
          'Test assignment notifications',
          'Result availability alerts',
          'Password reset emails'
        ]
      }
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    icon: FileText,
    content: [
      {
        subtitle: 'Login Issues',
        description: 'Cannot access your account?',
        steps: [
          'Double-check your email and password',
          'Use "Forgot Password" to reset if needed',
          'Clear browser cache and cookies',
          'Try a different browser',
          'Contact support if issue persists'
        ]
      },
      {
        subtitle: 'Not Receiving Emails',
        description: 'Missing invitations or notifications?',
        steps: [
          'Check your spam/junk folder',
          'Verify email address in your profile',
          'Add noreply@quested.com to contacts',
          'Wait a few minutes for delivery',
          'Ask teacher to resend invitation'
        ]
      },
      {
        subtitle: 'Quick Quiz Issues',
        description: 'Problems joining or taking live quizzes?',
        steps: [
          'Verify the join code is correct (6 digits)',
          'Ensure quiz is still active (not expired)',
          'Check internet connection',
          'Refresh the page and try again',
          'Try a different device if problems persist'
        ]
      },
      {
        subtitle: 'Test Submission Errors',
        description: 'Cannot submit your test?',
        steps: [
          'Check if time limit has expired',
          'Ensure all required questions are answered',
          'Verify internet connection is stable',
          'Take a screenshot of your answers as backup',
          'Contact your teacher immediately'
        ]
      }
    ]
  },
  {
    id: 'best-practices',
    title: 'Best Practices',
    icon: Award,
    content: [
      {
        subtitle: 'For Teachers',
        description: 'Maximize teaching effectiveness.',
        tips: [
          'Organize classrooms by subject and grade level',
          'Use descriptive test titles (e.g., "Chapter 5 Quiz - Algebra")',
          'Set realistic time limits for tests',
          'Provide feedback on test results',
          'Use Quick Quizzes for engagement and review',
          'Monitor student progress regularly',
          'Respond to student queries promptly'
        ]
      },
      {
        subtitle: 'For Students',
        description: 'Get the most out of the platform.',
        tips: [
          'Check dashboard daily for new assignments',
          'Enable notifications to never miss deadlines',
          'Read instructions carefully before starting tests',
          'Practice with Question of the Day',
          'Review incorrect answers to learn',
          'Participate actively in Quick Quizzes',
          'Ask teachers for help when needed'
        ]
      },
      {
        subtitle: 'General Tips',
        description: 'For all users.',
        tips: [
          'Use a stable internet connection',
          'Keep your profile information updated',
          'Use strong, unique passwords',
          'Log out from shared devices',
          'Report bugs or issues to support',
          'Explore all features to discover what works best'
        ]
      }
    ]
  }
];

export default function HowToUsePage() {
  const [expandedSection, setExpandedSection] = useState<string>('getting-started');
  const [expandedContent, setExpandedContent] = useState<number>(0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center pt-6 pb-4 px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="text-[#F5F5F5] hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </nav>

      {/* Header */}
      <div className="border-b border-[#FF991C]/20 bg-black backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            📚 How to Use QuestEd
          </h1>
          <p className="mt-2 text-gray-400">
            Your complete guide to mastering the platform
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:col-span-1 space-y-2">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Contents
            </h2>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setExpandedSection(section.id);
                    setExpandedContent(0);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    expandedSection === section.id
                      ? 'bg-[#FF991C]/10 text-[#FF991C] border border-[#FF991C]/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{section.title}</span>
                </button>
              );
            })}
          </nav>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <AnimatePresence key={section.id}>
                  {expandedSection === section.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Section Header */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-full bg-[#FF991C] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-black" />
                        </div>
                        <h2 className="text-3xl font-bold">{section.title}</h2>
                      </div>

                      {/* Content Items */}
                      <div className="space-y-4">
                        {section.content.map((item, index) => (
                          <div
                            key={index}
                            className="border border-[#FF991C]/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm"
                          >
                            <button
                              onClick={() => setExpandedContent(index)}
                              className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
                            >
                              <h3 className="text-xl font-semibold text-[#FF991C]">
                                {item.subtitle}
                              </h3>
                              {expandedContent === index ? (
                                <ChevronDown className="w-5 h-5 text-[#FF991C]" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              )}
                            </button>

                            <AnimatePresence>
                              {expandedContent === index && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="px-6 pb-6"
                                >
                                  <p className="text-gray-300 mb-4">
                                    {item.description}
                                  </p>

                                  {item.steps && (
                                    <div className="mb-4">
                                      <h4 className="text-sm font-semibold text-[#FF991C] mb-3 uppercase tracking-wide">
                                        📝 Steps
                                      </h4>
                                      <ol className="space-y-2">
                                        {item.steps.map((step, stepIndex) => (
                                          <li
                                            key={stepIndex}
                                            className="flex items-start gap-3 text-gray-300"
                                          >
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FF991C] flex items-center justify-center text-xs font-bold text-black">
                                              {stepIndex + 1}
                                            </span>
                                            <span className="pt-0.5">{step}</span>
                                          </li>
                                        ))}
                                      </ol>
                                    </div>
                                  )}

                                  {item.tips && (
                                    <div className="bg-white/5 border border-[#FF991C]/20 rounded-lg p-4">
                                      <h4 className="text-sm font-semibold text-[#FF991C] mb-3 uppercase tracking-wide">
                                        💡 Tips
                                      </h4>
                                      <ul className="space-y-2">
                                        {item.tips.map((tip, tipIndex) => (
                                          <li
                                            key={tipIndex}
                                            className="flex items-start gap-2 text-gray-300"
                                          >
                                            <span className="text-[#FF991C] mt-1">•</span>
                                            <span>{tip}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 bg-[#FF991C]/10 border border-[#FF991C]/30 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-gray-400 mb-6">
            Can't find what you're looking for? Reach out to our support team.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:support@quested.com"
              className="px-6 py-3 bg-[#FF991C] rounded-lg font-semibold hover:shadow-lg hover:shadow-[#FF991C]/50 transition-all text-black"
            >
              📧 Contact Support
            </a>
            <a
              href="/dashboard"
              className="px-6 py-3 border border-[#FF991C] text-[#FF991C] rounded-lg font-semibold hover:bg-[#FF991C]/10 transition-all"
            >
              🏠 Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
