"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { studentApi } from "@/lib/api";
import { Trophy, CheckCircle, XCircle, Loader2, Home, Target, Brain } from "lucide-react";
import confetti from "canvas-confetti";

interface QuestionResult {
  questionText: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer: number;
  isCorrect: boolean;
}

interface Result {
  score: number;
  maxScore: number;
  percentage: number;
  test: {
    title: string;
    classroomId: {
      name: string;
    };
  };
  answers: QuestionResult[];
}

export default function TestResultPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    fetchResult();
  }, [testId]);

  useEffect(() => {
    if (result && result.percentage >= 80) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#FFA266", "#FF8F4D", "#FFB280"],
      });
    }
  }, [result]);

  const fetchResult = async () => {
    setLoading(true);
    const response = await studentApi.getTestResult(testId);
    if (response.data) {
      setResult(response.data as any);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#FFA266] animate-spin mx-auto mb-4" />
          <p className="text-[#F5F5F5]">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-[#F5F5F5] text-xl">Results not found</p>
          <Button 
            onClick={() => router.push("/dashboard/student")}
            className="mt-4 bg-[#FFA266] hover:bg-[#FF8F4D] text-black"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-500";
    if (percentage >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBg = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500/20 border-green-500";
    if (percentage >= 60) return "bg-yellow-500/20 border-yellow-500";
    return "bg-red-500/20 border-red-500";
  };

  const getMessage = (percentage: number) => {
    if (percentage >= 90) return "Outstanding! 🌟";
    if (percentage >= 80) return "Excellent work! 🎉";
    if (percentage >= 70) return "Great job! 👏";
    if (percentage >= 60) return "Good effort! 💪";
    if (percentage >= 50) return "Keep practicing! 📚";
    return "Don't give up! 💪";
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FFA266]/20 rounded-full blur-3xl animate-pulse-color"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-[#FFA266]/20 rounded-full blur-3xl animate-pulse-color" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Score Card */}
          <Card className={`backdrop-blur-xl border-2 mb-8 ${getScoreBg(result.percentage)}`}>
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="text-center"
              >
                <Trophy className={`h-20 w-20 mx-auto mb-4 ${getScoreColor(result.percentage)}`} />
                <h1 className="text-4xl font-bold text-[#F5F5F5] mb-2">{getMessage(result.percentage)}</h1>
                <p className="text-[#F5F5F5]/70 text-lg mb-6">{result.test.title}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-sm text-[#F5F5F5]/60 mb-1">Your Score</p>
                    <p className={`text-4xl font-bold ${getScoreColor(result.percentage)}`}>
                      {result.score} / {result.maxScore}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-sm text-[#F5F5F5]/60 mb-1">Percentage</p>
                    <p className={`text-4xl font-bold ${getScoreColor(result.percentage)}`}>
                      {Math.round(result.percentage)}%
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-sm text-[#F5F5F5]/60 mb-1">Questions</p>
                    <p className="text-4xl font-bold text-[#F5F5F5]">
                      {result.answers.filter(a => a.isCorrect).length} / {result.answers.length}
                    </p>
                  </div>
                </div>

                <Progress 
                  value={result.percentage} 
                  className="h-3 bg-black/20 mb-4"
                />
              </motion.div>
            </CardContent>
          </Card>

          {/* Question Review */}
          <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FFA266]/20 mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-black flex items-center gap-3">
                <Brain className="h-6 w-6 text-[#FFA266]" />
                Answer Review
              </CardTitle>
              <CardDescription className="text-black/60">
                Review your answers and learn from your mistakes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.answers.map((answer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-2 ${
                    answer.isCorrect 
                      ? "bg-green-50 border-green-200" 
                      : "bg-red-50 border-red-200"
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        {answer.isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-black text-lg">Question {index + 1}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              answer.isCorrect 
                                ? "bg-green-200 text-green-800" 
                                : "bg-red-200 text-red-800"
                            }`}>
                              {answer.isCorrect ? "Correct" : "Incorrect"}
                            </span>
                          </div>
                          <p className="text-black/80 mb-4">{answer.questionText}</p>
                          
                          <div className="space-y-2">
                            {answer.options.map((option, optIndex) => {
                              const isCorrect = optIndex === answer.correctAnswer;
                              const isSelected = optIndex === answer.selectedAnswer;
                              
                              return (
                                <div
                                  key={optIndex}
                                  className={`p-3 rounded-lg border-2 ${
                                    isCorrect
                                      ? "bg-green-100 border-green-300"
                                      : isSelected
                                      ? "bg-red-100 border-red-300"
                                      : "bg-white border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-black">{option}</span>
                                    <div className="flex items-center gap-2">
                                      {isCorrect && (
                                        <span className="text-xs px-2 py-0.5 bg-green-200 text-green-800 rounded-full font-semibold">
                                          Correct Answer
                                        </span>
                                      )}
                                      {isSelected && !isCorrect && (
                                        <span className="text-xs px-2 py-0.5 bg-red-200 text-red-800 rounded-full font-semibold">
                                          Your Answer
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={() => router.push("/dashboard/student")}
              className="flex-1 h-14 bg-[#F5F5F5] hover:bg-white text-black border-2 border-[#FFA266]/20 font-semibold"
            >
              <Home className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
            <Button
              onClick={() => router.push(`/dashboard/student/tests/${testId}/take`)}
              className="flex-1 h-14 bg-[#FFA266] hover:bg-[#FF8F4D] text-black font-semibold shadow-lg"
            >
              <Target className="h-5 w-5 mr-2" />
              Retake Test
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
