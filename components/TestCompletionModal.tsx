"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";

interface TestCompletionModalProps {
  message: string;
  redirectCountdown?: number;
}

export default function TestCompletionModal({ 
  message, 
  redirectCountdown = 3 
}: TestCompletionModalProps) {
  const [countdown, setCountdown] = useState(redirectCountdown);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6 flex justify-center"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-6">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-4"
        >
          Test Completed!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/90 text-lg mb-6"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/20 backdrop-blur-sm rounded-xl p-4"
        >
          <div className="flex items-center justify-center gap-2 text-white">
            <Clock className="w-5 h-5" />
            <span className="text-sm">
              Redirecting to results in{" "}
              <span className="font-bold text-xl">{countdown}</span> second
              {countdown !== 1 ? "s" : ""}...
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ 
            delay: 0.6, 
            duration: redirectCountdown, 
            ease: "linear" 
          }}
          className="mt-4 h-1 bg-white/40 rounded-full origin-left"
        />
      </motion.div>
    </div>
  );
}
