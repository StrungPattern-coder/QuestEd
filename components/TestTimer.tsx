"use client";

import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TestTimerProps {
  totalTimeInSeconds: number;
  onTimeUp: () => void;
  paused?: boolean;
}

export default function TestTimer({ totalTimeInSeconds, onTimeUp, paused = false }: TestTimerProps) {
  const [timeLeft, setTimeLeft] = useState(totalTimeInSeconds);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [paused, onTimeUp]);

  useEffect(() => {
    // Show warning when less than 5 minutes (300 seconds) remain
    if (timeLeft <= 300 && timeLeft > 0 && !showWarning) {
      setShowWarning(true);
    } else if (timeLeft > 300) {
      setShowWarning(false);
    }
  }, [timeLeft, showWarning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / totalTimeInSeconds) * 100;
  const isLowTime = timeLeft <= 300; // 5 minutes
  const isCritical = timeLeft <= 60; // 1 minute

  return (
    <motion.div
      className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50 
        px-6 py-3 rounded-full shadow-2xl
        border-2 transition-all duration-300
        ${isCritical 
          ? 'bg-red-500 border-red-600 animate-pulse' 
          : isLowTime 
          ? 'bg-orange-500 border-orange-600' 
          : 'bg-blue-500 border-blue-600'
        }
      `}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="flex items-center gap-3">
        {isLowTime && (
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            <AlertTriangle className="w-5 h-5 text-white" />
          </motion.div>
        )}
        
        <Clock className="w-5 h-5 text-white" />
        
        <div className="flex flex-col">
          <div className="text-white font-bold text-lg leading-none">
            {formatTime(timeLeft)}
          </div>
          <div className="text-white/80 text-xs">
            {isLowTime ? 'Time running out!' : 'Time remaining'}
          </div>
        </div>

        {/* Progress circle */}
        <div className="w-10 h-10 relative">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
              fill="none"
            />
            <circle
              cx="20"
              cy="20"
              r="16"
              stroke="white"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 16}`}
              strokeDashoffset={`${2 * Math.PI * 16 * (1 - percentage / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
        </div>
      </div>

      {/* Warning popup */}
      <AnimatePresence>
        {showWarning && timeLeft === 300 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm"
          >
            ⚠️ 5 minutes remaining!
          </motion.div>
        )}
        
        {isCritical && timeLeft === 60 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-bold"
          >
            🚨 1 minute left!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
