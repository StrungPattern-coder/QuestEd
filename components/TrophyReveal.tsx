"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Sparkles } from "lucide-react";

interface TrophyRevealProps {
  placement: 1 | 2 | 3;
  playerName: string;
  score: number;
  onAnimationComplete?: () => void;
}

export default function TrophyReveal({
  placement,
  playerName,
  score,
  onAnimationComplete,
}: TrophyRevealProps) {
  // Color schemes based on placement
  const colors = {
    1: {
      primary: "#FFD700", // Gold
      secondary: "#FFA500",
      glow: "rgba(255, 215, 0, 0.5)",
      text: "1st Place!",
      emoji: "🥇",
    },
    2: {
      primary: "#C0C0C0", // Silver
      secondary: "#E8E8E8",
      glow: "rgba(192, 192, 192, 0.5)",
      text: "2nd Place!",
      emoji: "🥈",
    },
    3: {
      primary: "#CD7F32", // Bronze
      secondary: "#E8B86D",
      glow: "rgba(205, 127, 50, 0.5)",
      text: "3rd Place!",
      emoji: "🥉",
    },
  };

  const color = colors[placement];

  // Particle positions for surrounding sparkles
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 360) / 12;
    const radius = 120;
    return {
      x: Math.cos((angle * Math.PI) / 180) * radius,
      y: Math.sin((angle * Math.PI) / 180) * radius,
      delay: 0.5 + i * 0.05,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative">
        {/* Background glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl"
          style={{ backgroundColor: color.glow }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 3, opacity: 0.6 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Surrounding particles */}
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              delay: particle.delay,
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 0.5,
            }}
          >
            <Star
              className="w-4 h-4"
              fill={color.primary}
              style={{ color: color.primary }}
            />
          </motion.div>
        ))}

        {/* Main trophy container */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-6"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          onAnimationComplete={onAnimationComplete}
        >
          {/* Trophy icon with rotation */}
          <motion.div
            className="relative"
            animate={{
              rotate: [0, 10, -10, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            {/* Shine effect behind trophy */}
            <motion.div
              className="absolute inset-0 rounded-full blur-xl"
              style={{ backgroundColor: color.primary }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />

            {/* Trophy */}
            <Trophy
              className="w-32 h-32 relative z-10"
              style={{ color: color.primary, fill: color.secondary }}
              strokeWidth={2}
            />

            {/* Sparkle on top of trophy */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <Sparkles
                className="w-8 h-8"
                style={{ color: color.primary, fill: color.primary }}
              />
            </motion.div>
          </motion.div>

          {/* Placement text */}
          <motion.div
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <span className="text-6xl" role="img" aria-label="medal">
              {color.emoji}
            </span>
            <h2
              className="text-5xl font-black tracking-tight"
              style={{ color: color.primary }}
            >
              {color.text}
            </h2>
          </motion.div>

          {/* Player info */}
          <motion.div
            className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <p className="text-2xl font-bold text-white">{playerName}</p>
            <p className="text-4xl font-black" style={{ color: color.primary }}>
              {score} points
            </p>
          </motion.div>

          {/* Continue hint */}
          <motion.p
            className="text-white/60 text-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            Tap anywhere to continue...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
