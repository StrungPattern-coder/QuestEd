"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { studentApi } from "@/lib/api";
import { publishLeaderboardUpdate } from "@/lib/ably";
import { Brain, Clock, CheckCircle, XCircle, Loader2, ArrowRight, Trophy } from "lucide-react";
import confetti from "canvas-confetti";

interface Question {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
}

interface Test {
  _id: string;
  title: string;
  description: string;
  mode?: string;
  classroomId: {
    name: string;
  };
  questions: Question[];
  timeLimitPerQuestion: number;
}

export default function TakeTestPage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Test | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);

  useEffect(() => {
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (test && timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback && test) {
      // Auto-submit when time runs out
      handleAnswerSubmit();
    }
  }, [timeLeft, showFeedback, test]);

  const fetchTest = async () => {
    setLoading(true);
    const response = await studentApi.getTestDetails(testId);
    if (response.data) {
      const testData = response.data as any;
      setTest(testData.test);
      setTimeLeft(testData.test.timeLimitPerQuestion);
      setAnswers(new Array(testData.test.questions.length).fill(-1));
    } else {
      router.push("/dashboard/student");
    }
    setLoading(false);
  };

  const handleAnswerSubmit = () => {
    if (!test) return;

    const currentQuestion = test.questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer ?? -1;
    setAnswers(newAnswers);

    if (correct) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FF991C", "#FF8F4D", "#FFB280"],
      });
    }
  };

  const handleNext = () => {
    if (!test) return;

    setShowFeedback(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(test.timeLimitPerQuestion);
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    if (!test) return;

    setSubmitting(true);
    
    const formattedAnswers = test.questions.map((question, index) => ({
      questionId: question._id,
      selectedAnswer: answers[index],
    }));

    const response = await studentApi.submitTest(testId, formattedAnswers);
    
    if (response.data) {
      // Calculate score for live leaderboard
      const score = answers.reduce((total, answer, idx) => {
        return total + (answer === test.questions[idx].correctAnswer ? 1 : 0);
      }, 0);

      // Publish to live leaderboard if it's a live test
      if (test.mode === 'live') {
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName') || 'Anonymous';
        
        // Note: In production, you'd fetch the current leaderboard and update it
        // For now, we'll just publish this user's score
        publishLeaderboardUpdate(testId, [{
          studentId: userId || '',
          studentName: userName,
          score: score,
          position: 1,
          answeredQuestions: answers.filter(a => a !== -1).length,
        }]);
      }

      setTestComplete(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ["#FF991C", "#FF8F4D", "#FFB280"],
      });
      
      // Redirect to results after 3 seconds
      setTimeout(() => {
        router.push(`/dashboard/student/tests/${testId}/result`);
      }, 3000);
    }
    
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[#FF991C] animate-spin mx-auto mb-4" />
          <p className="text-[#F5F5F5]">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-[#F5F5F5] text-xl">Test not found</p>
        </div>
      </div>
    );
  }

  if (testComplete) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="text-center"
        >
          <Trophy className="h-24 w-24 text-[#FF991C] mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-[#F5F5F5] mb-4">Test Complete! 🎉</h1>
          <p className="text-[#F5F5F5]/70 text-lg">Redirecting to results...</p>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const timePercentage = (timeLeft / test.timeLimitPerQuestion) * 100;

  return (
    <div className="min-h-screen bg-black">
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#F5F5F5]">{test.title}</h1>
              <p className="text-sm text-[#F5F5F5]/60">{test.classroomId?.name || 'Unknown Classroom'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-[#F5F5F5]/60">Question</p>
                <p className="text-xl font-bold text-[#FF991C]">
                  {currentQuestionIndex + 1} / {test.questions.length}
                </p>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>

        {/* Timer */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-8"
        >
          <Card className={`backdrop-blur-xl border-2 transition-all duration-300 ${
            timeLeft <= 5 ? "bg-red-500/20 border-red-500" : "bg-[#F5F5F5]/10 border-[#FF991C]/30"
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Clock className={`h-6 w-6 ${timeLeft <= 5 ? "text-red-500" : "text-[#FF991C]"}`} />
                  <span className="text-2xl font-bold text-[#F5F5F5]">
                    {timeLeft}s
                  </span>
                </div>
                <span className="text-[#F5F5F5]/60">Time Remaining</span>
              </div>
              <Progress 
                value={timePercentage} 
                className={`h-2 ${timeLeft <= 5 ? "bg-red-900" : "bg-white/10"}`}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 mb-6">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-black mb-8">{currentQuestion.questionText}</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectAnswer = index === currentQuestion.correctAnswer;
                    const showCorrect = showFeedback && isCorrectAnswer;
                    const showWrong = showFeedback && isSelected && !isCorrect;

                    return (
                      <motion.button
                        key={index}
                        onClick={() => !showFeedback && setSelectedAnswer(index)}
                        disabled={showFeedback}
                        whileHover={!showFeedback ? { scale: 1.02 } : {}}
                        whileTap={!showFeedback ? { scale: 0.98 } : {}}
                        className={`p-6 rounded-xl text-left font-semibold text-lg transition-all duration-300 ${
                          showCorrect
                            ? "bg-green-500 text-white border-4 border-green-600"
                            : showWrong
                            ? "bg-red-500 text-white border-4 border-red-600"
                            : isSelected
                            ? "bg-[#FF991C] text-black border-4 border-[#FF8F4D] shadow-lg"
                            : "bg-white/50 text-black border-2 border-black/10 hover:border-[#FF991C] hover:bg-white/70"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showCorrect && <CheckCircle className="h-6 w-6" />}
                          {showWrong && <XCircle className="h-6 w-6" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <Card className={`backdrop-blur-xl border-2 ${
                    isCorrect ? "bg-green-500/20 border-green-500" : "bg-red-500/20 border-red-500"
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        {isCorrect ? (
                          <CheckCircle className="h-12 w-12 text-green-500" />
                        ) : (
                          <XCircle className="h-12 w-12 text-red-500" />
                        )}
                        <div>
                          <h3 className="text-2xl font-bold text-[#F5F5F5] mb-1">
                            {isCorrect ? "Correct! 🎉" : "Incorrect 😔"}
                          </h3>
                          <p className="text-[#F5F5F5]/80">
                            {isCorrect 
                              ? "Great job! Keep it up!" 
                              : `The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit/Next Button */}
            {showFeedback ? (
              <Button
                onClick={handleNext}
                disabled={submitting}
                className="w-full h-16 bg-[#FF991C] hover:bg-[#FF8F4D] text-black font-bold text-xl shadow-xl"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                    Submitting Test...
                  </>
                ) : currentQuestionIndex < test.questions.length - 1 ? (
                  <>
                    Next Question
                    <ArrowRight className="h-6 w-6 ml-2" />
                  </>
                ) : (
                  "Submit Test"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="w-full h-16 bg-[#FF991C] hover:bg-[#FF8F4D] text-black font-bold text-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
