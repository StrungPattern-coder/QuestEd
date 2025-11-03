'use client';

import { useEffect, useState } from 'react';

export default function RedirectPage() {
  const [countdown, setCountdown] = useState(5);
  
  // 🎯 UPDATE THIS URL after deploying to Render!
  const NEW_URL = 'https://quested.onrender.com'; 
  // Or use your custom domain: 'https://app.quested.com'

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = NEW_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRedirect = () => {
    window.location.href = NEW_URL;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🚀 QuestEd Has Moved!
          </h1>

          {/* Message */}
          <p className="text-gray-700 dark:text-gray-300 text-center text-lg mb-6">
            We've upgraded our platform for better performance and unlimited real-time collaboration!
          </p>

          {/* Features */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              What's New:
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Unlimited concurrent users</strong> - No more limits!</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Faster real-time updates</strong> - Instant quiz results</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Better reliability</strong> - Persistent connections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Same great features</strong> - Nothing lost!</span>
              </li>
            </ul>
          </div>

          {/* Countdown */}
          <div className="text-center mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Redirecting in <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{countdown}</span> seconds...
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${((5 - countdown) / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Manual Button */}
          <button
            onClick={handleManualRedirect}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Go to New QuestEd Platform →
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Bookmark the new URL: <br />
            <a
              href={NEW_URL}
              className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
            >
              {NEW_URL}
            </a>
          </p>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          <p>All your data has been safely migrated. Login with your existing credentials.</p>
        </div>
      </div>
    </div>
  );
}
