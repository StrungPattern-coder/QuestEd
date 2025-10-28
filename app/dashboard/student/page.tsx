"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/lib/store";
import { Brain, Trophy, Target, TrendingUp, LogOut, Play, CheckCircle, Clock, BookOpen, AlertCircle, Loader2, Calendar, Zap } from "lucide-react";
import { studentApi } from "@/lib/api";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface Test {
  _id: string;
  title: string;
  description: string;
  classroom: {
    _id: string;
    name: string;
  };
  mode: "live" | "deadline";
  startTime?: string;
  endTime?: string;
  questions: any[];
  timeLimitPerQuestion: number;
}

interface Submission {
  _id: string;
  test: {
    _id: string;
    title: string;
    classroom: {
      name: string;
    };
  };
  score: number;
  maxScore: number;
  submittedAt: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [availableTests, setAvailableTests] = useState<Test[]>([]);
  const [completedSubmissions, setCompletedSubmissions] = useState<Submission[]>([]);
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
        setAvailableTests((testsResponse.data as any).tests || []);
      }

      // Note: We'll need to add a getSubmissions endpoint to the API
      // For now, we'll use test results to determine completed tests
      // Calculate stats based on available data
      setStats({
        testsCompleted: 0,
        averageScore: 0,
        totalPoints: 0,
      });
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
          <Loader2 className="h-12 w-12 text-[#FFA266] animate-spin mx-auto mb-4" />
          <p className="text-[#F5F5F5]">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FFA266]/20 rounded-full blur-3xl animate-pulse-color"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-[#FFA266]/20 rounded-full blur-3xl animate-pulse-color" style={{ animationDelay: "2s" }}></div>
      </div>

      <nav className="relative z-10 border-b border-white/10 backdrop-blur-xl bg-black/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFA266] p-2 rounded-xl">
                <Brain className="h-6 w-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#F5F5F5]">{t.brandName}</h1>
                <p className="text-xs text-[#F5F5F5]/60">{t.student.portal}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button 
                onClick={() => router.push("/dashboard/student/live")}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                <Zap className="h-4 w-4 mr-2" />
                {t.student.joinLive}
              </Button>
              <div className="text-right">
                <p className="text-sm font-medium text-[#F5F5F5]">{user?.name}</p>
                <p className="text-xs text-[#F5F5F5]/60">{user?.email}</p>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-[#FFA266]/30 hover:border-[#FFA266] hover:bg-[#FFA266]/10 text-[#F5F5F5]"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#F5F5F5] mb-2">{t.student.welcome}, {user?.name?.split(" ")[0]}! 🚀</h2>
            <p className="text-[#F5F5F5]/70">{t.student.welcomeMessage}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              { label: t.student.stats.testsCompleted, value: stats.testsCompleted, icon: CheckCircle, color: "#FFA266" },
              { label: t.student.stats.avgScore, value: `${stats.averageScore}%`, icon: Target, color: "#FFA266" },
              { label: t.student.stats.streak, value: stats.totalPoints, icon: TrendingUp, color: "#FFA266" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FFA266]/20 hover:border-[#FFA266]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#FFA266]/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-black/70 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-black">{stat.value}</p>
                      </div>
                      <div className="bg-[#FFA266]/20 p-3 rounded-xl">
                        <stat.icon className="h-6 w-6 text-[#FFA266]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FFA266]/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-black">{t.student.availableTests}</CardTitle>
                  <CardDescription className="text-black/60">{t.student.welcomeMessage}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableTests.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-black/20 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-black mb-2">No Tests Available</h3>
                      <p className="text-sm text-black/60">
                        Your teachers haven't assigned any tests yet. Check back later!
                      </p>
                    </div>
                  ) : (
                    availableTests.map((test, index) => (
                      <motion.div
                        key={test._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="p-4 rounded-xl bg-white/50 border border-[#FFA266]/10 hover:border-[#FFA266]/30 transition-all duration-200 hover:shadow-md group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-black group-hover:text-[#FFA266] transition-colors">{test.title}</h4>
                              {test.mode === "live" && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                                  <AlertCircle className="h-3 w-3" />
                                  Live
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-black/60 mb-2">{test.classroom.name}</p>
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
                                <div className="flex items-center gap-1 text-red-600">
                                  <Calendar className="h-3 w-3" />
                                  {getTimeRemaining(test.endTime)}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleStartTest(test._id)}
                            className="bg-[#FFA266] hover:bg-[#FF8F4D] text-black shadow-lg shadow-[#FFA266]/30"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FFA266]/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-black">Recent Submissions</CardTitle>
                  <CardDescription className="text-black/60">Your test performance history</CardDescription>
                </CardHeader>
                <CardContent>
                  {completedSubmissions.length === 0 ? (
                    <div className="text-center py-12">
                      <Trophy className="h-16 w-16 text-black/20 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-black mb-2">No Submissions Yet</h3>
                      <p className="text-sm text-black/60">
                        Complete your first test to see your results here!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {completedSubmissions.slice(0, 5).map((submission, index) => {
                        const percentage = Math.round((submission.score / submission.maxScore) * 100);
                        return (
                          <motion.div
                            key={submission._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                            className="p-4 rounded-xl bg-white/50 border border-[#FFA266]/10 hover:border-[#FFA266]/30 transition-all duration-200 hover:shadow-md cursor-pointer group"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-black group-hover:text-[#FFA266] transition-colors mb-1">{submission.test.title}</h4>
                                <p className="text-xs text-black/60">
                                  {submission.test.classroom.name} • {new Date(submission.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-[#FFA266]">{submission.score}</div>
                                <div className="text-xs text-black/60">/ {submission.maxScore}</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Progress 
                                value={percentage} 
                                className="h-2 bg-black/10"
                              />
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-black/60">Score percentage</span>
                                <span className={`font-semibold ${
                                  percentage >= 80 ? "text-[#FFA266]" : 
                                  percentage >= 60 ? "text-yellow-600" : "text-red-600"
                                }`}>
                                  {percentage}%
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
