"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { studentApi } from "@/lib/api";
import { publishLeaderboardUpdate, subscribeToLeaderboard } from "@/lib/ably";
import { Brain, Clock, CheckCircle, XCircle, Loader2, ArrowRight, Trophy, Users } from "lucide-react";
import { triggerRandomCelebration } from "@/lib/celebrations";
import { playSoundEffect } from "@/lib/sounds";
import SoundToggle from "@/components/SoundToggle";
import confetti from "canvas-confetti";

interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  score: number;
  position: number;
  answeredQuestions: number;
}

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
  const [isLiveTest, setIsLiveTest] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    fetchTest();
  }, [testId]);

  useEffect(() => {
    // Subscribe to leaderboard updates for live tests
    if (test && isLiveTest) {
      const unsubscribe = subscribeToLeaderboard(testId, (data) => {
        setLeaderboard(data);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [test, isLiveTest, testId]);

  useEffect(() => {
    if (test && testStarted && timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        // Play tick sound when timer is low
        if (timeLeft <= 5) {
          playSoundEffect.timerTick();
        }
        if (timeLeft === 6) {
          playSoundEffect.timerWarning();
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback && test && testStarted) {
      // Auto-submit when time runs out
      handleAnswerSubmit();
    }
  }, [timeLeft, showFeedback, test, testStarted]);

  const fetchTest = async () => {
    setLoading(true);
    const response = await studentApi.getTestDetails(testId);
    if (response.data) {
      const testData = response.data as any;
      setTest(testData.test);
      setTimeLeft(testData.test.timeLimitPerQuestion);
      setAnswers(new Array(testData.test.questions.length).fill(-1));
      setIsLiveTest(testData.test.mode === 'live');
      setQuestionStartTime(Date.now());
      
      // If it's a live test, join it and initialize leaderboard
      if (testData.test.mode === 'live') {
        await joinLiveTest();
      }
    } else {
      router.push("/dashboard/student");
    }
    setLoading(false);
  };

  const joinLiveTest = async () => {
    try {
      const response = await fetch(`/api/student/tests/${testId}/join-live`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
        // Broadcast updated leaderboard to all participants
        publishLeaderboardUpdate(testId, data.leaderboard);
      }
    } catch (error) {
      console.error('Error joining live test:', error);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!test) return;

    const currentQuestion = test.questions[currentQuestionIndex];
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer ?? -1;
    setAnswers(newAnswers);

    // Play sound effect based on correctness
    if (correct) {
      playSoundEffect.correctAnswer();
    } else {
      playSoundEffect.wrongAnswer();
    }

    // For live tests, submit answer to API and update leaderboard
    if (isLiveTest) {
      try {
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
        const response = await fetch(`/api/student/tests/${testId}/submit-question`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            questionId: currentQuestion._id,
            selectedAnswer: selectedAnswer ?? -1,
            questionIndex: currentQuestionIndex,
            timeSpent,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentScore(data.currentScore);
          setLeaderboard(data.leaderboard || []);
          // Broadcast updated leaderboard to all participants
          publishLeaderboardUpdate(testId, data.leaderboard);
        }
      } catch (error) {
        console.error('Error submitting answer:', error);
      }
    }

    if (correct) {
      // Trigger random celebration animation for correct answers
      triggerRandomCelebration();
    }
  };

  const handleNext = () => {
    if (!test) return;

    setShowFeedback(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(test.timeLimitPerQuestion);
      setQuestionStartTime(Date.now()); // Reset timer for next question
    } else {
      submitTest();
    }
  };

  const submitTest = async () => {
    if (!test) return;

    setSubmitting(true);
    
    // For non-live tests, use the traditional submission
    if (!isLiveTest) {
      const formattedAnswers = test.questions.map((question, index) => ({
        questionId: question._id,
        selectedAnswer: answers[index],
      }));

      const response = await studentApi.submitTest(testId, formattedAnswers);
      
      if (response.data) {
        setTestComplete(true);
        triggerRandomCelebration();
        
        setTimeout(() => {
          router.push(`/dashboard/student/tests/${testId}/result`);
        }, 3000);
      }
    } else {
      // For live tests, all answers are already submitted
      // Just mark as complete and redirect
      setTestComplete(true);
      triggerRandomCelebration();
      
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

  // Test Preview/Start Screen
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <Card className="bg-[#F5F5F5]/10 backdrop-blur-xl border-2 border-[#FF991C]/30 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FF991C] to-[#FF8F4D] text-white p-8 text-center">
              <Brain className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
              <p className="text-white/90">{test.classroomId?.name || 'Unknown Classroom'}</p>
              {test.description && (
                <p className="text-white/80 text-sm mt-2">{test.description}</p>
              )}
            </div>

            {/* Content */}
            <CardContent className="p-8">
              {/* Test Details */}
              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-bold text-[#F5F5F5] mb-4">Test Details</h2>
                
                <div className="bg-black/30 border-2 border-[#FF991C]/20 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF991C]/20 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-[#FF991C]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-[#F5F5F5]/60">Total Questions</div>
                      <div className="font-semibold text-[#F5F5F5]">{test.questions.length} questions</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF991C]/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#FF991C]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-[#F5F5F5]/60">Time per Question</div>
                      <div className="font-semibold text-[#F5F5F5]">{test.timeLimitPerQuestion} seconds</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FF991C]/20 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-[#FF991C]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-[#F5F5F5]/60">Test Mode</div>
                      <div className="font-semibold text-[#F5F5F5]">
                        {isLiveTest ? 'Live Test (Real-time Leaderboard)' : 'Standard Test'}
                      </div>
                    </div>
                  </div>

                  {test.classroomId?.name && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#FF991C]/20 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#FF991C]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-[#F5F5F5]/60">Classroom</div>
                        <div className="font-semibold text-[#F5F5F5]">{test.classroomId.name}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-[#FF991C]/10 border border-[#FF991C]/30 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-[#FF991C] mb-2 text-sm">Instructions:</h3>
                <ul className="text-xs text-[#F5F5F5]/70 space-y-1">
                  <li>• Read each question carefully before selecting your answer</li>
                  <li>• You have {test.timeLimitPerQuestion} seconds to answer each question</li>
                  <li>• Questions will auto-submit when time runs out</li>
                  {isLiveTest && <li>• You'll see instant feedback and live leaderboard updates</li>}
                  <li>• You cannot go back to previous questions</li>
                  <li>• Your results will be available after completion</li>
                </ul>
              </div>

              <Button 
                onClick={() => setTestStarted(true)}
                size="lg"
                className="w-full bg-gradient-to-r from-[#FF991C] to-[#FF8F4D] hover:from-[#FF8F4D] hover:to-[#FF991C] text-lg py-6"
              >
                Start Test
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;
  const timePercentage = (timeLeft / test.timeLimitPerQuestion) * 100;

  return (
    <div className="min-h-screen bg-black">
      {/* Sound Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <SoundToggle />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">{test.title}</h1>
              <p className="text-xs sm:text-sm text-[#F5F5F5]/60">{test.classroomId?.name || 'Unknown Classroom'}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-[#F5F5F5]/60">Question</p>
                <p className="text-lg sm:text-xl font-bold text-[#FF991C]">
                  {currentQuestionIndex + 1} / {test.questions.length}
                </p>
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-1.5 sm:h-2 bg-white/10" />
        </div>

        {/* Timer */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6 sm:mb-8"
        >
          <Card className={`backdrop-blur-xl border-2 transition-all duration-300 ${
            timeLeft <= 5 ? "bg-red-500/20 border-red-500" : "bg-[#F5F5F5]/10 border-[#FF991C]/30"
          }`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Clock className={`h-5 w-5 sm:h-6 sm:w-6 ${timeLeft <= 5 ? "text-red-500" : "text-[#FF991C]"}`} />
                  <span className="text-xl sm:text-2xl font-bold text-[#F5F5F5]">
                    {timeLeft}s
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-[#F5F5F5]/60">Time Remaining</span>
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
