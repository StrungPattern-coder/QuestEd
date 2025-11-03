"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/lib/store";
import { Brain, Trophy, Target, TrendingUp, LogOut, Play, CheckCircle, Clock, BookOpen, AlertCircle, Loader2, Calendar, Zap, XCircle, Award, User, Bell, FolderOpen, Settings } from "lucide-react";
import { studentApi } from "@/lib/api";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import MobileNav from "@/components/MobileNav";
import DashboardWalkthroughWrapper from "@/components/DashboardWalkthroughWrapper";
import NotificationBell from "@/components/NotificationBell";

interface Test {
  _id: string;
  title: string;
  description: string;
  classroomId: {
    _id: string;
    name: string;
  };
  mode: "live" | "deadline";
  startTime?: string;
  endTime?: string;
  questions: any[];
  timeLimitPerQuestion: number;
  status?: 'active' | 'upcoming' | 'missed' | 'submitted' | 'not-started';
  isAvailable?: boolean;
  isExpired?: boolean;
  hasSubmitted?: boolean;
  timeRemaining?: number;
  submission?: {
    _id: string;
    score: number;
    submittedAt: string;
    submittedLate: boolean;
  };
}

interface Submission {
  _id: string;
  test: {
    _id: string;
    title: string;
    classroomId: {
      name: string;
    };
  };
  score: number;
  maxScore: number;
  submittedAt: string;
}

interface Classroom {
  _id: string;
  name: string;
  description?: string;
  teacherId: {
    _id: string;
    name: string;
    email: string;
  };
  students: any[];
  createdAt: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [completedSubmissions, setCompletedSubmissions] = useState<Submission[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [stats, setStats] = useState({
    testsCompleted: 0,
    averageScore: 0,
    totalPoints: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login");
    } else {
      fetchDashboardData();
    }
  }, [user, router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch available tests
      const testsResponse = await studentApi.getTests();
      
      if (testsResponse.data) {
        const tests = (testsResponse.data as any).tests || [];
        setAvailableTests(tests);
        
        // Calculate stats based on test data
        const completedTests = tests.filter((t: Test) => t.hasSubmitted && t.submission);
        
        let totalScore = 0;
        let maxPossibleScore = 0;
        
        completedTests.forEach((t: Test) => {
          const score = t.submission?.score || 0;
          // Get the max score - questions should be an array
          const maxScore = Array.isArray(t.questions) ? t.questions.length : 0;
          
          totalScore += score;
          maxPossibleScore += maxScore;
        });
        
        const avgScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
        
        setStats({
          testsCompleted: completedTests.length,
          averageScore: avgScore,
          totalPoints: totalScore,
        });
      }

      // Fetch classrooms
      const classroomsResponse = await studentApi.getClassrooms();
      if (classroomsResponse.data) {
        setClassrooms((classroomsResponse.data as any).classrooms || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
    setLoading(false);
  };

  const handleStartTest = (testId: string) => {
    router.push(`/dashboard/student/tests/${testId}/take`);
  };

  const getTimeRemaining = (endTime: string) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff < 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return `${Math.floor(diff / (1000 * 60))}m left`;
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#FF991C] animate-spin mx-auto mb-4" />
          <p className="text-[#F5F5F5]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardWalkthroughWrapper>
      <div className="min-h-screen bg-black">
        {/* Mobile Navigation */}
        <MobileNav role="student" userName={user?.name} />
      
      {/* Desktop Navigation */}
      <nav className="hidden lg:block relative z-10 pt-4 pb-4">
        <div className="container mx-auto px-6">
          {/* Top Bar - Brand and Actions */}
          <div className="bg-white/10 backdrop-blur-xl border border-[#FF991C]/30 rounded-2xl px-6 py-3 shadow-2xl mb-3">
            <div className="flex items-center justify-between">
              {/* Left: Brand */}
              <Link href="/dashboard/student">
                <div className="cursor-pointer flex items-center gap-3">
                  <div className="bg-[#FF991C]/20 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-[#FF991C]" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-[#F5F5F5] hover:text-[#FF991C] transition-colors">{t.brandName}</h1>
                    <p className="text-xs text-[#F5F5F5]/60">{t.student.portal}</p>
                  </div>
                </div>
              </Link>

              {/* Center: Quick Actions */}
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => router.push("/dashboard/student/live")}
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-4 h-9"
                >
                  <Zap className="h-4 w-4 mr-1.5" />
                  {t.student.joinLive}
                </Button>
                <Button 
                  onClick={() => router.push("/quick-quiz")}
                  size="sm"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-full px-4 h-9"
                >
                  <Zap className="h-4 w-4 mr-1.5" />
                  Quick Quiz
                </Button>
              </div>

              {/* Right: User Info and Logout */}
              <div className="flex items-center gap-3">
                <NotificationBell userId={user?.id || ''} />
                <LanguageSwitcher />
                <div className="h-8 w-px bg-[#F5F5F5]/20"></div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => router.push("/dashboard/student/profile")}
                    variant="ghost"
                    size="sm"
                    className="bg-[#FF991C]/10 hover:bg-[#FF991C]/20 text-[#F5F5F5] rounded-full px-3 h-9"
                  >
                    <User className="h-4 w-4 mr-1.5" />
                    <span className="max-w-[100px] truncate">{user?.name?.split(" ")[0]}</span>
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="bg-transparent border border-[#FF991C]/30 hover:border-[#FF991C] hover:bg-[#FF991C]/10 text-[#F5F5F5] rounded-full px-3 h-9"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar - Navigation Links */}
          <div className="bg-white/5 backdrop-blur-xl border border-[#FF991C]/20 rounded-2xl px-4 py-2 shadow-xl">
            <div className="flex items-center justify-center gap-1">
              <Button 
                onClick={() => router.push("/dashboard/student/materials")}
                variant="ghost"
                size="sm"
                className="text-[#F5F5F5] hover:bg-[#FF991C]/10 hover:text-[#FF991C] rounded-lg px-3 h-8 transition-all"
              >
                <FolderOpen className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-sm">Materials</span>
              </Button>
              <div className="h-6 w-px bg-[#F5F5F5]/10"></div>
              <Button 
                onClick={() => router.push("/dashboard/student/announcements")}
                variant="ghost"
                size="sm"
                className="text-[#F5F5F5] hover:bg-[#FF991C]/10 hover:text-[#FF991C] rounded-lg px-3 h-8 transition-all"
              >
                <Bell className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-sm">Announcements</span>
              </Button>
              <div className="h-6 w-px bg-[#F5F5F5]/10"></div>
              <Button 
                onClick={() => router.push("/dashboard/student/settings")}
                variant="ghost"
                size="sm"
                className="text-[#F5F5F5] hover:bg-purple-500/10 hover:text-purple-400 rounded-lg px-3 h-8 transition-all"
              >
                <Settings className="h-3.5 w-3.5 mr-1.5" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <div className="lg:hidden px-4 pt-20 pb-4">
        <div className="bg-white/5 backdrop-blur-xl border border-[#FF991C]/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-[#F5F5F5]">{t.brandName}</h1>
              <p className="text-sm text-[#F5F5F5]/70">{t.student.portal}</p>
            </div>
            <Button 
              onClick={() => router.push("/dashboard/student/live")}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full px-4 h-9 text-sm"
            >
              <Zap className="h-4 w-4 mr-1" />
              Live
            </Button>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={() => router.push("/quick-quiz")}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-full h-9 text-sm"
            >
              <Zap className="h-4 w-4 mr-2" />
              Quick Quiz
            </Button>
            <Button 
              onClick={() => router.push("/dashboard/student/settings")}
              variant="outline"
              className="w-full border-purple-500/50 hover:bg-purple-500/10 text-[#F5F5F5] rounded-full h-9 text-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] mb-2">{t.student.welcome}, {user?.name?.split(" ")[0]}! 🚀</h2>
            <p className="text-sm sm:text-base text-[#F5F5F5]/70">{t.student.welcomeMessage}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { label: t.student.stats.testsCompleted, value: stats.testsCompleted, icon: CheckCircle, color: "#FF991C" },
              { label: t.student.stats.avgScore, value: `${stats.averageScore}%`, icon: Target, color: "#FF991C" },
              { label: t.student.stats.streak, value: stats.totalPoints, icon: TrendingUp, color: "#FF991C" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 hover:border-[#FF991C]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#FF991C]/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-black/70 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-black">{stat.value}</p>
                      </div>
                      <div className="bg-[#FF991C]/20 p-3 rounded-xl">
                        <stat.icon className="h-6 w-6 text-[#FF991C]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Classrooms Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
              <CardHeader>
                <CardTitle className="text-2xl text-black flex items-center gap-2">
                  <FolderOpen className="h-6 w-6 text-[#FF991C]" />
                  My Classrooms
                </CardTitle>
                <CardDescription className="text-black/60">
                  All the classrooms you're enrolled in
                </CardDescription>
              </CardHeader>
              <CardContent>
                {classrooms.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="h-16 w-16 text-black/20 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-black mb-2">No Classrooms Yet</h3>
                    <p className="text-sm text-black/60 mb-4">
                      You're not enrolled in any classrooms yet. Ask your teacher for a classroom code!
                    </p>
                    <Button
                      onClick={() => router.push('/join-classroom')}
                      className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black"
                    >
                      Join Classroom
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classrooms.map((classroom, index) => (
                      <motion.div
                        key={classroom._id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="bg-gradient-to-br from-[#FF991C]/10 to-[#FF8F4D]/10 border-[#FF991C]/30 hover:border-[#FF991C]/50 transition-all duration-300 hover:shadow-lg cursor-pointer group">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="bg-[#FF991C]/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                                <FolderOpen className="h-6 w-6 text-[#FF991C]" />
                              </div>
                              <span className="px-2 py-1 bg-[#FF991C]/20 text-[#FF991C] text-xs font-medium rounded-full">
                                {classroom.students.length} students
                              </span>
                            </div>
                            <h3 className="text-lg font-bold text-black mb-2 group-hover:text-[#FF991C] transition-colors">
                              {classroom.name}
                            </h3>
                            {classroom.description && (
                              <p className="text-sm text-black/60 mb-3 line-clamp-2">
                                {classroom.description}
                              </p>
                            )}
                            <div className="pt-3 border-t border-[#FF991C]/20">
                              <div className="flex items-center gap-2 text-xs text-black/70">
                                <User className="h-3 w-3" />
                                <span className="font-medium">{classroom.teacherId.name}</span>
                              </div>
                              <div className="text-xs text-black/50 mt-1">
                                Joined {new Date(classroom.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-black">My Tests</CardTitle>
                  <CardDescription className="text-black/60">View all your tests organized by status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {availableTests.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-black/20 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-black mb-2">No Tests Available</h3>
                      <p className="text-sm text-black/60">
                        Your teachers haven't assigned any tests yet. Check back later!
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Active Tests - Need to Submit */}
                      {availableTests.filter(t => t.status === 'active').length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <h3 className="text-lg font-semibold text-black">Active - Need to Submit</h3>
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                              {availableTests.filter(t => t.status === 'active').length}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {availableTests.filter(t => t.status === 'active').map((test, index) => (
                              <motion.div
                                key={test._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                className="p-4 rounded-xl bg-red-50 border-2 border-red-200 hover:border-red-300 transition-all duration-200 hover:shadow-md group"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="font-semibold text-black group-hover:text-red-600 transition-colors">{test.title}</h4>
                                      {test.mode === "live" && (
                                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center gap-1 animate-pulse">
                                          <AlertCircle className="h-3 w-3" />
                                          LIVE NOW
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-black/60 mb-2">{test.classroomId?.name || 'Unknown Classroom'}</p>
                                    <div className="flex items-center gap-4 text-xs text-black/70">
                                      <div className="flex items-center gap-1">
                                        <Target className="h-3 w-3" />
                                        {test.questions.length} questions
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {test.timeLimitPerQuestion}s per question
                                      </div>
                                      {test.mode === "deadline" && test.endTime && (
                                        <div className="flex items-center gap-1 text-red-600 font-semibold">
                                          <Calendar className="h-3 w-3" />
                                          {getTimeRemaining(test.endTime)}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleStartTest(test._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30"
                                  >
                                    <Play className="h-4 w-4 mr-1" />
                                    Start Now
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upcoming Tests */}
                      {availableTests.filter(t => t.status === 'upcoming').length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-black">Upcoming Tests</h3>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              {availableTests.filter(t => t.status === 'upcoming').length}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {availableTests.filter(t => t.status === 'upcoming').map((test, index) => (
                              <motion.div
                                key={test._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                className="p-4 rounded-xl bg-blue-50 border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md group"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-black mb-2">{test.title}</h4>
                                    <p className="text-xs text-black/60 mb-2">{test.classroomId?.name || 'Unknown Classroom'}</p>
                                    <div className="flex items-center gap-4 text-xs text-black/70">
                                      <div className="flex items-center gap-1">
                                        <Target className="h-3 w-3" />
                                        {test.questions.length} questions
                                      </div>
                                      {test.startTime && (
                                        <div className="flex items-center gap-1 text-blue-600 font-semibold">
                                          <Calendar className="h-3 w-3" />
                                          Starts: {new Date(test.startTime).toLocaleString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    Coming Soon
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Submitted Tests */}
                      {availableTests.filter(t => t.status === 'submitted').length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-black">Submitted</h3>
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              {availableTests.filter(t => t.status === 'submitted').length}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {availableTests.filter(t => t.status === 'submitted').map((test, index) => (
                              <motion.div
                                key={test._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                className="p-4 rounded-xl bg-green-50 border border-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-md group cursor-pointer"
                                onClick={() => router.push(`/dashboard/student/tests/${test._id}/result`)}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-black mb-2">{test.title}</h4>
                                    <p className="text-xs text-black/60 mb-2">{test.classroomId?.name || 'Unknown Classroom'}</p>
                                    <div className="flex items-center gap-4 text-xs text-black/70">
                                      {test.submission && (
                                        <>
                                          <div className="flex items-center gap-1 text-green-600 font-semibold">
                                            <Award className="h-3 w-3" />
                                            Score: {test.submission.score}/{test.questions.length}
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(test.submission.submittedAt).toLocaleDateString()}
                                          </div>
                                          {test.submission.submittedLate && (
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                                              Late
                                            </span>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="border-green-600 text-green-600 hover:bg-green-50"
                                  >
                                    View Result
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Missed Tests */}
                      {availableTests.filter(t => t.status === 'missed').length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <XCircle className="h-5 w-5 text-gray-600" />
                            <h3 className="text-lg font-semibold text-black">Missed</h3>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                              {availableTests.filter(t => t.status === 'missed').length}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {availableTests.filter(t => t.status === 'missed').map((test, index) => (
                              <motion.div
                                key={test._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                className="p-4 rounded-xl bg-gray-50 border border-gray-200 transition-all duration-200"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-600 mb-2">{test.title}</h4>
                                    <p className="text-xs text-black/60 mb-2">{test.classroomId?.name || 'Unknown Classroom'}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-600">
                                      <div className="flex items-center gap-1">
                                        <Target className="h-3 w-3" />
                                        {test.questions.length} questions
                                      </div>
                                      {test.endTime && (
                                        <div className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          Ended: {new Date(test.endTime).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">
                                    Expired
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
    </DashboardWalkthroughWrapper>
  );
}
