'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, TrendingUp, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface QOTDData {
  _id: string;
  question: string;
  optionA: string;
  optionB: string;
  votesA: number;
  votesB: number;
  category: string;
}

interface VoteResults {
  votesA: number;
  votesB: number;
  percentageA: number;
  percentageB: number;
  totalVotes: number;
}

export default function QuestionOfTheDay() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [question, setQuestion] = useState<QOTDData | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [results, setResults] = useState<VoteResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  // Get next midnight in IST
  const getNextMidnightIST = () => {
    // Create date in IST timezone
    const nowUTC = new Date();
    
    // Get IST time by adding 5 hours 30 minutes
    const istDate = new Date(nowUTC.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    // Set to next midnight IST
    const nextMidnightIST = new Date(istDate);
    nextMidnightIST.setHours(24, 0, 0, 0);
    
    // Return the Date object for next midnight
    return nextMidnightIST;
  };

  // Format time remaining
  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return '0h 0m 0s';
    
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const nextMidnight = getNextMidnightIST();
      const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      const diff = nextMidnight.getTime() - nowIST.getTime();
      
      if (diff <= 0) {
        // Time to refresh! Clear voted status and fetch new question
        localStorage.removeItem('qotd_voted_date');
        localStorage.removeItem('qotd_dismissed_date');
        setHasVoted(false);
        setSelectedOption(null);
        setResults(null);
        fetchQuestion();
        setTimeRemaining('Refreshing...');
      } else {
        setTimeRemaining(formatTimeRemaining(diff));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if user has already voted today (IST timezone)
    const votedDate = localStorage.getItem('qotd_voted_date');
    const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const todayIST = nowIST.toISOString().split('T')[0]; // YYYY-MM-DD in IST
    
    if (votedDate === todayIST) {
      setHasVoted(true);
    }

    // Check if user dismissed prompt today
    const dismissedDate = localStorage.getItem('qotd_dismissed_date');
    if (dismissedDate !== todayIST) {
      // Show prompt after 3 seconds
      setTimeout(() => {
        if (!isOpen && votedDate !== todayIST) {
          setShowPrompt(true);
        }
      }, 3000);
    }

    // Fetch question
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      const response = await fetch('/api/qotd');
      const data = await response.json();
      if (data.question) {
        setQuestion(data.question);
      }
    } catch (error) {
      console.error('Failed to fetch QOTD:', error);
    }
  };

  const handleVote = async (option: 'A' | 'B') => {
    if (!question || hasVoted) return;

    setIsLoading(true);
    setSelectedOption(option);

    try {
      const response = await fetch('/api/qotd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question._id,
          vote: option,
        }),
      });

      const data = await response.json();
      if (data.results) {
        setResults(data.results);
        setHasVoted(true);
        
        // Store vote with IST date
        const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
        const todayIST = nowIST.toISOString().split('T')[0];
        localStorage.setItem('qotd_voted_date', todayIST);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const todayIST = nowIST.toISOString().split('T')[0];
    localStorage.setItem('qotd_dismissed_date', todayIST);
  };

  const openModal = () => {
    setIsOpen(true);
    setShowPrompt(false);
  };

  return (
    <>
      {/* Floating Question Mark Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={openModal}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center group hover:shadow-[#FF991C]/50 transition-all duration-300 bg-gradient-to-br from-[#FF991C] via-[#FF8F4D] to-[#FFB84D]"
        title={t.qotd?.title || "Question of the Day"}
      >
        <HelpCircle className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
        
        {/* Pulse animation ring */}
        <span className="absolute inset-0 rounded-full bg-[#FF991C] animate-ping opacity-20"></span>
        
        {/* New badge if not voted */}
        {!hasVoted && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce">
            <span className="text-white text-xs font-bold">!</span>
          </span>
        )}
        
        {/* Timer badge */}
        {timeRemaining && timeRemaining !== 'Refreshing...' && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-[#FF991C] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap">
            <Clock className="w-2.5 h-2.5 inline mr-0.5" />
            {timeRemaining.split(' ')[0]} {/* Show only hours */}
          </span>
        )}
      </motion.button>

      {/* Prompt popup */}
      <AnimatePresence>
        {showPrompt && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-40 w-72 bg-white rounded-2xl shadow-2xl p-4 border-2 border-[#FF991C]/30"
          >
            <button
              onClick={dismissPrompt}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF991C] to-[#FF8F4D] rounded-full flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">
                  {t.qotd?.promptTitle || "Question of the Day!"}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {t.qotd?.promptText || "Answer today's fun question and see what everyone thinks!"}
                </p>
                <button
                  onClick={openModal}
                  className="w-full bg-gradient-to-r from-[#FF991C] to-[#FF8F4D] hover:from-[#FF8F4D] hover:to-[#FF991C] text-white py-2 rounded-lg font-semibold text-sm transition-all"
                >
                  {t.qotd?.answerNow || "Answer Now!"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                {/* Header with Orange Theme */}
                <div className="bg-gradient-to-r from-[#FF991C] via-[#FF8F4D] to-[#FFB84D] p-6 text-white relative">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-white/80 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <HelpCircle className="w-8 h-8" />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold">
                        {t.qotd?.title || "Question of the Day"}
                      </h2>
                      {question && (
                        <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium mt-1">
                          {question.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Single Amazing Countdown Timer */}
                  <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span className="text-sm font-semibold">Next Question In:</span>
                      </div>
                      <span className="text-2xl font-black tracking-wider">
                        {timeRemaining}
                      </span>
                    </div>
                    
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-white shadow-lg"
                        style={{
                          width: `${Math.max(0, Math.min(100, ((24 * 60 * 60 * 1000 - (getNextMidnightIST().getTime() - new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).getTime())) / (24 * 60 * 60 * 1000)) * 100))}%`
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-white/80 mt-2 text-center">
                      Resets daily at 12:00 AM IST
                    </p>
                  </div>
                </div>

                {/* Question & Voting */}
                <div className="p-6">
                  {question ? (
                    <>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        {question.question}
                      </h3>

                      {!hasVoted ? (
                        // Voting options
                        <div className="space-y-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleVote('A')}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#FF991C] to-[#FF8F4D] hover:from-[#FF8F4D] hover:to-[#FFB84D] text-white py-4 rounded-xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {question.optionA}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleVote('B')}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#FFB84D] to-[#FF991C] hover:from-[#FF991C] hover:to-[#FF8F4D] text-white py-4 rounded-xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {question.optionB}
                          </motion.button>
                        </div>
                      ) : (
                        // Results
                        <div className="space-y-6">
                          <div className="text-center mb-4">
                            <TrendingUp className="w-8 h-8 text-[#FF991C] mx-auto mb-2" />
                            <p className="text-gray-600">
                              {t.qotd?.resultsText || "Here's what the community thinks!"}
                            </p>
                          </div>

                          {/* Option A Result */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-gray-900">
                                {question.optionA}
                              </span>
                              <span className="text-2xl font-bold text-[#FF991C]">
                                {results?.percentageA || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${results?.percentageA || 0}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${
                                  selectedOption === 'A' 
                                    ? 'bg-gradient-to-r from-[#FF991C] to-[#FF8F4D]' 
                                    : 'bg-gray-400'
                                }`}
                              />
                            </div>
                            {selectedOption === 'A' && (
                              <p className="text-sm text-[#FF991C] font-semibold mt-1">
                                ← {t.qotd?.yourChoice || "Your choice"}
                              </p>
                            )}
                          </div>

                          {/* Option B Result */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold text-gray-900">
                                {question.optionB}
                              </span>
                              <span className="text-2xl font-bold text-[#FFB84D]">
                                {results?.percentageB || 0}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${results?.percentageB || 0}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className={`h-full rounded-full ${
                                  selectedOption === 'B' 
                                    ? 'bg-gradient-to-r from-[#FFB84D] to-[#FF991C]' 
                                    : 'bg-gray-400'
                                }`}
                              />
                            </div>
                            {selectedOption === 'B' && (
                              <p className="text-sm text-[#FFB84D] font-semibold mt-1">
                                ← {t.qotd?.yourChoice || "Your choice"}
                              </p>
                            )}
                          </div>

                          {/* Total votes */}
                          <div className="text-center pt-4 border-t border-gray-200">
                            <p className="text-gray-600 text-sm">
                              {results?.totalVotes || 0} {t.qotd?.totalVotes || "total votes"}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 border-4 border-[#FF991C] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">
                        {t.qotd?.loading || "Loading question..."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer - Simple and Clean */}
                <div className="bg-gradient-to-r from-[#FF991C]/10 to-[#FFB84D]/10 px-6 py-4 text-center border-t border-[#FF991C]/20">
                  <p className="text-sm text-gray-600 font-medium">
                    ✨ {t.qotd?.newDaily || "Come back tomorrow for a new question!"}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
