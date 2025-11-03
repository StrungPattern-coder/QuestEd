'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Clock, Target, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import { getSocketClient, publishQuizEnded, subscribeToQuickQuizAnswers } from '@/lib/socket';
import Podium from '@/components/Podium';

interface Question {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

interface ParticipantScore {
  name: string;
  score: number;
  lastAnswerTime?: number;
  position?: number;
  positionChange?: number;
}

interface AnswerSubmission {
  participantName: string;
  questionIndex: number;
  isCorrect: boolean;
  timeToAnswer: number;
}

export default function QuickQuizLive() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [participants, setParticipants] = useState<ParticipantScore[]>([]);
  const [recentAnswers, setRecentAnswers] = useState<AnswerSubmission[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timeLimitPerQuestion, setTimeLimitPerQuestion] = useState(30);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [showPodium, setShowPodium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizData();
    const cleanup = setupSocketListeners();
    return cleanup;
  }, [testId]);

  useEffect(() => {
    if (isQuizComplete || showPodium) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up for this question
          handleNextQuestion();
          return timeLimitPerQuestion;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isQuizComplete, showPodium, timeLimitPerQuestion]);

  const fetchQuizData = async () => {
    try {
      const response = await fetch(`/api/quick-quiz/${testId}`);
      if (!response.ok) throw new Error('Failed to load quiz');

      const data = await response.json();
      setQuizTitle(data.test.title);
      setQuestions(data.test.questions || []);
      setTimeLimitPerQuestion(data.test.timeLimitPerQuestion || 30);
      setTimeLeft(data.test.timeLimitPerQuestion || 30);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    try {
      // Listen for answer submissions
      const unsubscribe = subscribeToQuickQuizAnswers(testId, (message) => {
        const { participantName, questionIndex, isCorrect, score, timeToAnswer } = message;

        // Update participant scores
        setParticipants((prev) => {
          const updated = [...prev];
          const existingIndex = updated.findIndex((p) => p.name === participantName);

          if (existingIndex >= 0) {
            // Calculate position change
            const oldPosition = existingIndex + 1;
            updated[existingIndex].score = score;
            updated[existingIndex].lastAnswerTime = timeToAnswer;
            
            // Sort by score (descending) and by time (ascending for ties)
            updated.sort((a, b) => {
              if (b.score !== a.score) return b.score - a.score;
              return (a.lastAnswerTime || 0) - (b.lastAnswerTime || 0);
            });
            
            const newPosition = updated.findIndex((p) => p.name === participantName) + 1;
            updated[newPosition - 1].positionChange = oldPosition - newPosition;
          } else {
            // New participant (shouldn't happen, but handle it)
            updated.push({
              name: participantName,
              score: score,
              lastAnswerTime: timeToAnswer,
              positionChange: 0,
            });
            updated.sort((a, b) => {
              if (b.score !== a.score) return b.score - a.score;
              return (a.lastAnswerTime || 0) - (b.lastAnswerTime || 0);
            });
          }

          // Update positions
          return updated.map((p, index) => ({ ...p, position: index + 1 }));
        });

        // Add to recent answers
        setRecentAnswers((prev) => [
          { participantName, questionIndex, isCorrect, timeToAnswer },
          ...prev.slice(0, 9), // Keep last 10
        ]);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Socket.IO setup error:', error);
      return () => {};
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(timeLimitPerQuestion);
      setRecentAnswers([]);
    } else {
      // Quiz complete
      completeQuiz();
    }
  };

  const completeQuiz = async () => {
    setIsQuizComplete(true);

    // Notify all participants that the quiz has ended
    publishQuizEnded(testId, 'The host has completed this quiz.');

    try {
      await fetch(`/api/quick-quiz/${testId}/complete`, {
        method: 'POST',
      });

      // Show podium after a brief delay
      setTimeout(() => {
        setShowPodium(true);
      }, 2000);
    } catch (error) {
      console.error('Error completing quiz:', error);
      setShowPodium(true);
    }
  };

  const viewFullResults = () => {
    router.push(`/quick-quiz/${testId}/results`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (showPodium && participants.length > 0) {
    const topThree = participants.slice(0, 3).map((p, index) => ({
      name: p.name,
      score: p.score,
      percentage: Math.round((p.score / (questions.length * 1000)) * 100),
      rank: index + 1,
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <Podium winners={topThree} />
          <div className="mt-8 text-center">
            <button
              onClick={viewFullResults}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              View Full Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            {quizTitle}
          </h1>
          <p className="text-center text-gray-400">Live Quiz Monitor</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Current Question */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer Card */}
            <motion.div
              key={`timer-${currentQuestionIndex}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-orange-500/30"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <span className="text-gray-400">Time Remaining</span>
                </div>
                <motion.div
                  className={`text-4xl font-bold ${
                    timeLeft <= 10 ? 'text-red-500' : 'text-orange-400'
                  }`}
                  animate={timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
                >
                  {timeLeft}s
                </motion.div>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${
                    timeLeft <= 10
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600'
                  }`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / timeLimitPerQuestion) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </motion.div>

            {/* Current Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`question-${currentQuestionIndex}`}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-purple-900/30 to-gray-900 rounded-2xl p-8 border border-purple-500/30"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center font-bold">
                    {currentQuestionIndex + 1}
                  </div>
                  <h2 className="text-2xl font-bold flex-1">
                    {currentQuestion?.questionText}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion?.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 ${
                        option === currentQuestion.correctAnswer
                          ? 'bg-green-500/20 border-green-500'
                          : 'bg-gray-800/50 border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            option === currentQuestion.correctAnswer
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {option === currentQuestion.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={handleNextQuestion}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center gap-2 mx-auto"
                  >
                    {currentQuestionIndex < questions.length - 1
                      ? 'Next Question'
                      : 'Finish Quiz'}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Recent Answers */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Recent Answers
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {recentAnswers.map((answer, index) => (
                    <motion.div
                      key={`answer-${index}`}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className={`p-3 rounded-lg flex items-center justify-between ${
                        answer.isCorrect
                          ? 'bg-green-500/20 border border-green-500/50'
                          : 'bg-red-500/20 border border-red-500/50'
                      }`}
                    >
                      <span className="font-semibold">{answer.participantName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {(answer.timeToAnswer / 1000).toFixed(1)}s
                        </span>
                        {answer.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                            ✕
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {recentAnswers.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    Waiting for answers...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-orange-500/30 sticky top-4">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Live Leaderboard
              </h3>
              <div className="space-y-2">
                <AnimatePresence>
                  {participants.slice(0, 10).map((participant, index) => (
                    <motion.div
                      key={participant.name}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-4 rounded-xl ${
                        index === 0
                          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500'
                          : index === 1
                          ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400'
                          : index === 2
                          ? 'bg-gradient-to-r from-orange-600/20 to-orange-700/20 border border-orange-600'
                          : 'bg-gray-800/50 border border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              index === 0
                                ? 'bg-yellow-500 text-black'
                                : index === 1
                                ? 'bg-gray-400 text-black'
                                : index === 2
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span className="font-semibold truncate max-w-[120px]">
                            {participant.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-orange-400">
                            {participant.score}
                          </span>
                          {participant.positionChange && participant.positionChange > 0 && (
                            <motion.span
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              className="text-green-400 text-xs"
                            >
                              ↑{participant.positionChange}
                            </motion.span>
                          )}
                          {participant.positionChange && participant.positionChange < 0 && (
                            <motion.span
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              className="text-red-400 text-xs"
                            >
                              ↓{Math.abs(participant.positionChange)}
                            </motion.span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {participants.length === 0 && (
                  <p className="text-gray-500 text-center py-8">
                    No participants yet
                  </p>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Participants
                  </span>
                  <span className="font-bold text-white">{participants.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isQuizComplete && !showPodium && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="text-center">
              <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h2 className="text-4xl font-bold mb-2">Quiz Complete!</h2>
              <p className="text-gray-400 text-lg">Calculating final results...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
