"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { teacherApi } from "@/lib/api";
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Trophy,
  Calendar,
  BookOpen,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch all tests and classrooms
      const [testsResponse, classroomsResponse] = await Promise.all([
        teacherApi.getAllTests(),
        teacherApi.getClassrooms(),
      ]);

      if (testsResponse.data && classroomsResponse.data) {
        const tests = (testsResponse.data as any).tests || [];
        const classrooms = (classroomsResponse.data as any).classrooms || [];

        // Calculate comprehensive analytics
        const totalTests = tests.length;
        const totalClassrooms = classrooms.length;
        const totalStudents = classrooms.reduce(
          (sum: number, c: any) => sum + (c.students?.length || 0),
          0
        );

        // Calculate submission statistics
        const allSubmissions = tests.flatMap((t: any) => t.submissions || []);
        const totalSubmissions = allSubmissions.length;
        const averageScore =
          allSubmissions.length > 0
            ? allSubmissions.reduce((sum: number, s: any) => sum + s.score, 0) /
              allSubmissions.length
            : 0;

        // Test mode breakdown
        const liveTests = tests.filter((t: any) => t.mode === "live").length;
        const deadlineTests = tests.filter((t: any) => t.mode === "deadline").length;

        // Active vs completed tests
        const activeTests = tests.filter((t: any) => t.isActive).length;
        const completedTests = tests.filter((t: any) => t.isCompleted).length;

        // Submission rate
        const expectedSubmissions = tests.reduce(
          (sum: number, t: any) => sum + (t.stats?.totalStudents || 0),
          0
        );
        const submissionRate =
          expectedSubmissions > 0
            ? Math.round((totalSubmissions / expectedSubmissions) * 100)
            : 0;

        // Recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentTests = tests.filter(
          (t: any) => new Date(t.createdAt) > sevenDaysAgo
        ).length;

        // Top performing students
        const studentScores: any = {};
        allSubmissions.forEach((sub: any) => {
          const studentId = sub.student?._id;
          if (studentId) {
            if (!studentScores[studentId]) {
              studentScores[studentId] = {
                student: sub.student,
                scores: [],
              };
            }
            studentScores[studentId].scores.push(sub.score);
          }
        });

        const topStudents = Object.values(studentScores)
          .map((data: any) => ({
            student: data.student,
            avgScore:
              data.scores.reduce((a: number, b: number) => a + b, 0) /
              data.scores.length,
            totalTests: data.scores.length,
          }))
          .sort((a: any, b: any) => b.avgScore - a.avgScore)
          .slice(0, 5);

        setStats({
          totalTests,
          totalClassrooms,
          totalStudents,
          totalSubmissions,
          averageScore: Math.round(averageScore),
          liveTests,
          deadlineTests,
          activeTests,
          completedTests,
          submissionRate,
          recentTests,
          topStudents,
          tests,
        });
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#FFA266] animate-spin mx-auto mb-4" />
          <p className="text-[#F5F5F5]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FFA266]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-[#FFA266]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => router.push("/dashboard/teacher")}
            variant="outline"
            className="border-[#FFA266] text-[#FFA266] hover:bg-[#FFA266] hover:text-black"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-[#FFA266]/20 p-3 rounded-xl">
              <BarChart3 className="h-8 w-8 text-[#FFA266]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#F5F5F5]">Analytics Dashboard</h1>
              <p className="text-[#F5F5F5]/60">Comprehensive insights and statistics</p>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: "Total Tests",
              value: stats?.totalTests || 0,
              icon: BookOpen,
              color: "text-blue-400",
              bgColor: "bg-blue-500/20",
            },
            {
              label: "Total Students",
              value: stats?.totalStudents || 0,
              icon: Users,
              color: "text-green-400",
              bgColor: "bg-green-500/20",
            },
            {
              label: "Submissions",
              value: stats?.totalSubmissions || 0,
              icon: Target,
              color: "text-purple-400",
              bgColor: "bg-purple-500/20",
            },
            {
              label: "Avg Score",
              value: `${stats?.averageScore || 0}%`,
              icon: Trophy,
              color: "text-yellow-400",
              bgColor: "bg-yellow-500/20",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border-[#F5F5F5]/20 hover:border-[#FFA266]/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#F5F5F5]/60 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-[#F5F5F5]">{stat.value}</p>
                    </div>
                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Test Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border-[#F5F5F5]/20">
              <CardHeader>
                <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[#FFA266]" />
                  Test Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg">
                    <span className="text-[#F5F5F5]/80">Live Tests</span>
                    <span className="text-[#F5F5F5] font-bold">{stats?.liveTests || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-lg">
                    <span className="text-[#F5F5F5]/80">Deadline Tests</span>
                    <span className="text-[#F5F5F5] font-bold">{stats?.deadlineTests || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-500/10 rounded-lg">
                    <span className="text-[#F5F5F5]/80">Active Tests</span>
                    <span className="text-[#F5F5F5] font-bold">{stats?.activeTests || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-500/10 rounded-lg">
                    <span className="text-[#F5F5F5]/80">Completed Tests</span>
                    <span className="text-[#F5F5F5] font-bold">{stats?.completedTests || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-[#FFA266]/10 rounded-lg">
                    <span className="text-[#F5F5F5]/80">Submission Rate</span>
                    <span className="text-[#FFA266] font-bold">{stats?.submissionRate || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Students */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-white/5 backdrop-blur-xl border-[#F5F5F5]/20">
              <CardHeader>
                <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.topStudents && stats.topStudents.length > 0 ? (
                  <div className="space-y-3">
                    {stats.topStudents.map((student: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              idx === 0
                                ? "bg-yellow-500 text-black"
                                : idx === 1
                                ? "bg-gray-400 text-black"
                                : idx === 2
                                ? "bg-amber-600 text-white"
                                : "bg-[#FFA266]/20 text-[#FFA266]"
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-[#F5F5F5] font-medium">
                              {student.student?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-[#F5F5F5]/60">
                              {student.totalTests} test{student.totalTests !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[#FFA266] font-bold text-lg">
                            {Math.round(student.avgScore)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#F5F5F5]/60 text-center py-8">No submissions yet</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/5 backdrop-blur-xl border-[#F5F5F5]/20">
            <CardHeader>
              <CardTitle className="text-[#F5F5F5] flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#FFA266]" />
                Recent Activity (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-[#FFA266]/10 rounded-lg border border-[#FFA266]/30">
                  <p className="text-sm text-[#F5F5F5]/60 mb-1">Tests Created</p>
                  <p className="text-3xl font-bold text-[#FFA266]">{stats?.recentTests || 0}</p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <p className="text-sm text-[#F5F5F5]/60 mb-1">Classrooms</p>
                  <p className="text-3xl font-bold text-green-400">{stats?.totalClassrooms || 0}</p>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                  <p className="text-sm text-[#F5F5F5]/60 mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-blue-400">{stats?.totalStudents || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
