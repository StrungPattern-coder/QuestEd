'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface ScoreAnimationProps {
  points: number;
  show: boolean;
  onComplete?: () => void;
  position?: 'center' | 'top' | 'bottom';
  color?: 'green' | 'gold' | 'purple' | 'blue';
}

export default function ScoreAnimation({ 
  points, 
  show, 
  onComplete,
  position = 'center',
  color = 'green'
}: ScoreAnimationProps) {
  const colorClasses = {
    green: 'from-green-400 to-emerald-600',
    gold: 'from-yellow-400 to-amber-600',
    purple: 'from-purple-400 to-fuchsia-600',
    blue: 'from-blue-400 to-cyan-600',
  };

  const colorText = {
    green: 'text-green-600',
    gold: 'text-yellow-600',
    purple: 'text-purple-600',
    blue: 'text-blue-600',
  };

  const positions = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    top: 'top-20 left-1/2 -translate-x-1/2',
    bottom: 'bottom-20 left-1/2 -translate-x-1/2',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ 
            scale: 0,
            opacity: 0,
            y: 20,
          }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1],
            y: [20, 0, -30],
          }}
          exit={{ 
            scale: 0.8,
            opacity: 0,
            y: -60,
          }}
          transition={{
            duration: 1.5,
            times: [0, 0.3, 0.6],
            ease: [0.34, 1.56, 0.64, 1],
          }}
          onAnimationComplete={() => {
            if (onComplete) {
              setTimeout(onComplete, 300);
            }
          }}
          className={`
            fixed ${positions[position]} z-50
            pointer-events-none
          `}
        >
          <div className="relative">
            {/* Glow effect */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.5, 1.8],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                ease: "easeOut",
              }}
              className={`
                absolute inset-0
                rounded-full blur-2xl
                bg-gradient-to-r ${colorClasses[color]}
              `}
            />

            {/* Main score display */}
            <div className={`
              relative
              px-8 py-4
              bg-white dark:bg-gray-800
              rounded-2xl shadow-2xl
              border-4 border-${color}-400
              flex items-center gap-3
            `}>
              <TrendingUp 
                className={`${colorText[color]} w-8 h-8`}
                strokeWidth={3}
              />
              <span className={`
                text-5xl font-black
                ${colorText[color]}
                drop-shadow-lg
              `}>
                +{points}
              </span>
              <span className={`
                text-2xl font-bold
                ${colorText[color]}
                opacity-80
              `}>
                pts!
              </span>
            </div>

            {/* Sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1,
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  x: [
                    0, 
                    Math.cos((i * Math.PI * 2) / 8) * 100,
                  ],
                  y: [
                    0, 
                    Math.sin((i * Math.PI * 2) / 8) * 100,
                  ],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 1,
                  delay: 0.3,
                  ease: "easeOut",
                }}
                className={`
                  absolute top-1/2 left-1/2
                  w-3 h-3
                  rounded-full
                  bg-gradient-to-r ${colorClasses[color]}
                `}
                style={{
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Streak Score Animation - Special animation for streak bonuses
 */
interface StreakScoreAnimationProps {
  streak: number;
  points: number;
  show: boolean;
  onComplete?: () => void;
}

export function StreakScoreAnimation({
  streak,
  points,
  show,
  onComplete,
}: StreakScoreAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.1, 1],
            opacity: [0, 1, 1],
            y: [0, -20],
          }}
          exit={{ scale: 0.5, opacity: 0, y: -40 }}
          transition={{
            duration: 1.8,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          onAnimationComplete={() => {
            if (onComplete) {
              setTimeout(onComplete, 400);
            }
          }}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="relative">
            {/* Fire glow */}
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1.1],
                opacity: [0.3, 0.6, 0.4],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-3xl"
            />

            {/* Main display */}
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-4 border-orange-500 px-8 py-5">
              <div className="flex flex-col items-center gap-2">
                {/* Fire emoji and streak count */}
                <div className="flex items-center gap-2 mb-1">
                  <motion.span 
                    className="text-5xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, -10, 10, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    🔥
                  </motion.span>
                  <span className="text-4xl font-black text-orange-600">
                    {streak}
                  </span>
                  <span className="text-2xl font-bold text-orange-600">
                    STREAK!
                  </span>
                </div>
                
                {/* Bonus points */}
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-amber-600">
                    +{points} BONUS
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
