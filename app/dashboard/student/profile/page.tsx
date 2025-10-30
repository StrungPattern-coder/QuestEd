"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/lib/store";
import { 
  User, Mail, Hash, Award, TrendingUp, Target, Clock, 
  CheckCircle, Trophy, ArrowLeft, Calendar, BookOpen,
  BarChart3, Activity
} from "lucide-react";
import Link from "next/link";

interface Submission {
  _id: string;
  testId: {
    _id: string;
    title: string;
    questions: any[];
    classroomId: {
      name: string;
    };
  };
  score: number;
  submittedAt: string;
  answers: any[];
}

interface ProfileStats {
  testsCompleted: number;
  averageScore: number;
  totalPoints: number;
  highestScore: number;
  lowestScore: number;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

export default function StudentProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<ProfileStats>({
    testsCompleted: 0,
    averageScore: 0,
    totalPoints: 0,
    highestScore: 0,
    lowestScore: 100,
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
  });

  useEffect(() => {
    if (!user || user.role !== 'student') {
      router.push('/login');
      return;
    }
    fetchProfileData();
  }, [user, router]);

  const fetchProfileData = async () => {
    try {
      // Fetch all student tests to get submissions
      const response = await fetch('/api/student/tests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        console.error('API Error:', data.error);
        return;
      }
      
      if (data.tests) {
        // Filter tests that have been completed and have submission data
        const completedTests = data.tests.filter((test: any) => test.hasSubmitted && test.submission);
        
        // Calculate statistics
        let totalScore = 0;
        let totalPossible = 0;
        let highest = 0;
        let lowest = 100;
        let totalQuestions = 0;
        let correctAnswers = 0;

        const submissionsData: Submission[] = [];

        completedTests.forEach((test: any) => {
          // Get score from submission object
          const score = test.submission?.score || 0;
          const questionCount = test.questions?.length || 0;
          
          if (questionCount > 0) {
            const percentage = (score / questionCount) * 100;
            totalScore += percentage;
            totalPossible += questionCount;
            totalQuestions += questionCount;
            correctAnswers += score;

            if (percentage > highest) highest = percentage;
            if (percentage < lowest) lowest = percentage;

            submissionsData.push({
              _id: test._id,
              testId: test,
              score: score,
              submittedAt: test.submission?.submittedAt || new Date().toISOString(),
              answers: [],
            });
          }
        });

        const averageScore = completedTests.length > 0 ? totalScore / completedTests.length : 0;
        const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        setSubmissions(submissionsData);
        setStats({
          testsCompleted: completedTests.length,
          averageScore,
          totalPoints: correctAnswers,
          highestScore: highest,
          lowestScore: completedTests.length > 0 ? lowest : 0,
          totalQuestions,
          correctAnswers,
          accuracy,
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-[#FF991C]/30 border-t-[#FF991C] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#F5F5F5]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Outstanding', color: 'text-yellow-500', emoji: '🌟' };
    if (score >= 80) return { level: 'Excellent', color: 'text-green-500', emoji: '🎯' };
    if (score >= 70) return { level: 'Good', color: 'text-blue-500', emoji: '👍' };
    if (score >= 60) return { level: 'Fair', color: 'text-purple-500', emoji: '📚' };
    return { level: 'Needs Improvement', color: 'text-red-500', emoji: '💪' };
  };

  const performance = getPerformanceLevel(stats.averageScore);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <nav className="border-b border-[#FF991C]/20 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/student">
              <Button variant="ghost" className="text-[#F5F5F5] hover:bg-[#FF991C]/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-[#F5F5F5]">My Profile</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header Card - Redesigned with holographic effects */}
          <div className="relative mb-8">
            {/* Glowing background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-3xl"></div>
            
            <Card className="relative backdrop-blur-xl bg-gradient-to-br from-[#1a1a2e]/95 via-[#16213e]/95 to-[#0f3460]/95 border border-cyan-500/30 overflow-hidden">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 animate-pulse"></div>
              
              {/* Holographic shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none"></div>
              
              <CardContent className="relative pt-8 pb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Avatar with holographic effect */}
                  <div className="relative group">
                    {/* Glowing ring animation */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 animate-pulse"></div>
                    
                    {/* Avatar container */}
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-500/30 p-1">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] flex items-center justify-center border-2 border-cyan-500/50">
                        <User className="h-16 w-16 text-cyan-400" />
                      </div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-[#1a1a2e] shadow-lg shadow-green-500/50"></div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left">
                    {/* Name with gradient */}
                    <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {user.name}
                    </h2>
                    
                    {/* Info badges */}
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-cyan-500/30">
                        <Mail className="h-4 w-4 text-cyan-400" />
                        <span className="text-[#F5F5F5] text-sm">{user.email}</span>
                      </div>
                      
                      {user.enrollmentNumber && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-blue-500/30">
                          <Hash className="h-4 w-4 text-blue-400" />
                          <span className="text-[#F5F5F5] text-sm">{user.enrollmentNumber}</span>
                        </div>
                      )}
                      
                      {user.rollNumber && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-purple-500/30">
                          <Hash className="h-4 w-4 text-purple-400" />
                          <span className="text-[#F5F5F5] text-sm">Roll: {user.rollNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Performance badge with glow */}
                    <div className="relative inline-block">
                      {/* Glow effect */}
                      <div className={`absolute -inset-2 rounded-full blur-lg opacity-75 ${
                        stats.averageScore >= 80 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : stats.averageScore >= 60 
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}></div>
                      
                      <span className={`relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-bold backdrop-blur-sm border-2 ${
                        stats.averageScore >= 80 
                          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/50' 
                          : stats.averageScore >= 60 
                          ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-400/50' 
                          : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-400/50'
                      }`}>
                        <span className="text-2xl">{performance.emoji}</span>
                        <span>{performance.level} Performer</span>
                      </span>
                    </div>

                    {/* Quick stats bar */}
                    <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-cyan-400">{stats.testsCompleted}</p>
                        <p className="text-xs text-[#F5F5F5]/60 uppercase tracking-wider">Tests</p>
                      </div>
                      <div className="h-12 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-purple-400">{stats.totalPoints}</p>
                        <p className="text-xs text-[#F5F5F5]/60 uppercase tracking-wider">Points</p>
                      </div>
                      <div className="h-12 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"></div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-blue-400">{stats.accuracy.toFixed(0)}%</p>
                        <p className="text-xs text-[#F5F5F5]/60 uppercase tracking-wider">Accuracy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/90 to-blue-600/90 border-blue-400/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <CheckCircle className="h-10 w-10 text-white/50" />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{stats.testsCompleted}</p>
                    <p className="text-sm text-white/70">Tests Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/90 to-green-600/90 border-green-400/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="h-10 w-10 text-white/50" />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{stats.averageScore.toFixed(1)}%</p>
                    <p className="text-sm text-white/70">Average Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/90 to-purple-600/90 border-purple-400/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <Target className="h-10 w-10 text-white/50" />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{stats.accuracy.toFixed(1)}%</p>
                    <p className="text-sm text-white/70">Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-gradient-to-br from-amber-500/90 to-amber-600/90 border-amber-400/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <Trophy className="h-10 w-10 text-white/50" />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">{stats.totalPoints}</p>
                    <p className="text-sm text-white/70">Total Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
              <CardHeader>
                <CardTitle className="text-xl text-black flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#FF991C]" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-black/70">Highest Score</span>
                    <span className="text-lg font-bold text-green-600">{stats.highestScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={stats.highestScore} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-black/70">Average Score</span>
                    <span className="text-lg font-bold text-blue-600">{stats.averageScore.toFixed(1)}%</span>
                  </div>
                  <Progress value={stats.averageScore} className="h-2" />
                </div>

                {stats.lowestScore > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-black/70">Lowest Score</span>
                      <span className="text-lg font-bold text-amber-600">{stats.lowestScore.toFixed(1)}%</span>
                    </div>
                    <Progress value={stats.lowestScore} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
              <CardHeader>
                <CardTitle className="text-xl text-black flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#FF991C]" />
                  Question Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-black/60">Correct Answers</p>
                      <p className="text-2xl font-bold text-black">{stats.correctAnswers}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-black/60">Total Questions</p>
                      <p className="text-2xl font-bold text-black">{stats.totalQuestions}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-black/60">Success Rate</p>
                      <p className="text-2xl font-bold text-black">{stats.accuracy.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tests History */}
          <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
            <CardHeader>
              <CardTitle className="text-2xl text-black flex items-center gap-2">
                <Calendar className="h-6 w-6 text-[#FF991C]" />
                Recent Test History
              </CardTitle>
              <CardDescription className="text-black/70">
                Your performance in recent tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-black/20 mx-auto mb-4" />
                  <p className="text-black/60">No tests completed yet</p>
                  <Link href="/dashboard/student">
                    <Button className="mt-4 bg-[#FF991C] hover:bg-[#FF8F4D] text-black">
                      Take Your First Test
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.slice(0, 10).map((submission) => {
                    // Add null checks for safety
                    const questionCount = submission.testId?.questions?.length || 1;
                    const percentage = (submission.score / questionCount) * 100;
                    const classroomName = submission.testId?.classroomId?.name || 'Unknown Classroom';
                    
                    return (
                      <div
                        key={submission._id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border border-black/10 hover:border-[#FF991C]/30 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-black mb-1">
                            {submission.testId?.title || 'Untitled Test'}
                          </h3>
                          <p className="text-sm text-black/60">
                            {classroomName}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className={`text-2xl font-bold ${
                              percentage >= 80 ? 'text-green-600' : 
                              percentage >= 60 ? 'text-blue-600' : 'text-amber-600'
                            }`}>
                              {percentage.toFixed(0)}%
                            </p>
                            <p className="text-xs text-black/50">
                              {submission.score}/{questionCount}
                            </p>
                          </div>
                          {submission.testId?._id && (
                            <Link href={`/dashboard/student/tests/${submission.testId._id}/result`}>
                              <Button variant="outline" size="sm" className="border-[#FF991C]/30 hover:bg-[#FF991C]/10">
                                View
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Performance Insights */}
          {stats.testsCompleted > 0 && (
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/90 to-indigo-600/90 border-purple-400/30 mt-8">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white">
                <div className="space-y-3">
                  {stats.averageScore >= 80 && (
                    <p className="flex items-start gap-2">
                      <span className="text-2xl">🌟</span>
                      <span>You're performing excellently! Keep up the great work!</span>
                    </p>
                  )}
                  {stats.accuracy >= 80 && (
                    <p className="flex items-start gap-2">
                      <span className="text-2xl">🎯</span>
                      <span>Your accuracy is impressive! You have strong understanding of the concepts.</span>
                    </p>
                  )}
                  {stats.testsCompleted >= 5 && (
                    <p className="flex items-start gap-2">
                      <span className="text-2xl">💪</span>
                      <span>Consistent effort! You've completed {stats.testsCompleted} tests. Stay dedicated!</span>
                    </p>
                  )}
                  {stats.averageScore < 60 && stats.testsCompleted > 0 && (
                    <p className="flex items-start gap-2">
                      <span className="text-2xl">📚</span>
                      <span>Focus on understanding core concepts. Review incorrect answers to improve.</span>
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
