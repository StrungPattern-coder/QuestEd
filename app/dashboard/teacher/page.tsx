"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { teacherApi } from "@/lib/api";
import { Brain, Users, FileText, TrendingUp, Plus, LogOut, BookOpen, CheckCircle, Clock, Loader2 } from "lucide-react";

interface Classroom {
  _id: string;
  name: string;
  description?: string;
  students: any[];
  createdAt: string;
}

interface Test {
  _id: string;
  title: string;
  mode: 'live' | 'deadline';
  classroomId: { name: string };
  questions: any[];
  isActive?: boolean;
  startTime?: string;
  endTime?: string;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [stats, setStats] = useState({
    totalClassrooms: 0,
    totalTests: 0,
    activeStudents: 0,
    averageScore: 0,
  });

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.push("/login");
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch classrooms
      const classroomsRes = await teacherApi.getClassrooms();
      if (classroomsRes.data) {
        const classroomsData = (classroomsRes.data as any).classrooms || [];
        setClassrooms(classroomsData);
        
        // Calculate stats
        const totalStudents = classroomsData.reduce((acc: number, c: Classroom) => 
          acc + (c.students?.length || 0), 0
        );
        
        setStats(prev => ({
          ...prev,
          totalClassrooms: classroomsData.length,
          activeStudents: totalStudents,
        }));
      }

      // Fetch tests
      const testsRes = await teacherApi.getTests();
      if (testsRes.data) {
        const testsData = (testsRes.data as any).tests || [];
        setTests(testsData);
        setStats(prev => ({
          ...prev,
          totalTests: testsData.length,
        }));
      }
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleCreateClassroom = () => {
    router.push("/dashboard/teacher/classrooms/create");
  };

  const handleCreateTest = () => {
    router.push("/dashboard/teacher/tests/create");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#FFA266] animate-spin" />
      </div>
    );
  }

  // Empty state for new teachers
  if (classrooms.length === 0 && tests.length === 0) {
    return (
      <div className="min-h-screen bg-black">
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
                <Button onClick={handleLogout} variant="outline" className="border-[#FFA266]/30 hover:border-[#FFA266] hover:bg-[#FFA266]/10 text-[#F5F5F5]">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-[#FFA266]/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-[#FFA266]" />
            </div>
            <h2 className="text-4xl font-bold text-[#F5F5F5] mb-4">Welcome to QuestEd! 👋</h2>
            <p className="text-xl text-[#F5F5F5]/70 mb-8">
              Let's get started by creating your first classroom or test
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <Card className="bg-[#F5F5F5]/95 border-[#FFA266]/20 hover:border-[#FFA266]/50 transition-all cursor-pointer" onClick={handleCreateClassroom}>
                <CardHeader>
                  <div className="bg-[#FFA266]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-[#FFA266]" />
                  </div>
                  <CardTitle className="text-2xl text-black">Create Classroom</CardTitle>
                  <CardDescription className="text-black/60">
                    Set up a new class and invite students
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-[#F5F5F5]/95 border-[#FFA266]/20 hover:border-[#FFA266]/50 transition-all cursor-pointer" onClick={handleCreateTest}>
                <CardHeader>
                  <div className="bg-[#FFA266]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-[#FFA266]" />
                  </div>
                  <CardTitle className="text-2xl text-black">Create Test</CardTitle>
                  <CardDescription className="text-black/60">
                    Design a new German language quiz
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </motion.div>
        </main>
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
                <h1 className="text-xl font-bold text-[#F5F5F5]">QuestEd</h1>
                <p className="text-xs text-[#F5F5F5]/60">Teacher Portal</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-[#F5F5F5]">{user?.name}</p>
                <p className="text-xs text-[#F5F5F5]/60">{user?.email}</p>
              </div>
              <Button onClick={handleLogout} variant="outline" className="border-[#FFA266]/30 hover:border-[#FFA266] hover:bg-[#FFA266]/10 text-[#F5F5F5]">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 container mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#F5F5F5] mb-2">Welcome back, {user?.name?.split(" ")[0]}! 👋</h2>
            <p className="text-[#F5F5F5]/70">Here's what's happening with your classes today</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Classrooms", value: stats.totalClassrooms, icon: Users },
              { label: "Total Tests", value: stats.totalTests, icon: FileText },
              { label: "Active Students", value: stats.activeStudents, icon: TrendingUp },
              { label: "Avg Score", value: stats.averageScore > 0 ? `${stats.averageScore}%` : "N/A", icon: CheckCircle },
            ].map((stat, index) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
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
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FFA266]/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-black">My Classrooms</CardTitle>
                      <CardDescription className="text-black/60">Manage your active classes</CardDescription>
                    </div>
                    <Button onClick={handleCreateClassroom} className="bg-[#FFA266] hover:bg-[#FF8F4D] text-black shadow-lg shadow-[#FFA266]/30">
                      <Plus className="h-4 w-4 mr-2" />
                      New Class
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {classrooms.length === 0 ? (
                    <div className="text-center py-8 text-black/60">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-[#FFA266]/50" />
                      <p>No classrooms yet. Create your first one!</p>
                    </div>
                  ) : (
                    classrooms.slice(0, 3).map((classroom, index) => (
                      <motion.div
                        key={classroom._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="p-4 rounded-xl bg-white/50 border border-[#FFA266]/10 hover:border-[#FFA266]/30 transition-all duration-200 hover:shadow-md cursor-pointer group"
                        onClick={() => router.push(`/dashboard/teacher/classrooms/${classroom._id}`)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-[#FFA266]/20 p-2 rounded-lg group-hover:bg-[#FFA266]/30 transition-colors">
                              <BookOpen className="h-5 w-5 text-[#FFA266]" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-black group-hover:text-[#FFA266] transition-colors">{classroom.name}</h4>
                              <p className="text-xs text-black/60">{classroom.students?.length || 0} students enrolled</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FFA266]/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl text-black">Recent Tests</CardTitle>
                      <CardDescription className="text-black/60">Track student submissions</CardDescription>
                    </div>
                    <Button onClick={handleCreateTest} className="bg-[#FFA266] hover:bg-[#FF8F4D] text-black shadow-lg shadow-[#FFA266]/30">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Test
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tests.length === 0 ? (
                    <div className="text-center py-8 text-black/60">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-[#FFA266]/50" />
                      <p>No tests yet. Create your first one!</p>
                    </div>
                  ) : (
                    tests.slice(0, 3).map((test, index) => (
                      <motion.div
                        key={test._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="p-4 rounded-xl bg-white/50 border border-[#FFA266]/10 hover:border-[#FFA266]/30 transition-all duration-200 hover:shadow-md group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-black group-hover:text-[#FFA266] transition-colors">{test.title}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${test.mode === 'live' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                {test.mode === 'live' ? 'Live' : 'Deadline'}
                              </span>
                            </div>
                            <p className="text-xs text-black/60">{test.classroomId?.name || 'No classroom'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-xs text-black/70">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {test.questions?.length || 0} questions
                            </div>
                            {test.isActive && (
                              <div className="flex items-center gap-1 text-green-600">
                                <Clock className="h-3 w-3" />
                                Active
                              </div>
                            )}
                          </div>
                          {test.mode === 'live' && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/dashboard/teacher/tests/${test._id}/live`);
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs h-7 px-3"
                            >
                              Go Live
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FFA266]/20">
              <CardHeader>
                <CardTitle className="text-2xl text-black">Quick Actions</CardTitle>
                <CardDescription className="text-black/60">Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Create New Classroom", icon: Users, description: "Set up a new class", onClick: handleCreateClassroom },
                    { label: "Create New Test", icon: FileText, description: "Design a new quiz", onClick: handleCreateTest },
                    { label: "View Analytics", icon: TrendingUp, description: "Check performance", onClick: () => router.push("/dashboard/teacher/analytics") },
                  ].map((action, index) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={action.onClick}
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
