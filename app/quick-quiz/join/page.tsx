'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export default function QuickQuizJoin() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!joinCode.trim() || !participantName.trim()) {
      setError('Please enter both join code and your name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/quick-quiz/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          joinCode: joinCode.toUpperCase(),
          participantName: participantName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join quiz');
      }

      // Store participant info in sessionStorage for this quiz
      sessionStorage.setItem('quickQuizParticipant', JSON.stringify({
        name: participantName.trim(),
        testId: data.test._id,
      }));

      // Redirect to quiz waiting/taking page
      router.push(`/quick-quiz/${data.test._id}/take`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-uppercase and limit to 6 characters
    const value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, '').slice(0, 6);
    setJoinCode(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Home Link */}
        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Quick Quiz
            </h1>
            <p className="text-gray-600">
              Enter the code shared by your quiz host
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleJoin} className="space-y-6">
            {/* Join Code Input */}
            <div>
              <label htmlFor="joinCode" className="block text-sm font-medium text-gray-700 mb-2">
                Join Code
              </label>
              <input
                type="text"
                id="joinCode"
                value={joinCode}
                onChange={handleCodeInput}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors text-center text-2xl font-bold tracking-wider uppercase"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                e.g., A1B2C3
              </p>
            </div>

            {/* Participant Name Input */}
            <div>
              <label htmlFor="participantName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                id="participantName"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                maxLength={30}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || joinCode.length !== 6 || !participantName.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  Join Quiz
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Help Text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Don't have a code?{' '}
              <Link href="/quick-quiz" className="text-purple-600 hover:text-purple-700 font-semibold">
                Create your own quiz
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 text-sm mb-2">How it works:</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Get the 6-digit join code from your quiz host</li>
            <li>• Enter the code and your name above</li>
            <li>• Wait for the host to start the quiz</li>
            <li>• Answer questions and compete with others!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
