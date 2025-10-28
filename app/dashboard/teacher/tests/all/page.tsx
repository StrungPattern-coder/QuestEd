"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Calendar,
  Clock,
  Download,
  Eye,
  Trophy,
  Target,
  Loader2,
  Plus,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { teacherApi } from "@/lib/api";

interface TestWithStats {
  _id: string;
  title: string;
  description: string;
  mode: 'live' | 'deadline';
  classroomId: {
    _id: string;
    name: string;
    students: any[];
  };
  questions: any[];
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
  createdAt: string;
  stats: {
    totalStudents: number;
    submittedCount: number;
    notSubmittedCount: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    submissionRate: number;
  };
  submissions: any[];
}

export default function AllTestsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<TestWithStats[]>([]);
  const [filter, setFilter] = useState<'all' | 'live' | 'deadline'>('all');

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/teacher/tests/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = await response.json();
      if (data.tests) {
        setTests(data.tests);
      }
    } catch (error) {
      console.error('Failed to fetch tests:', error);
    }
    setLoading(false);
  };

  const downloadResults = (testId: string, testTitle: string) => {
    const test = tests.find(t => t._id === testId);
    if (!test) return;

    const csv = [
      ['Student Name', 'Email', 'Enrollment Number', 'Score', 'Submitted At', 'Late'],
      ...test.submissions.map(sub => [
        sub.student?.name || 'Unknown',
        sub.student?.email || 'Unknown',
        sub.student?.enrollmentNumber || 'N/A',
        sub.score.toString(),
        new Date(sub.submittedAt).toLocaleString(),
        sub.submittedLate ? 'Yes' : 'No',
      ]),
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${testTitle.replace(/\s+/g, '_')}_results.csv`;
    a.click();
  };

  const filteredTests = tests.filter(test => {
    if (filter === 'all') return true;
    return test.mode === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#FFA266] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FFA266]/20 rounded-full blur-3xl animate-pulse-color"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/teacher">
              <Button variant="ghost" className="text-[#F5F5F5] hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-[#F5F5F5]">All Tests</h1>
              <p className="text-[#F5F5F5]/60">Manage and view all your created tests</p>
            </div>
          </div>
          
          <Button
            onClick={() => router.push('/dashboard/teacher/tests/create')}
            className="bg-[#FFA266] hover:bg-[#FF8F4D] text-black font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Test
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-6">
          {[
            { key: 'all', label: 'All Tests', icon: FileText },
            { key: 'live', label: 'Live Mode', icon: Target },
            { key: 'deadline', label: 'Deadline Mode', icon: Calendar },
          ].map((tab) => (
            <Button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              variant={filter === tab.key ? 'default' : 'outline'}
              className={`${
                filter === tab.key
                  ? 'bg-[#FFA266] text-black hover:bg-[#FF8F4D]'
                  : 'border-[#FFA266]/30 text-[#F5F5F5] hover:bg-white/10'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#F5F5F5]/95 border-[#FFA266]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black/70 mb-1">Total Tests</p>
                  <p className="text-3xl font-bold text-black">{tests.length}</p>
                </div>
                <FileText className="h-10 w-10 text-[#FFA266]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#F5F5F5]/95 border-[#FFA266]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black/70 mb-1">Total Submissions</p>
                  <p className="text-3xl font-bold text-black">
                    {tests.reduce((sum, t) => sum + t.stats.submittedCount, 0)}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#F5F5F5]/95 border-[#FFA266]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black/70 mb-1">Avg Submission Rate</p>
                  <p className="text-3xl font-bold text-black">
                    {tests.length > 0
                      ? Math.round(tests.reduce((sum, t) => sum + t.stats.submissionRate, 0) / tests.length)
                      : 0}%
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-[#FFA266]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#F5F5F5]/95 border-[#FFA266]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black/70 mb-1">Avg Score</p>
                  <p className="text-3xl font-bold text-black">
                    {tests.length > 0
                      ? Math.round(tests.reduce((sum, t) => sum + t.stats.averageScore, 0) / tests.length)
                      : 0}%
                  </p>
                </div>
                <Trophy className="h-10 w-10 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tests List */}
        {filteredTests.length === 0 ? (
          <Card className="bg-[#F5F5F5]/95 border-[#FFA266]/20">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-black/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-black mb-2">No tests found</h3>
              <p className="text-black/60 mb-6">Create your first test to get started!</p>
              <Button
                onClick={() => router.push('/dashboard/teacher/tests/create')}
                className="bg-[#FFA266] hover:bg-[#FF8F4D] text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Test
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredTests.map((test, index) => (
              <motion.div
                key={test._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-[#F5F5F5]/95 border-[#FFA266]/20 hover:border-[#FFA266]/50 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl text-black">{test.title}</CardTitle>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            test.mode === 'live'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {test.mode === 'live' ? '⚡ Live' : '📅 Deadline'}
                          </span>
                          {test.isActive && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              🔴 Active
                            </span>
                          )}
                        </div>
                        <CardDescription className="text-black/60">
                          {test.classroomId?.name} • {test.questions.length} questions • Created {new Date(test.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadResults(test._id, test.title)}
                          className="border-[#FFA266]/30 hover:border-[#FFA266]"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Export
                        </Button>
                        {test.mode === 'live' && (
                          <Button
                            size="sm"
                            onClick={() => router.push(`/dashboard/teacher/tests/${test._id}/live`)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Live View
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-black/60 mb-1">Students</p>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-[#FFA266]" />
                          <p className="text-lg font-bold text-black">{test.stats.totalStudents}</p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-black/60 mb-1">Submitted</p>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <p className="text-lg font-bold text-black">{test.stats.submittedCount}</p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-black/60 mb-1">Pending</p>
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <p className="text-lg font-bold text-black">{test.stats.notSubmittedCount}</p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-black/60 mb-1">Rate</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-[#FFA266]" />
                          <p className="text-lg font-bold text-black">{test.stats.submissionRate}%</p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-black/60 mb-1">Avg Score</p>
                        <div className="flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <p className="text-lg font-bold text-black">{Math.round(test.stats.averageScore)}%</p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-black/60 mb-1">Highest</p>
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-green-500" />
                          <p className="text-lg font-bold text-black">{test.stats.highestScore}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Top Performers */}
                    {test.submissions.length > 0 && (
                      <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <h4 className="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                          Top Performers
                        </h4>
                        <div className="flex gap-2 flex-wrap">
                          {test.submissions
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 3)
                            .map((sub, idx) => (
                              <div
                                key={sub._id}
                                className="px-3 py-1 bg-white rounded-full text-xs font-medium flex items-center gap-2"
                              >
                                <span className="text-yellow-600">#{idx + 1}</span>
                                <span className="text-black">{sub.student?.name}</span>
                                <span className="text-[#FFA266] font-bold">{sub.score}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
