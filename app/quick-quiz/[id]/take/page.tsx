"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, Clock, CheckCircle, XCircle, Loader2, ArrowRight, Trophy, Users, X } from "lucide-react";
import { triggerRandomCelebration } from "@/lib/celebrations";
import ShareResults from "@/components/ShareResults";
import CertificateDownload from "@/components/CertificateDownload";
import SoundToggle from "@/components/SoundToggle";
import { celebrateAllWinners } from "@/lib/podiumCelebrations";
import { playSoundEffect } from "@/lib/sounds";
import TrophyReveal from "@/components/TrophyReveal";
import Podium from "@/components/Podium";

interface Question {
  _id: string;
  questionText: string;
  options: string[];
  correctAnswer: string; // Changed from number to string (stores the actual answer text)
}

interface Test {
  _id: string;
  title: string;
  hostName?: string;
  questions: Question[];
  timeLimitPerQuestion: number;
}

export default function QuickQuizTakePage() {
  const router = useRouter();
  const params = useParams();
  const testId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<Test | null>(null);
  const [participantName, setParticipantName] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    // Get participant info from sessionStorage
    const participantData = sessionStorage.getItem('quickQuizParticipant');
    if (participantData) {
      const parsed = JSON.parse(participantData);
      setParticipantName(parsed.name);
      if (parsed.testId === testId) {
        fetchTest();
      } else {
        router.push('/quick-quiz/join');
      }
    } else {
      router.push('/quick-quiz/join');
    }
  }, [testId, router]);

  useEffect(() => {
    if (test && timeLeft > 0 && !showFeedback && quizStarted) {
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
    } else if (timeLeft === 0 && !showFeedback && test && quizStarted) {
      // Auto-submit when time runs out
      handleAnswerSubmit();
    }
  }, [timeLeft, showFeedback, test, quizStarted]);

  const fetchTest = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/quick-quiz/${testId}`);
      
      if (!response.ok) {
        throw new Error('Quiz not found');
      }

      const data = await response.json();
      setTest(data.test);
      setTimeLeft(data.test.timeLimitPerQuestion);
      setAnswers(new Array(data.test.questions.length).fill(-1));
    } catch (error) {
      console.error('Error fetching quiz:', error);
      router.push('/quick-quiz/join');
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSubmit = () => {
    if (!test) return;

    const currentQuestion = test.questions[currentQuestionIndex];
    
    // correctAnswer is stored as the text, not the index
    // So we need to find which option matches the correctAnswer text
    const correctIndex = currentQuestion.options.indexOf(currentQuestion.correctAnswer);
    const correct = selectedAnswer === correctIndex;
    
    setIsCorrect(correct);
    setShowFeedback(true);

    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = selectedAnswer ?? -1;
    setAnswers(newAnswers);

    // Update score
    if (correct) {
      setCurrentScore(currentScore + 1);
      playSoundEffect.correctAnswer();
      triggerRandomCelebration();
    } else {
      playSoundEffect.wrongAnswer();
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
      setTestComplete(true);
    }
  };

  const handleReturnHome = () => {
    sessionStorage.removeItem('quickQuizParticipant');
    router.push('/quick-quiz');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Quiz Not Found</h2>
            <p className="text-gray-600 mb-4">This quiz may have ended or been deleted.</p>
            <Button onClick={handleReturnHome}>Return to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (testComplete) {
    const percentage = Math.round((currentScore / test.questions.length) * 100);
    
    return (
      <CompletionResults
        test={test}
        participantName={participantName}
        currentScore={currentScore}
        percentage={percentage}
        onReturnHome={handleReturnHome}
      />
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <Card className="overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-8 text-center">
              <Brain className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">{test.title}</h1>
              {test.hostName && (
                <p className="text-white/90">
                  Hosted by {test.hostName}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Participant Info */}
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6 flex items-center justify-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {participantName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm text-gray-600">Participant</div>
                  <div className="font-semibold text-gray-900">{participantName}</div>
                </div>
              </div>

              {/* Quiz Details */}
              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quiz Details</h2>
                
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Total Questions</div>
                      <div className="font-semibold text-gray-900">{test.questions.length} questions</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Time per Question</div>
                      <div className="font-semibold text-gray-900">{test.timeLimitPerQuestion} seconds</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">Quiz Type</div>
                      <div className="font-semibold text-gray-900">Quick Quiz (Instant Results)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2 text-sm">Instructions:</h3>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Read each question carefully</li>
                  <li>• Select your answer before time runs out</li>
                  <li>• You'll get instant feedback after each question</li>
                  <li>• Your final score will be shown at the end</li>
                </ul>
              </div>

              <Button 
                onClick={startQuiz}
                size="lg"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg py-6"
              >
                Start Quiz
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      {/* Sound Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <SoundToggle />
      </div>

      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-4">
              <div className="text-sm font-semibold text-gray-700">
                Question {currentQuestionIndex + 1} of {test.questions.length}
              </div>
              <div className="text-sm text-gray-600">
                Score: {currentScore}/{test.questions.length}
              </div>
            </div>
            <div className="flex items-center gap-2 text-lg font-bold">
              <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-500' : 'text-purple-600'}`} />
              <span className={timeLeft <= 5 ? 'text-red-500' : 'text-purple-600'}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  {currentQuestion.questionText}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    // correctAnswer is the text, so compare option text with it
                    const isCorrectAnswer = option === currentQuestion.correctAnswer;
                    const showCorrect = showFeedback && isCorrectAnswer;
                    const showIncorrect = showFeedback && isSelected && !isCorrectAnswer;

                    return (
                      <motion.button
                        key={index}
                        onClick={() => !showFeedback && setSelectedAnswer(index)}
                        disabled={showFeedback}
                        className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                          showCorrect
                            ? 'bg-green-100 border-2 border-green-500 text-green-800'
                            : showIncorrect
                            ? 'bg-red-100 border-2 border-red-500 text-red-800'
                            : isSelected
                            ? 'bg-purple-100 border-2 border-purple-500 text-purple-800'
                            : 'bg-white border-2 border-gray-200 hover:border-purple-300 text-gray-700'
                        } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        whileHover={!showFeedback ? { scale: 1.02 } : {}}
                        whileTap={!showFeedback ? { scale: 0.98 } : {}}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showCorrect && <CheckCircle className="w-5 h-5" />}
                          {showIncorrect && <XCircle className="w-5 h-5" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <Button
                      onClick={handleNext}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      size="lg"
                    >
                      {currentQuestionIndex < test.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                )}

                {!showFeedback && (
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswer === null}
                    className="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    size="lg"
                  >
                    Submit Answer
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Separate component for completion results to avoid React hooks issues
function CompletionResults({
  test,
  participantName,
  currentScore,
  percentage,
  onReturnHome,
}: {
  test: Test;
  participantName: string;
  currentScore: number;
  percentage: number;
  onReturnHome: () => void;
}) {
  const [showTrophyReveal, setShowTrophyReveal] = useState(false);
  const [showPodium, setShowPodium] = useState(false);
  const [celebrationsTriggered, setCelebrationsTriggered] = useState(false);

  useEffect(() => {
    // Trigger celebrations only once
    if (!celebrationsTriggered) {
      if (percentage >= 80) {
        playSoundEffect.winnerFanfare();
        celebrateAllWinners();
        // Show trophy reveal for high scores
        setTimeout(() => setShowTrophyReveal(true), 500);
      } else if (percentage >= 60) {
        playSoundEffect.achievement();
        triggerRandomCelebration();
      }
      setCelebrationsTriggered(true);
    }
  }, [percentage, celebrationsTriggered]);

  // When trophy is dismissed, show podium
  const handleTrophyDismiss = () => {
    setShowTrophyReveal(false);
    setTimeout(() => setShowPodium(true), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      {/* Sound Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <SoundToggle />
      </div>

      {/* Trophy Reveal for high scores */}
      {showTrophyReveal && percentage >= 80 && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleTrophyDismiss}
        >
          <TrophyReveal
            placement={1}
            playerName={participantName}
            score={currentScore}
            onAnimationComplete={handleTrophyDismiss}
          />
        </div>
      )}

      {/* Podium Display */}
      {showPodium && percentage >= 80 && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl w-full"
          >
            <button
              onClick={() => setShowPodium(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
            <Podium
              winners={[
                {
                  name: participantName,
                  score: currentScore,
                  percentage: percentage,
                  emoji: percentage >= 95 ? "🏆" : percentage >= 90 ? "🌟" : "🎯",
                },
              ]}
            />
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto mt-20"
      >
        <Card className="text-center p-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-xl text-gray-600 mb-6">
            Great job, {participantName}!
          </p>
          
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-purple-600 mb-2">
              {currentScore}/{test.questions.length}
            </div>
            <div className="text-gray-700">
              {percentage}% Correct
            </div>
            <Progress value={percentage} className="mt-4 h-2" />
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Questions Answered:</span>
              <span className="font-semibold">{test.questions.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Correct Answers:</span>
              <span className="font-semibold text-green-600">{currentScore}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Incorrect Answers:</span>
              <span className="font-semibold text-red-600">{test.questions.length - currentScore}</span>
            </div>
          </div>

          {/* Show podium button for high scores */}
          {percentage >= 80 && (
            <Button
              onClick={() => setShowPodium(true)}
              className="w-full mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              <Trophy className="w-4 h-4 mr-2" />
              View Victory Podium
            </Button>
          )}

          {/* Share and Certificate Options */}
          <div className="space-y-4 mb-6">
            <ShareResults
              quizTitle={test.title}
              playerName={participantName}
              score={currentScore}
              totalQuestions={test.questions.length}
              percentage={percentage}
              className="justify-center"
            />
            
            {percentage >= 60 && (
              <CertificateDownload
                playerName={participantName}
                quizTitle={test.title}
                score={currentScore}
                totalQuestions={test.questions.length}
                percentage={percentage}
                className="justify-center"
              />
            )}
          </div>

          <Button onClick={onReturnHome} className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
            Back to Home
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
