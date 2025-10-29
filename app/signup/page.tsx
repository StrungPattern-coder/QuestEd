"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Brain, Mail, Lock, User, Hash, ArrowLeft, Sparkles, UserCheck, GraduationCap } from "lucide-react";
import ColorBends from "@/components/ColorBends";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "" as "teacher" | "student" | "",
    enrollmentNumber: "",
    rollNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.role) {
      setError("Please select whether you are a teacher or student");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.signup(formData);

      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.data) {
        const data = response.data as any;
        login(data.user, data.token);

        if (data.user.role === "teacher") {
          router.push("/dashboard/teacher");
        } else {
          router.push("/dashboard/student");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* ColorBends Background */}
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={30}
          speed={0.3}
          scale={1.2}
          frequency={1.4}
          warpStrength={1.2}
          mouseInfluence={0.8}
          parallax={0.6}
          noise={0.08}
          transparent
        />
      </div>

      <Link href="/" className="absolute top-8 left-8 z-20">
        <Button variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm group border border-white/30">
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm scale-90"
      >
        {/* Liquid Glass Card */}
        <div className="relative backdrop-blur-md bg-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(255,162,102,0.3)] border border-white/30">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              Join QuestEd
            </h1>
            <p className="text-white/90 text-sm">
              Start your interactive learning journey today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-white flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Sriram Kommalapudi"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:bg-white/10 focus:border-white/50 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-white flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:bg-white/10 focus:border-white/50 focus:outline-none transition-all duration-300"
                required
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "teacher" })}
                  className={`py-3 px-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    formData.role === "teacher"
                      ? "bg-white/20 border-white/60 text-white"
                      : "bg-white/5 border-white/30 text-white/70 hover:bg-white/10 hover:border-white/40"
                  }`}
                >
                  <UserCheck className="h-5 w-5" />
                  <span className="text-sm font-semibold">Teacher</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "student" })}
                  className={`py-3 px-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
                    formData.role === "student"
                      ? "bg-white/20 border-white/60 text-white"
                      : "bg-white/5 border-white/30 text-white/70 hover:bg-white/10 hover:border-white/40"
                  }`}
                >
                  <GraduationCap className="h-5 w-5" />
                  <span className="text-sm font-semibold">Student</span>
                </button>
              </div>
            </div>

            {/* Student Fields */}
            {formData.role === "student" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="enrollmentNumber" className="text-sm font-semibold text-white flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Enrollment Number
                  </label>
                  <input
                    id="enrollmentNumber"
                    type="text"
                    placeholder="e.g., C2K231265"
                    value={formData.enrollmentNumber}
                    onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:bg-white/10 focus:border-white/50 focus:outline-none transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="rollNumber" className="text-sm font-semibold text-white flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Roll Number <span className="text-xs text-white/70 font-normal">(Optional)</span>
                  </label>
                  <input
                    id="rollNumber"
                    type="text"
                    placeholder="e.g., 31281"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:bg-white/10 focus:border-white/50 focus:outline-none transition-all duration-300"
                  />
                </div>
              </motion.div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-white flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:bg-white/10 focus:border-white/50 focus:outline-none transition-all duration-300"
                required
                minLength={6}
              />
              <p className="text-xs text-white/80 mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-white/30 to-white/15 backdrop-blur-md border border-white/30 text-white font-bold text-base rounded-2xl shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:from-white/50 hover:to-white/30 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  Create Account
                  <Sparkles className="ml-2 h-5 w-5" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/5 backdrop-blur-md text-white/90 rounded-full">Already have an account?</span>
            </div>
          </div>

          {/* Sign In Link */}
          <Link href="/login">
            <button className="w-full py-2.5 bg-white/5 backdrop-blur-md border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/15 hover:border-white/50 transition-all duration-300">
              Sign In Instead
            </button>
          </Link>

          {/* Terms */}
          <p className="mt-5 text-center text-xs text-white/70">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
