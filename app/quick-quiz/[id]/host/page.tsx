'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Copy, Users, Play, Trophy, X } from 'lucide-react';
import { getAblyClient } from '@/lib/ably';

interface Participant {
  name: string;
  joinedAt: Date;
}

export default function QuickQuizHost() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;
  
  const [joinCode, setJoinCode] = useState('');
  const [quizTitle, setQuizTitle] = useState('');
  const [hostName, setHostName] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get join code from URL query
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    if (code) {
      setJoinCode(code);
    }

    // Fetch test details
    fetchTestDetails();

    // Subscribe to participant joins via Ably
    const ably = getAblyClient();
    const channel = ably.channels.get(`quick-quiz-${testId}`);
    
    channel.subscribe('participant-joined', (message: any) => {
      const { participantName } = message.data;
      setParticipants((prev) => {
        // Avoid duplicates
        if (prev.some(p => p.name === participantName)) {
          return prev;
        }
        return [...prev, { name: participantName, joinedAt: new Date() }];
      });
    });

    // Cleanup
    return () => {
      channel.unsubscribe('participant-joined');
    };
  }, [testId]);

  const fetchTestDetails = async () => {
    try {
      const response = await fetch(`/api/quick-quiz/${testId}`);
      if (!response.ok) throw new Error('Failed to load quiz');
      
      const data = await response.json();
      setQuizTitle(data.test.title);
      setHostName(data.test.hostName || 'Anonymous');
      setJoinCode(data.test.joinCode);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const copyJoinCode = () => {
    navigator.clipboard.writeText(joinCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const startQuiz = async () => {
    if (participants.length === 0) {
      alert('Wait for at least one participant to join!');
      return;
    }

    try {
      const response = await fetch(`/api/quick-quiz/${testId}/start`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to start quiz');
      
      setIsStarted(true);
      // Redirect to live quiz page
      router.push(`/quick-quiz/${testId}/live`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const cancelQuiz = () => {
    if (confirm('Are you sure you want to cancel this quiz?')) {
      router.push('/');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {quizTitle}
              </h1>
              <p className="text-gray-600">Hosted by {hostName}</p>
            </div>
            <button
              onClick={cancelQuiz}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Cancel Quiz"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Join Code Display */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-8 text-center">
            <p className="text-white/90 text-sm md:text-base mb-2">Join Code</p>
            <div className="flex items-center justify-center gap-4">
              <motion.div
                className="text-5xl md:text-7xl font-bold text-white tracking-wider"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {joinCode || '------'}
              </motion.div>
              <button
                onClick={copyJoinCode}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-lg transition-colors"
                title="Copy Join Code"
              >
                <Copy className="w-6 h-6 text-white" />
              </button>
            </div>
            {copySuccess && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white/90 text-sm mt-2"
              >
                ✓ Copied to clipboard!
              </motion.p>
            )}
            <p className="text-white/80 text-sm mt-4">
              Share this code with participants to join at{' '}
              <span className="font-semibold">
                {typeof window !== 'undefined' ? window.location.origin : ''}/quick-quiz/join
              </span>
            </p>
          </div>
        </div>

        {/* Participants Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Waiting Room
              </h2>
              <p className="text-gray-600">
                {participants.length} participant{participants.length !== 1 ? 's' : ''} joined
              </p>
            </div>
          </div>

          {participants.length === 0 ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Users className="w-8 h-8 text-gray-400" />
              </motion.div>
              <p className="text-gray-500">Waiting for participants to join...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {participants.map((participant, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">
                    {participant.name.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-semibold text-gray-900 truncate">
                    {participant.name}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={startQuiz}
            disabled={participants.length === 0 || isStarted}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            Start Quiz
          </button>
          
          <button
            onClick={() => router.push(`/quick-quiz/${testId}/results`)}
            className="sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Trophy className="w-5 h-5" />
            View Results
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Share the join code with your participants</li>
            <li>Wait for participants to join (they'll appear above)</li>
            <li>Click "Start Quiz" when everyone is ready</li>
            <li>Monitor live results during the quiz</li>
            <li>View final leaderboard when quiz completes</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
