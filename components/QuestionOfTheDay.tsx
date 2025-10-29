'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, TrendingUp } from 'lucide-react';
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

  useEffect(() => {
    // Check if user has already voted today
    const votedToday = localStorage.getItem('qotd_voted_date');
    const today = new Date().toDateString();
    
    if (votedToday === today) {
      setHasVoted(true);
    }

    // Check if user dismissed prompt today
    const dismissedToday = localStorage.getItem('qotd_dismissed_date');
    if (dismissedToday !== today) {
      // Show prompt after 3 seconds
      setTimeout(() => {
        if (!isOpen && votedToday !== today) {
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
        
        // Store vote in localStorage
        const today = new Date().toDateString();
        localStorage.setItem('qotd_voted_date', today);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    const today = new Date().toDateString();
    localStorage.setItem('qotd_dismissed_date', today);
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center group hover:shadow-purple-500/50 transition-all duration-300"
        title={t.qotd?.title || "Question of the Day"}
      >
        <HelpCircle className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
        
        {/* Pulse animation ring */}
        <span className="absolute inset-0 rounded-full bg-purple-500 animate-ping opacity-20"></span>
        
        {/* New badge if not voted */}
        {!hasVoted && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
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
            className="fixed bottom-24 right-6 z-40 w-72 bg-white rounded-2xl shadow-2xl p-4 border-2 border-purple-200"
          >
            <button
              onClick={dismissPrompt}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
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
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold text-sm hover:from-purple-600 hover:to-pink-600 transition-all"
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
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-6 text-white relative">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-white/80 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <HelpCircle className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">
                      {t.qotd?.title || "Question of the Day"}
                    </h2>
                  </div>
                  
                  {question && (
                    <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                      {question.category}
                    </span>
                  )}
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
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {question.optionA}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleVote('B')}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {question.optionB}
                          </motion.button>
                        </div>
                      ) : (
                        // Results
                        <div className="space-y-6">
                          <div className="text-center mb-4">
                            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
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
                              <span className="text-2xl font-bold text-blue-600">
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
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                                    : 'bg-gray-400'
                                }`}
                              />
                            </div>
                            {selectedOption === 'A' && (
                              <p className="text-sm text-blue-600 font-semibold mt-1">
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
                              <span className="text-2xl font-bold text-pink-600">
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
                                    ? 'bg-gradient-to-r from-pink-500 to-rose-500' 
                                    : 'bg-gray-400'
                                }`}
                              />
                            </div>
                            {selectedOption === 'B' && (
                              <p className="text-sm text-pink-600 font-semibold mt-1">
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
                      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">
                        {t.qotd?.loading || "Loading question..."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 text-center">
                  <p className="text-xs text-gray-500">
                    {t.qotd?.newDaily || "New question every day! Come back tomorrow."}
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
