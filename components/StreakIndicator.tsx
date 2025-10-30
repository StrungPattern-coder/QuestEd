'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Zap } from 'lucide-react';

interface StreakIndicatorProps {
  streak: number;
  show?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StreakIndicator({ 
  streak, 
  show = true,
  size = 'md',
  className = ''
}: StreakIndicatorProps) {
  if (streak === 0) return null;

  const sizes = {
    sm: {
      container: 'px-3 py-1.5',
      icon: 16,
      text: 'text-lg',
      label: 'text-xs',
    },
    md: {
      container: 'px-4 py-2',
      icon: 20,
      text: 'text-2xl',
      label: 'text-sm',
    },
    lg: {
      container: 'px-5 py-3',
      icon: 24,
      text: 'text-3xl',
      label: 'text-base',
    },
  };

  const config = sizes[size];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: 1,
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className={`relative inline-flex items-center gap-2 ${className}`}
        >
          {/* Glow effect */}
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-lg"
          />

          {/* Main badge */}
          <div className={`
            relative
            ${config.container}
            bg-gradient-to-r from-orange-500 to-red-500
            rounded-full
            shadow-lg
            flex items-center gap-2
          `}>
            {/* Animated flame */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Flame 
                size={config.icon} 
                className="text-yellow-300 fill-yellow-300"
              />
            </motion.div>

            {/* Streak count */}
            <span className={`${config.text} font-black text-white drop-shadow-lg`}>
              {streak}
            </span>

            {/* Label */}
            <span className={`${config.label} font-bold text-white/90 uppercase tracking-wide`}>
              Streak
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Streak Broken Animation
 * Shows when a streak is broken
 */
interface StreakBrokenAnimationProps {
  previousStreak: number;
  show: boolean;
  onComplete?: () => void;
}

export function StreakBrokenAnimation({ 
  previousStreak, 
  show, 
  onComplete 
}: StreakBrokenAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1],
          }}
          exit={{ 
            scale: 0.5,
            opacity: 0,
          }}
          transition={{
            duration: 1.5,
          }}
          onAnimationComplete={() => {
            if (onComplete) {
              setTimeout(onComplete, 800);
            }
          }}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="relative">
            {/* Smoke/fade effect */}
            <motion.div
              animate={{ 
                scale: [1, 2, 2.5],
                opacity: [0.4, 0.2, 0],
              }}
              transition={{
                duration: 1.5,
              }}
              className="absolute inset-0 bg-gray-500 rounded-full blur-2xl"
            />

            {/* Main display */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-4 border-gray-400 px-8 py-5">
              <div className="flex flex-col items-center gap-2">
                {/* Broken flame icon */}
                <motion.div
                  animate={{ 
                    x: [-5, 5, -5, 0],
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="text-5xl mb-2 opacity-50"
                >
                  💔
                </motion.div>
                
                {/* Text */}
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Streak Broken!
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Lost {previousStreak} 🔥 streak
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Keep trying!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Streak Milestone Animation
 * Shows when reaching streak milestones (5, 10, 15, etc.)
 */
interface StreakMilestoneAnimationProps {
  streak: number;
  show: boolean;
  onComplete?: () => void;
}

export function StreakMilestoneAnimation({ 
  streak, 
  show, 
  onComplete 
}: StreakMilestoneAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ 
            scale: [0, 1.3, 1],
            rotate: [-180, 0, 0],
            opacity: [0, 1, 1],
          }}
          exit={{ 
            scale: 0.8,
            opacity: 0,
          }}
          transition={{
            duration: 1,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          onAnimationComplete={() => {
            if (onComplete) {
              setTimeout(onComplete, 2000);
            }
          }}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="relative">
            {/* Multi-color glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1.3],
                opacity: [0.4, 0.7, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 rounded-full blur-3xl"
            />

            {/* Main display */}
            <div className="relative bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl shadow-2xl px-10 py-6">
              <div className="flex flex-col items-center gap-3">
                {/* Animated flames */}
                <div className="flex items-center gap-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        scale: [1, 1.2, 1],
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 0.6,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      className="text-5xl"
                    >
                      🔥
                    </motion.div>
                  ))}
                </div>
                
                {/* Text */}
                <div className="text-center text-white">
                  <h3 className="text-4xl font-black mb-1 drop-shadow-lg">
                    {streak} STREAK!
                  </h3>
                  <p className="text-xl font-bold opacity-90">
                    You're on fire! 🔥
                  </p>
                  <p className="text-sm opacity-75 mt-1">
                    Amazing consistency!
                  </p>
                </div>
              </div>
            </div>

            {/* Particle effects */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: [0, Math.cos((i * Math.PI * 2) / 12) * 150],
                  y: [0, Math.sin((i * Math.PI * 2) / 12) * 150],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1.5,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-red-400"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
