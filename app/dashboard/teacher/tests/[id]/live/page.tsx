"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { teacherApi } from "@/lib/api";
import { subscribeToLeaderboard, publishLeaderboardUpdate, publishTestEnded } from "@/lib/ably";
import { 
  Brain, 
  Play, 
  Square, 
  Users, 
  Trophy, 
  Clock, 
  Loader2,
  Copy,
  CheckCircle,
  TrendingUp,
  Target,
  Zap,
  ArrowLeft
} from "lucide-react";
import confetti from "canvas-confetti";

interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  score: number;
  position: number;
  answeredQuestions: number;
}

interface Test {
  _id: string;
  title: string;
  description: string;
  joinCode: string;
  isActive: boolean;
  isCompleted: boolean;
  questions: any[];
  classroomId?: {
    _id: string;
    name: string;
  };
  classroom?: {
    name: string;
  };
}

export default function LiveTestControlPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Test | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);
  const [participants, setParticipants] = useState(0);

  useEffect(() => {
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (!test) return;

    // Subscribe to real-time leaderboard updates
    const unsubscribe = subscribeToLeaderboard(testId, (data) => {
      setLeaderboard(data);
      setParticipants(data.length);
    });

    return () => {
      unsubscribe();
    };
  }, [test, testId]);

  const fetchTest = async () => {
    setLoading(true);
    // Note: We need to add a getTestDetails endpoint for teachers
    // For now, we'll use the existing getTests and filter
    const response = await teacherApi.getTests();
    if (response.data) {
      const tests = (response.data as any).tests || [];
      const foundTest = tests.find((t: any) => t._id === testId);
      if (foundTest) {
        setTest(foundTest);
        setIsLive(foundTest.isActive || false);
      }
    }
    setLoading(false);
  };

  const handleStartTest = async () => {
    const response = await teacherApi.startLiveTest(testId);
    if (response.data) {
      setIsLive(true);
      setTest((response.data as any).test);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF991C", "#FF8F4D", "#FFB280"],
      });
    } else if (response.error) {
      alert(response.error);
    }
  };

  const handleStopTest = async () => {
    const confirmed = confirm(
      "Are you sure you want to end this live test?\n\n" +
      "⚠️ This action is PERMANENT:\n" +
      "- The test will be marked as completed\n" +
      "- Students can no longer join or submit answers\n" +
      "- Final results will be locked\n" +
      "- You CANNOT restart this test\n\n" +
      "Click OK to end the test permanently."
    );

    if (!confirmed) return;

    const response = await teacherApi.stopLiveTest(testId);
    if (response.data) {
      setIsLive(false);
      setTest((response.data as any).test);
      
      // Notify all students that the test has ended
      publishTestEnded(
        testId, 
        'The teacher has ended this test.', 
        `/dashboard/student/tests/${testId}/result`
      );
      
      alert("Test ended successfully! Final results are now available.");
      // Optionally refresh to show final state
      await fetchTest();
    } else if (response.error) {
      alert(response.error);
    }
  };

  const copyJoinCode = () => {
    if (test?.joinCode) {
      navigator.clipboard.writeText(test.joinCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#FF991C] animate-spin mx-auto mb-4" />
          <p className="text-[#F5F5F5]">Loading live session...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#F5F5F5] text-xl">Test not found</p>
          <Button
            onClick={() => router.push("/dashboard/teacher")}
            className="mt-4 bg-[#FF991C] hover:bg-[#FF8F4D] text-black"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Back to Dashboard Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            onClick={() => router.push("/dashboard/teacher")}
            variant="outline"
            className="border-[#FF991C] text-[#FF991C] hover:bg-[#FF991C] hover:text-black"
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-[#FF991C]/20 p-3 rounded-xl">
                  <Zap className="h-6 w-6 text-[#FF991C]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#F5F5F5]">{test.title}</h1>
                  <p className="text-sm text-[#F5F5F5]/60">
                    {test.classroomId?.name || test.classroom?.name || 'No classroom'}
                  </p>
                </div>
              </div>
            </div>
            
            {test.isCompleted ? (
              <div className="bg-gray-500/20 border-2 border-gray-500 rounded-lg px-8 py-4">
                <p className="text-[#F5F5F5] font-bold text-center">
                  ✅ Test Completed
                </p>
                <p className="text-[#F5F5F5]/60 text-sm text-center mt-1">
                  Final results locked
                </p>
              </div>
            ) : !isLive ? (
              <Button
                onClick={handleStartTest}
                className="bg-green-500 hover:bg-green-600 text-white font-bold h-14 px-8 shadow-xl"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Live Session
              </Button>
            ) : (
              <Button
                onClick={handleStopTest}
                className="bg-red-500 hover:bg-red-600 text-white font-bold h-14 px-8 shadow-xl"
              >
                <Square className="h-5 w-5 mr-2" />
                End Test (Permanent)
              </Button>
            )}
          </div>

          {/* Status Indicator */}
          <Card className={`backdrop-blur-xl border-2 ${
            test.isCompleted 
              ? "bg-gray-500/20 border-gray-500"
              : isLive 
                ? "bg-green-500/20 border-green-500" 
                : "bg-gray-500/20 border-gray-500"
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`h-4 w-4 rounded-full ${
                    test.isCompleted
                      ? "bg-gray-500"
                      : isLive 
                        ? "bg-green-500 animate-pulse" 
                        : "bg-gray-500"
                  }`}></div>
                  <span className="text-xl font-bold text-[#F5F5F5]">
                    {test.isCompleted 
                      ? "✅ COMPLETED" 
                      : isLive 
                        ? "🔴 LIVE NOW" 
                        : "⚫ Not Started"}
                  </span>
                </div>
                {isLive && test.joinCode && (
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-[#F5F5F5]/60 mb-1">Join Code</p>
                      <p className="text-3xl font-bold text-[#FF991C] tracking-wider">
                        {test.joinCode}
                      </p>
                    </div>
                    <Button
                      onClick={copyJoinCode}
                      variant="outline"
                      className="border-[#FF991C] text-[#FF991C] hover:bg-[#FF991C] hover:text-black"
                    >
                      {copiedCode ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Participants", value: participants, icon: Users, color: "#FF991C" },
            { label: "Questions", value: test.questions.length, icon: Target, color: "#FF991C" },
            { 
              label: "Status", 
              value: test.isCompleted ? "Completed" : isLive ? "Active" : "Idle", 
              icon: Clock, 
              color: test.isCompleted ? "#6B7280" : isLive ? "#10B981" : "#6B7280" 
            },
            { label: "Join Code", value: test.joinCode || "N/A", icon: Brain, color: "#FF991C" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 hover:border-[#FF991C]/50 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-black/70 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-black">{stat.value}</p>
                    </div>
                    <div className="bg-[#FF991C]/20 p-3 rounded-xl">
                      <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Live Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-black flex items-center gap-3">
                    <Trophy className="h-6 w-6 text-[#FF991C]" />
                    Live Leaderboard
                  </CardTitle>
                  <CardDescription className="text-black/60">
                    Real-time student rankings
                  </CardDescription>
                </div>
                {isLive && (
                  <div className="flex items-center gap-2 text-green-600">
                    <div className="h-2 w-2 bg-green-600 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold">Live Updates</span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {leaderboard.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-black/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {isLive ? "Waiting for students..." : "Start the test to see participants"}
                  </h3>
                  <p className="text-sm text-black/60">
                    {isLive 
                      ? "Students will appear here as they join and submit answers"
                      : "Click 'Start Live Session' to begin"
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.studentId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        index === 0
                          ? "bg-yellow-50 border-yellow-300 shadow-lg"
                          : index === 1
                          ? "bg-gray-50 border-gray-300"
                          : index === 2
                          ? "bg-orange-50 border-orange-300"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg ${
                            index === 0
                              ? "bg-yellow-400 text-yellow-900"
                              : index === 1
                              ? "bg-gray-400 text-gray-900"
                              : index === 2
                              ? "bg-orange-400 text-orange-900"
                              : "bg-[#FF991C]/20 text-[#FF991C]"
                          }`}>
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-black text-lg">{entry.studentName}</h4>
                            <p className="text-xs text-black/60">
                              {entry.answeredQuestions} / {test.questions.length} questions answered
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-[#FF991C] flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            {entry.score}
                          </div>
                          <p className="text-xs text-black/60">points</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
