"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { Brain, Users, FileText, TrendingUp, Plus, LogOut, BookOpen, CheckCircle, Clock } from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({
    totalClassrooms: 12,
    totalTests: 45,
    activeStudents: 234,
    averageScore: 78,
  });

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const recentClasses = [
    { id: 1, name: "Data Structures - Div A", students: 45, tests: 8, avgScore: 82 },
    { id: 2, name: "Algorithms - Div B", students: 42, tests: 6, avgScore: 76 },
    { id: 3, name: "Database Management", students: 48, tests: 5, avgScore: 79 },
  ];

  const recentTests = [
    { id: 1, title: "Binary Trees Quiz", classroom: "Data Structures", submissions: 38, pending: 7 },
    { id: 2, title: "SQL Advanced", classroom: "Database Management", submissions: 45, pending: 3 },
    { id: 3, title: "Graph Algorithms", classroom: "Algorithms", submissions: 32, pending: 10 },
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
                <p className="text-xs text-[#F5F5F5]/60">Teacher Portal</p>
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
            <h2 className="text-3xl font-bold text-[#F5F5F5] mb-2">Welcome back, {user?.name?.split(" ")[0]}! 👋</h2>
            <p className="text-[#F5F5F5]/70">Here's what's happening with your classes today</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Classrooms", value: stats.totalClassrooms, icon: Users, color: "#FFA266" },
              { label: "Total Tests", value: stats.totalTests, icon: FileText, color: "#FFA266" },
              { label: "Active Students", value: stats.activeStudents, icon: TrendingUp, color: "#FFA266" },
              { label: "Avg Score", value: `${stats.averageScore}%`, icon: CheckCircle, color: "#FFA266" },
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FFA266]/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-black">My Classrooms</CardTitle>
                      <CardDescription className="text-black/60">Manage your active classes</CardDescription>
                    </div>
                    <Button className="bg-[#FFA266] hover:bg-[#FF8F4D] text-black shadow-lg shadow-[#FFA266]/30">
                      <Plus className="h-4 w-4 mr-2" />
                      New Class
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentClasses.map((classroom, index) => (
                    <motion.div
                      key={classroom.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="p-4 rounded-xl bg-white/50 border border-[#FFA266]/10 hover:border-[#FFA266]/30 transition-all duration-200 hover:shadow-md cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#FFA266]/20 p-2 rounded-lg group-hover:bg-[#FFA266]/30 transition-colors">
                            <BookOpen className="h-5 w-5 text-[#FFA266]" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-black group-hover:text-[#FFA266] transition-colors">{classroom.name}</h4>
                            <p className="text-xs text-black/60">{classroom.students} students enrolled</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-black/70">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {classroom.tests} tests
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {classroom.avgScore}% avg
                        </div>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-black">Recent Tests</CardTitle>
                      <CardDescription className="text-black/60">Track student submissions</CardDescription>
                    </div>
                    <Button className="bg-[#FFA266] hover:bg-[#FF8F4D] text-black shadow-lg shadow-[#FFA266]/30">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Test
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTests.map((test, index) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="p-4 rounded-xl bg-white/50 border border-[#FFA266]/10 hover:border-[#FFA266]/30 transition-all duration-200 hover:shadow-md cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-black group-hover:text-[#FFA266] transition-colors mb-1">{test.title}</h4>
                          <p className="text-xs text-black/60">{test.classroom}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="bg-[#FFA266]/20 px-2 py-1 rounded-md flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-[#FFA266]" />
                            <span className="text-black font-medium">{test.submissions} submitted</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="bg-yellow-100 px-2 py-1 rounded-md flex items-center gap-1">
                            <Clock className="h-3 w-3 text-yellow-600" />
                            <span className="text-yellow-800 font-medium">{test.pending} pending</span>
                          </div>
                        </div>
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
                <CardTitle className="text-2xl text-black">Quick Actions</CardTitle>
                <CardDescription className="text-black/60">Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Create New Classroom", icon: Users, description: "Set up a new class" },
                    { label: "Create New Test", icon: FileText, description: "Design a new quiz" },
                    { label: "View Analytics", icon: TrendingUp, description: "Check performance" },
                  ].map((action, index) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 rounded-xl bg-white/50 border border-[#FFA266]/10 hover:border-[#FFA266]/50 hover:bg-[#FFA266]/10 transition-all duration-200 text-left group"
                    >
                      <div className="bg-[#FFA266]/20 p-3 rounded-lg w-fit mb-3 group-hover:bg-[#FFA266]/40 transition-colors">
                        <action.icon className="h-5 w-5 text-[#FFA266]" />
                      </div>
                      <h4 className="font-semibold text-black mb-1">{action.label}</h4>
                      <p className="text-xs text-black/60">{action.description}</p>
                    </motion.button>
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
