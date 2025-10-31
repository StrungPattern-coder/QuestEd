"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, Sparkles } from "lucide-react";

export default function JoinClassroomPage() {
  const router = useRouter();
  const [classroomCode, setClassroomCode] = useState("");
  const [error, setError] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!classroomCode.trim()) {
      setError("Please enter a classroom code");
      return;
    }

    // Redirect to the join classroom page with the ID
    router.push(`/join-classroom/${classroomCode.trim()}`);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#FF991C]/5 to-black"></div>

      <Link href="/dashboard/student" className="absolute top-8 left-8 z-20">
        <Button variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm group border border-white/30">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(255,162,102,0.3)] border border-white/30">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-[#FF991C] to-[#FF8F4D] rounded-full flex items-center justify-center">
              <Users className="h-10 w-10 text-black" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Join a Classroom</h1>
            <p className="text-white/70 text-sm">
              Enter the classroom code provided by your teacher
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleJoin} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/15 backdrop-blur-md border border-red-300/30 text-white p-3 rounded-2xl text-sm flex items-start gap-2"
              >
                <div className="flex-shrink-0 mt-0.5">⚠️</div>
                <div>{error}</div>
              </motion.div>
            )}

            <div className="space-y-2">
              <label htmlFor="classroomCode" className="text-sm font-semibold text-white flex items-center gap-2">
                <Users className="h-4 w-4" />
                Classroom Code
              </label>
              <Input
                id="classroomCode"
                type="text"
                placeholder="Enter code (e.g., 673a1b2c3d4e5f6g)"
                value={classroomCode}
                onChange={(e) => setClassroomCode(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:bg-white/10 focus:border-[#FF991C] focus:outline-none transition-all duration-300 text-center text-lg font-mono"
                required
              />
              <p className="text-xs text-white/60 text-center">
                Ask your teacher for the classroom code or use the invite link they sent
              </p>
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#FF991C] to-[#FF8F4D] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#FF991C]/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Join Classroom
              <Sparkles className="h-5 w-5" />
            </Button>
          </form>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-center text-sm text-white/70">
              Don't have a code?{" "}
              <span className="text-white/90">Contact your teacher for an invitation.</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
