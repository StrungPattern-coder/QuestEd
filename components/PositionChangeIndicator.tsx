'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PositionChangeIndicatorProps {
  change: number; // Positive for up, negative for down
  show: boolean;
  onComplete?: () => void;
  duration?: number;
}

export default function PositionChangeIndicator({ 
  change, 
  show, 
  onComplete,
  duration = 2000
}: PositionChangeIndicatorProps) {
  if (change === 0) return null;

  const isUp = change > 0;
  const Icon = isUp ? TrendingUp : TrendingDown;
  const color = isUp ? 'green' : 'red';
  const bgColor = isUp ? 'bg-green-500' : 'bg-red-500';
  const textColor = isUp ? 'text-green-700' : 'text-red-700';
  const borderColor = isUp ? 'border-green-400' : 'border-red-400';

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ 
            scale: 0,
            opacity: 0,
            x: isUp ? -30 : 30,
          }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1, 0.8, 0],
            x: [isUp ? -30 : 30, 0, 0, 0, isUp ? 10 : -10],
          }}
          exit={{ 
            scale: 0.8,
            opacity: 0,
          }}
          transition={{
            duration: duration / 1000,
            times: [0, 0.2, 0.4, 0.8, 1],
            ease: "easeOut",
          }}
          onAnimationComplete={() => {
            if (onComplete) {
              setTimeout(onComplete, 100);
            }
          }}
          className="fixed top-24 right-8 z-50 pointer-events-none"
        >
          <div className="relative">
            {/* Glow effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.4, 1.2],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className={`absolute inset-0 ${bgColor} rounded-full blur-xl opacity-40`}
            />

            {/* Main indicator */}
            <div className={`
              relative
              px-5 py-3
              bg-white dark:bg-gray-800
              rounded-xl shadow-2xl
              border-3 ${borderColor}
              flex items-center gap-2
            `}>
              <motion.div
                animate={{ 
                  y: isUp ? [-3, 3] : [3, -3],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Icon 
                  className={`${textColor} w-6 h-6`}
                  strokeWidth={3}
                />
              </motion.div>
              
              <span className={`text-2xl font-black ${textColor}`}>
                {isUp ? '↑' : '↓'}{Math.abs(change)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Leaderboard Position Badge
 * Shows current position with animated indicator
 */
interface PositionBadgeProps {
  position: number;
  previousPosition?: number;
  totalPlayers: number;
  className?: string;
}

export function PositionBadge({ 
  position, 
  previousPosition, 
  totalPlayers,
  className = ''
}: PositionBadgeProps) {
  const change = previousPosition ? previousPosition - position : 0;
  const hasChanged = change !== 0;

  // Medal colors for top 3
  const getMedalColor = (pos: number) => {
    switch (pos) {
      case 1: return 'from-yellow-400 to-amber-500';
      case 2: return 'from-gray-300 to-gray-400';
      case 3: return 'from-orange-400 to-orange-500';
      default: return 'from-purple-400 to-blue-500';
    }
  };

  const getMedalEmoji = (pos: number) => {
    switch (pos) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <motion.div
        initial={{ scale: 1 }}
        animate={{ 
          scale: hasChanged ? [1, 1.2, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className={`
          relative
          px-4 py-2
          bg-gradient-to-r ${getMedalColor(position)}
          rounded-full
          shadow-lg
          flex items-center gap-2
        `}
      >
        {/* Medal emoji for top 3 */}
        {position <= 3 && (
          <motion.span
            initial={{ rotate: 0 }}
            animate={{ rotate: hasChanged ? [0, -15, 15, 0] : 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl"
          >
            {getMedalEmoji(position)}
          </motion.span>
        )}

        {/* Position number */}
        <span className="text-xl font-black text-white drop-shadow-lg">
          #{position}
        </span>

        {/* Total players */}
        <span className="text-sm font-semibold text-white/80">
          / {totalPlayers}
        </span>
      </motion.div>

      {/* Change indicator (small) */}
      {hasChanged && (
        <motion.div
          initial={{ scale: 0, x: -10 }}
          animate={{ scale: 1, x: 0 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3 }}
          className={`
            absolute -top-2 -right-2
            w-7 h-7
            rounded-full
            ${change > 0 ? 'bg-green-500' : 'bg-red-500'}
            flex items-center justify-center
            shadow-lg
            z-10
          `}
        >
          <span className="text-white font-bold text-xs">
            {change > 0 ? '↑' : '↓'}{Math.abs(change)}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Rank-up animation - Special full-screen animation for major improvements
 */
interface RankUpAnimationProps {
  newRank: number;
  show: boolean;
  onComplete?: () => void;
}

export function RankUpAnimation({ 
  newRank, 
  show, 
  onComplete 
}: RankUpAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={onComplete}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [180, 0, 0],
            }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              duration: 0.8,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            onAnimationComplete={() => {
              if (onComplete) {
                setTimeout(onComplete, 1500);
              }
            }}
            className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl shadow-2xl p-12 text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <TrendingUp className="w-20 h-20 text-white mx-auto mb-4" strokeWidth={3} />
            </motion.div>
            
            <h2 className="text-5xl font-black text-white mb-2">
              RANK UP!
            </h2>
            
            <p className="text-3xl font-bold text-white/90 mb-4">
              You're now #{newRank}!
            </p>
            
            <p className="text-lg text-white/70">
              Keep up the great work! 🎉
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
