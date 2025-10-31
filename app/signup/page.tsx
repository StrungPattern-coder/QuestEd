"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Brain, Mail, Lock, User, Hash, ArrowLeft, ArrowRight, Sparkles, UserCheck, GraduationCap, CheckCircle } from "lucide-react";
import ColorBends from "@/components/ColorBends";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [step, setStep] = useState(1);
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

  const handleNext = () => {
    setError("");
    
    if (step === 1 && !formData.role) {
      setError("Please select your role");
      return;
    }
    
    if (step === 2) {
      if (!formData.name.trim()) {
        setError("Please enter your name");
        return;
      }
      if (!formData.email.trim()) {
        setError("Please enter your email");
        return;
      }
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
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

  const totalSteps = formData.role === "student" ? 4 : 3;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* ColorBends Background */}
      <div className="absolute inset-0 z-0">
        <ColorBends
          colors={["#ff1a5e", "#7c3aed", "#06b6d4", "#f59e0b"]}
          rotation={45}
          speed={0.5}
          scale={0.6}
          frequency={1.8}
          warpStrength={2.0}
          mouseInfluence={1.5}
          parallax={1.0}
          noise={0.03}
        />
      </div>

      {/* Banner Image - Left Side */}
      <div className="absolute left-0 bottom-0 z-10 pointer-events-none">
        <Image
          src="/Loong_Pose02_4k.png"
          alt="Dragon Banner"
          width={350}
          height={500}
          className="object-contain w-[150px] sm:w-[200px] md:w-[250px] lg:w-[300px] xl:w-[350px] h-auto opacity-40 sm:opacity-60 lg:opacity-100"
          priority
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
        className="relative z-10 w-full max-w-md"
      >
        {/* Main Card */}
        <div className="relative backdrop-blur-md bg-white/10 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(255,162,102,0.3)] border border-white/30">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-2xl font-bold text-white">Join QuestEd</h1>
              <span className="text-sm text-white/70">Step {step}/{totalSteps}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF991C] to-[#FF8F4D]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/15 backdrop-blur-md border border-red-300/30 text-white p-3 rounded-2xl text-sm flex items-start gap-2 mb-6"
            >
              <div className="flex-shrink-0 mt-0.5">⚠️</div>
              <div>{error}</div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* Step 1: Role Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Who are you?</h2>
                    <p className="text-white/70 text-sm">Select your role to get started</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "teacher" })}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        formData.role === "teacher"
                          ? "bg-white/20 border-[#FF991C] shadow-lg shadow-[#FF991C]/30"
                          : "bg-white/5 border-white/30 hover:bg-white/10 hover:border-white/40"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${formData.role === "teacher" ? "bg-[#FF991C]" : "bg-white/10"}`}>
                          <UserCheck className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-white">Teacher</h3>
                          <p className="text-sm text-white/70">Create and manage classrooms</p>
                        </div>
                        {formData.role === "teacher" && (
                          <CheckCircle className="ml-auto h-6 w-6 text-[#FF991C]" />
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: "student" })}
                      className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                        formData.role === "student"
                          ? "bg-white/20 border-[#FF991C] shadow-lg shadow-[#FF991C]/30"
                          : "bg-white/5 border-white/30 hover:bg-white/10 hover:border-white/40"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${formData.role === "student" ? "bg-[#FF991C]" : "bg-white/10"}`}>
                          <GraduationCap className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-lg font-bold text-white">Student</h3>
                          <p className="text-sm text-white/70">Join classrooms and take tests</p>
                        </div>
                        {formData.role === "student" && (
                          <CheckCircle className="ml-auto h-6 w-6 text-[#FF991C]" />
                        )}
                      </div>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full py-3 bg-gradient-to-r from-[#FF991C] to-[#FF8F4D] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#FF991C]/30 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Basic Info */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Tell us about yourself</h2>
                    <p className="text-white/70 text-sm">We'll use this to personalize your experience</p>
                  </div>

                  <div className="space-y-4">
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
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:bg-white/10 focus:border-[#FF991C] focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>

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
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:bg-white/10 focus:border-[#FF991C] focus:outline-none transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-3 bg-white/5 border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 py-3 bg-gradient-to-r from-[#FF991C] to-[#FF8F4D] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#FF991C]/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Continue
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Student Details (Only for students) */}
              {step === 3 && formData.role === "student" && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Student Information</h2>
                    <p className="text-white/70 text-sm">Help us identify you in your classes</p>
                  </div>

                  <div className="space-y-4">
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
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:bg-white/10 focus:border-[#FF991C] focus:outline-none transition-all duration-300"
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
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:bg-white/10 focus:border-[#FF991C] focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-3 bg-white/5 border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 py-3 bg-gradient-to-r from-[#FF991C] to-[#FF8F4D] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#FF991C]/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      Continue
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Final Step: Password */}
              {((step === 3 && formData.role === "teacher") || (step === 4 && formData.role === "student")) && (
                <motion.div
                  key="stepFinal"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-white mb-2">Secure your account</h2>
                    <p className="text-white/70 text-sm">Create a strong password</p>
                  </div>

                  <div className="space-y-4">
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
                        className="w-full px-4 py-3 bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/50 focus:bg-white/10 focus:border-[#FF991C] focus:outline-none transition-all duration-300"
                        required
                        minLength={6}
                      />
                      <p className="text-xs text-white/70 mt-1">
                        Must be at least 6 characters long
                      </p>
                    </div>

                    {/* Summary */}
                    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                      <h3 className="text-sm font-semibold text-white mb-3">Account Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/70">Role:</span>
                          <span className="text-white font-medium capitalize">{formData.role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Name:</span>
                          <span className="text-white font-medium">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Email:</span>
                          <span className="text-white font-medium">{formData.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-3 bg-white/5 border border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-gradient-to-r from-[#FF991C] to-[#FF8F4D] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#FF991C]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          Create Account
                          <Sparkles className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-center text-xs text-white/60">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Sign In Link */}
          {step === 1 && (
            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-center text-sm text-white/70">
                Already have an account?{" "}
                <Link href="/login" className="text-[#FF991C] font-semibold hover:text-[#FF8F4D] transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
