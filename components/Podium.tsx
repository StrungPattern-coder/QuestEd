"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Award, Crown, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface PodiumPlayer {
  name: string;
  score: number;
  percentage: number;
  avatar?: string;
  emoji?: string;
}

interface PodiumProps {
  winners: PodiumPlayer[];
  onAnimationComplete?: () => void;
}

export default function Podium({ winners, onAnimationComplete }: PodiumProps) {
  const [showPodium, setShowPodium] = useState(false);

  useEffect(() => {
    // Delay podium reveal for dramatic effect
    const timer = setTimeout(() => setShowPodium(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showPodium && onAnimationComplete) {
      // Call completion callback after all animations
      const timer = setTimeout(onAnimationComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [showPodium, onAnimationComplete]);

  // Ensure we have exactly 3 positions (fill with empty if needed)
  const podiumData = [
    winners[1] || null, // 2nd place (left)
    winners[0] || null, // 1st place (center, tallest)
    winners[2] || null, // 3rd place (right)
  ];

  const heights = ["h-48", "h-64", "h-40"]; // 2nd, 1st, 3rd heights
  const positions = ["2nd", "1st", "3rd"];
  const colors = [
    "from-gray-400 to-gray-500", // Silver
    "from-yellow-400 to-yellow-600", // Gold
    "from-orange-400 to-orange-600", // Bronze
  ];
  const icons = [Medal, Crown, Award];

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12">
      {/* Podium Stage */}
      <div className="relative flex items-end justify-center gap-4 mb-8">
        {podiumData.map((player, index) => {
          const Icon = icons[index];
          const position = positions[index];
          const height = heights[index];
          const color = colors[index];
          const delay = index === 1 ? 0.5 : index === 0 ? 0.8 : 1.1; // Center first

          return (
            <motion.div
              key={index}
              initial={{ y: 200, opacity: 0 }}
              animate={showPodium ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.6,
                delay,
                type: "spring",
                stiffness: 100,
              }}
              className="relative flex flex-col items-center"
            >
              {player ? (
                <>
                  {/* Player Info Above Podium */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={showPodium ? { scale: 1 } : {}}
                    transition={{
                      duration: 0.4,
                      delay: delay + 0.3,
                      type: "spring",
                    }}
                    className="mb-4 text-center"
                  >
                    {/* Avatar/Emoji */}
                    <div className={`w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                      {player.emoji || player.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Icon for position */}
                    <motion.div
                      initial={{ rotate: 0, scale: 1 }}
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 0.6,
                        delay: delay + 0.5,
                        repeat: 2,
                      }}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${
                        index === 1 ? "text-yellow-400" : 
                        index === 0 ? "text-gray-400" : 
                        "text-orange-400"
                      }`} />
                    </motion.div>

                    {/* Player Name */}
                    <div className="font-bold text-gray-900 text-sm truncate max-w-[100px]">
                      {player.name}
                    </div>

                    {/* Score */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: delay + 0.6,
                      }}
                      className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                    >
                      {player.score}
                    </motion.div>

                    {/* Percentage */}
                    <div className="text-xs text-gray-600">
                      {player.percentage}%
                    </div>
                  </motion.div>

                  {/* Podium Block */}
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={showPodium ? { scaleY: 1 } : {}}
                    transition={{
                      duration: 0.5,
                      delay,
                      ease: "easeOut",
                    }}
                    className={`w-32 ${height} bg-gradient-to-b ${color} rounded-t-xl shadow-2xl flex flex-col items-center justify-center relative overflow-hidden origin-bottom`}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>

                    {/* Position Number */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: delay + 0.4,
                        type: "spring",
                      }}
                      className="text-white text-6xl font-bold drop-shadow-lg"
                    >
                      {position}
                    </motion.div>
                  </motion.div>
                </>
              ) : (
                // Empty slot
                <div className={`w-32 ${height} bg-gray-200 rounded-t-xl opacity-30`}>
                  <div className="flex items-center justify-center h-full text-gray-400 text-4xl font-bold">
                    -
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Sparkle effects around winner */}
      {showPodium && winners[0] && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                x: [0, Math.cos(i * 45 * (Math.PI / 180)) * 100],
                y: [0, Math.sin(i * 45 * (Math.PI / 180)) * 100],
              }}
              transition={{
                duration: 1.5,
                delay: 2 + i * 0.1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="absolute top-1/3 left-1/2 transform -translate-x-1/2"
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
