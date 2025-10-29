"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Users, CheckCircle, XCircle, TrendingUp, Trophy, Clock, Target, Award } from "lucide-react";
import Link from "next/link";

interface Student {
  _id: string;
  name: string;
  email: string;
  enrollmentNumber?: string;
  rollNumber?: string;
}

interface Answer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

interface Submission {
  _id: string;
  studentId: Student;
  score: number;
  answers: Answer[];
  submittedAt: string;
  submittedLate: boolean;
}

interface Question {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface Test {
  _id: string;
  title: string;
  description: string;
  mode: string;
  questions: Question[];
  startTime: string;
  endTime: string;
  classroomId: {
    _id: string;
    name: string;
  };
}

interface Analytics {
  totalStudents: number;
  submitted: number;
  notSubmitted: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  submissionRate: number;
}

export default function TestResultsPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Test | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [studentsWhoDidnt, setStudentsWhoDidnt] = useState<Student[]>([]);

  useEffect(() => {
    fetchTestResults();
  }, [testId]);

  const fetchTestResults = async () => {
    try {
      const response = await fetch(`/api/teacher/tests/${testId}/results`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      
      if (data.test) {
        setTest(data.test);
        setSubmissions(data.submissions || []);
        setAnalytics(data.analytics);
        setStudentsWhoDidnt(data.studentsWhoDidnt || []);
      }
    } catch (error) {
      console.error('Failed to fetch test results:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!test || !submissions.length) return;

    const headers = ['Rank', 'Name', 'Email', 'Enrollment', 'Roll', 'Score', 'Percentage', 'Status', 'Submitted At'];
    const rows = submissions.map((sub, index) => [
      index + 1,
      sub.studentId.name,
      sub.studentId.email,
      sub.studentId.enrollmentNumber || 'N/A',
      sub.studentId.rollNumber || 'N/A',
      `${sub.score}/${test.questions.length}`,
      `${Math.round((sub.score / test.questions.length) * 100)}%`,
      sub.submittedLate ? 'Late' : 'On Time',
      new Date(sub.submittedAt).toLocaleString(),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${test.title.replace(/\s+/g, '_')}_Results.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 border-4 border-[#FF991C]/30 border-t-[#FF991C] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#F5F5F5]">Loading test results...</p>
        </div>
      </div>
    );
  }

  if (!test || !analytics) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#F5F5F5] text-xl">Test not found</p>
          <Link href="/dashboard/teacher">
            <Button className="mt-4 bg-[#FF991C] hover:bg-[#FF8F4D] text-black">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const topPerformers = submissions.slice(0, 3);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <nav className="border-b border-[#FF991C]/20 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/teacher/tests/all">
              <Button variant="ghost" className="text-[#F5F5F5] hover:bg-[#FF991C]/10">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tests
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-[#F5F5F5]">Test Results</h1>
            <Button 
              onClick={exportToCSV}
              className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black"
              disabled={submissions.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Test Info Card */}
          <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 mb-8">
            <CardHeader>
              <CardTitle className="text-3xl text-black">{test.title}</CardTitle>
              <CardDescription className="text-black/70 text-base">
                {test.description || 'No description provided'}
              </CardDescription>
              <div className="flex items-center gap-4 mt-4 text-sm text-black/70">
                <span>📚 {test.classroomId.name}</span>
                <span>•</span>
                <span>📝 {test.questions.length} Questions</span>
                <span>•</span>
                <span className="capitalize">{test.mode} Mode</span>
              </div>
            </CardHeader>
          </Card>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/90 to-blue-600/90 border-blue-400/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Total Students</p>
                    <p className="text-4xl font-bold text-white">{analytics.totalStudents}</p>
                  </div>
                  <Users className="h-12 w-12 text-white/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/90 to-green-600/90 border-green-400/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Submitted</p>
                    <p className="text-4xl font-bold text-white">{analytics.submitted}</p>
                  </div>
                  <CheckCircle className="h-12 w-12 text-white/50" />
                </div>
                <p className="text-xs text-white/70 mt-2">
                  {analytics.submissionRate.toFixed(1)}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-gradient-to-br from-amber-500/90 to-amber-600/90 border-amber-400/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Average Score</p>
                    <p className="text-4xl font-bold text-white">
                      {analytics.averageScore.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-white/50" />
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/90 to-purple-600/90 border-purple-400/30">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Highest Score</p>
                    <p className="text-4xl font-bold text-white">
                      {analytics.highestScore.toFixed(1)}%
                    </p>
                  </div>
                  <Trophy className="h-12 w-12 text-white/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performers */}
          {topPerformers.length > 0 && (
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 mb-8">
              <CardHeader>
                <CardTitle className="text-2xl text-black flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-[#FF991C]" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topPerformers.map((submission, index) => (
                    <div
                      key={submission._id}
                      className={`p-6 rounded-lg ${
                        index === 0
                          ? 'bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 border-2 border-yellow-500/50'
                          : index === 1
                          ? 'bg-gradient-to-br from-gray-300/20 to-gray-400/20 border-2 border-gray-400/50'
                          : 'bg-gradient-to-br from-orange-400/20 to-orange-500/20 border-2 border-orange-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`text-4xl ${
                          index === 0 ? 'filter drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : ''
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-black text-lg">{submission.studentId.name}</h3>
                          <p className="text-sm text-black/60">{submission.studentId.enrollmentNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-black">
                          {Math.round((submission.score / test.questions.length) * 100)}%
                        </span>
                        <span className="text-sm text-black/70">
                          {submission.score}/{test.questions.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submissions Table */}
          <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-black flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-[#FF991C]" />
                All Submissions ({submissions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <XCircle className="h-16 w-16 text-black/20 mx-auto mb-4" />
                  <p className="text-black/60">No submissions yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-black/10">
                        <th className="text-left py-3 px-4 text-black font-semibold">Rank</th>
                        <th className="text-left py-3 px-4 text-black font-semibold">Student</th>
                        <th className="text-left py-3 px-4 text-black font-semibold">Enrollment</th>
                        <th className="text-center py-3 px-4 text-black font-semibold">Score</th>
                        <th className="text-center py-3 px-4 text-black font-semibold">Percentage</th>
                        <th className="text-center py-3 px-4 text-black font-semibold">Status</th>
                        <th className="text-left py-3 px-4 text-black font-semibold">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((submission, index) => (
                        <tr key={submission._id} className="border-b border-black/5 hover:bg-black/5">
                          <td className="py-4 px-4">
                            <span className="font-bold text-black">#{index + 1}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-semibold text-black">{submission.studentId.name}</p>
                              <p className="text-sm text-black/60">{submission.studentId.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-black/80">
                            {submission.studentId.enrollmentNumber || 'N/A'}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="font-bold text-black">
                              {submission.score}/{test.questions.length}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              (submission.score / test.questions.length) * 100 >= 80
                                ? 'bg-green-500/20 text-green-700'
                                : (submission.score / test.questions.length) * 100 >= 60
                                ? 'bg-blue-500/20 text-blue-700'
                                : (submission.score / test.questions.length) * 100 >= 40
                                ? 'bg-amber-500/20 text-amber-700'
                                : 'bg-red-500/20 text-red-700'
                            }`}>
                              {Math.round((submission.score / test.questions.length) * 100)}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            {submission.submittedLate ? (
                              <span className="inline-flex items-center gap-1 text-sm text-amber-600">
                                <Clock className="h-3 w-3" />
                                Late
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                On Time
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-sm text-black/70">
                            {new Date(submission.submittedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Students Who Didn't Submit */}
          {studentsWhoDidnt.length > 0 && (
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-2xl text-black flex items-center gap-2">
                  <XCircle className="h-6 w-6 text-red-500" />
                  Pending Submissions ({studentsWhoDidnt.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentsWhoDidnt.map((student) => (
                    <div
                      key={student._id}
                      className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
                    >
                      <p className="font-semibold text-black">{student.name}</p>
                      <p className="text-sm text-black/60">{student.email}</p>
                      {student.enrollmentNumber && (
                        <p className="text-xs text-black/50 mt-1">{student.enrollmentNumber}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
