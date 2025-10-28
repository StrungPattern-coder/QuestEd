"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/lib/store";
import { Brain, Trophy, Target, TrendingUp, LogOut, Play, CheckCircle, Clock, BookOpen, AlertCircle } from "lucide-react";

export default function StudentDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({
    testsCompleted: 28,
    averageScore: 82,
    rank: 15,
    totalPoints: 2450,
  });

  useEffect(() => {
    if (!user || user.role !== "student") {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const availableTests = [
    { id: 1, title: "Binary Trees Advanced", classroom: "Data Structures", questions: 15, duration: 30, priority: "high" },
    { id: 2, title: "SQL Joins & Subqueries", classroom: "Database Management", questions: 20, duration: 45, priority: "medium" },
    { id: 3, title: "Graph Traversal Algorithms", classroom: "Algorithms", questions: 12, duration: 25, priority: "high" },
    { id: 4, title: "Hash Tables & Collision", classroom: "Data Structures", questions: 18, duration: 35, priority: "low" },
  ];

  const completedTests = [
    { id: 1, title: "Arrays & Linked Lists", score: 85, maxScore: 100, date: "2 days ago", classroom: "Data Structures" },
    { id: 2, title: "Sorting Algorithms", score: 92, maxScore: 100, date: "5 days ago", classroom: "Algorithms" },
    { id: 3, title: "Database Normalization", score: 78, maxScore: 100, date: "1 week ago", classroom: "Database Management" },
  ];

  const myClassrooms = [
    { id: 1, name: "Data Structures - Div A", teacher: "Prof. Smith", tests: 8, completed: 5 },
    { id: 2, name: "Algorithms - Div B", teacher: "Prof. Johnson", tests: 6, completed: 4 },
    { id: 3, name: "Database Management", teacher: "Prof. Williams", tests: 5, completed: 3 },
  ];

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
                <h1 className="text-xl font-bold text-[#F5F5F5]">QuestEd</h1>
                <p className="text-xs text-[#F5F5F5]/60">Student Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
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
                Logout
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
            <h2 className="text-3xl font-bold text-[#F5F5F5] mb-2">Welcome back, {user?.name?.split(" ")[0]}! 🚀</h2>
            <p className="text-[#F5F5F5]/70">Ready to take on some challenges today?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Tests Completed", value: stats.testsCompleted, icon: CheckCircle, color: "#FFA266" },
              { label: "Average Score", value: `${stats.averageScore}%`, icon: Target, color: "#FFA266" },
              { label: "Class Rank", value: `#${stats.rank}`, icon: Trophy, color: "#FFA266" },
              { label: "Total Points", value: stats.totalPoints, icon: TrendingUp, color: "#FFA266" },
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FFA266]/20">
                <CardHeader>
                  <CardTitle className="text-2xl text-black">Available Tests</CardTitle>
                  <CardDescription className="text-black/60">Ready to boost your knowledge?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableTests.map((test, index) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="p-4 rounded-xl bg-white/50 border border-[#FFA266]/10 hover:border-[#FFA266]/30 transition-all duration-200 hover:shadow-md group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-black group-hover:text-[#FFA266] transition-colors">{test.title}</h4>
                            {test.priority === "high" && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Priority
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-black/60 mb-2">{test.classroom}</p>
                          <div className="flex items-center gap-4 text-xs text-black/70">
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {test.questions} questions
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {test.duration} min
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-[#FFA266] hover:bg-[#FF8F4D] text-black shadow-lg shadow-[#FFA266]/30"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      </div>
                    </motion.div>
                  ))}
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
                  <CardTitle className="text-2xl text-black">My Classrooms</CardTitle>
                  <CardDescription className="text-black/60">Your enrolled classes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myClassrooms.map((classroom, index) => (
                    <motion.div
                      key={classroom.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="p-4 rounded-xl bg-white/50 border border-[#FFA266]/10 hover:border-[#FFA266]/30 transition-all duration-200 hover:shadow-md cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-[#FFA266]/20 p-2 rounded-lg group-hover:bg-[#FFA266]/30 transition-colors">
                          <BookOpen className="h-5 w-5 text-[#FFA266]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-black text-sm group-hover:text-[#FFA266] transition-colors">{classroom.name}</h4>
                          <p className="text-xs text-black/60">{classroom.teacher}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-black/70">
                          <span>{classroom.completed} / {classroom.tests} tests completed</span>
                          <span className="font-semibold">{Math.round((classroom.completed / classroom.tests) * 100)}%</span>
                        </div>
                        <Progress 
                          value={(classroom.completed / classroom.tests) * 100} 
                          className="h-2 bg-black/10"
                        />
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FFA266]/20">
              <CardHeader>
                <CardTitle className="text-2xl text-black">Recent Submissions</CardTitle>
                <CardDescription className="text-black/60">Your test performance history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedTests.map((test, index) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                      className="p-4 rounded-xl bg-white/50 border border-[#FFA266]/10 hover:border-[#FFA266]/30 transition-all duration-200 hover:shadow-md cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-black group-hover:text-[#FFA266] transition-colors mb-1">{test.title}</h4>
                          <p className="text-xs text-black/60">{test.classroom} • {test.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#FFA266]">{test.score}</div>
                          <div className="text-xs text-black/60">/ {test.maxScore}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Progress 
                          value={(test.score / test.maxScore) * 100} 
                          className="h-2 bg-black/10"
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-black/60">Score percentage</span>
                          <span className={`font-semibold ${
                            (test.score / test.maxScore) * 100 >= 80 ? "text-[#FFA266]" : 
                            (test.score / test.maxScore) * 100 >= 60 ? "text-yellow-600" : "text-red-600"
                          }`}>
                            {Math.round((test.score / test.maxScore) * 100)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
