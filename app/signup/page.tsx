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

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    enrollmentNumber: "",
    rollNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isStudent = formData.email.endsWith("@ms.pict.edu");
  const isTeacher = formData.email.endsWith("@pict.edu");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
      <Link href="/" className="absolute top-8 left-8 z-20">
        <Button variant="ghost" className="text-[#F5F5F5] hover:bg-white/10 group">
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
        <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FFA266]/20 shadow-2xl">
          <CardHeader className="space-y-3 text-center pb-8">
            <div className="mx-auto bg-[#FFA266] p-3 rounded-2xl w-fit">
              <Brain className="h-8 w-8 text-black" />
            </div>
            <CardTitle className="text-4xl font-bold text-black">
              Join QuestEd
            </CardTitle>
            <CardDescription className="text-base text-black/70">
              Start your interactive learning journey today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm flex items-start gap-2"
                >
                  <div className="flex-shrink-0 mt-0.5">⚠️</div>
                  <div>{error}</div>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-black flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Sriram Kommalapudi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 border-gray-300 focus:border-[#FFA266] focus:ring-[#FFA266]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-black flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@pict.edu or enrollmentNumber@ms.pict.edu"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 border-gray-300 focus:border-[#FFA266] focus:ring-[#FFA266]"
                  required
                />
                <div className="flex items-center gap-2 mt-2">
                  {isTeacher && (
                    <div className="flex items-center gap-1.5 text-xs bg-[#FFA266]/20 text-black px-3 py-1.5 rounded-full border border-[#FFA266]/30">
                      <UserCheck className="h-3 w-3" />
                      Teacher Account
                    </div>
                  )}
                  {isStudent && (
                    <div className="flex items-center gap-1.5 text-xs bg-[#FFA266]/20 text-black px-3 py-1.5 rounded-full border border-[#FFA266]/30">
                      <GraduationCap className="h-3 w-3" />
                      Student Account
                    </div>
                  )}
                  {!isTeacher && !isStudent && formData.email && (
                    <p className="text-xs text-black/60">
                      Use @pict.edu for teachers or @ms.pict.edu for students
                    </p>
                  )}
                </div>
              </div>

              {isStudent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 pt-2"
                >
                  <div className="space-y-2">
                    <Label htmlFor="enrollmentNumber" className="text-sm font-semibold text-black flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Enrollment Number
                    </Label>
                    <Input
                      id="enrollmentNumber"
                      type="text"
                      placeholder="e.g., C2K231265"
                      value={formData.enrollmentNumber}
                      onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                      className="h-12 border-gray-300 focus:border-[#FFA266] focus:ring-[#FFA266]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNumber" className="text-sm font-semibold text-black flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      Roll Number <span className="text-xs text-black/60 font-normal">(Optional)</span>
                    </Label>
                    <Input
                      id="rollNumber"
                      type="text"
                      placeholder="e.g., 31281"
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      className="h-12 border-gray-300 focus:border-[#FFA266] focus:ring-[#FFA266]"
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-black flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 border-gray-300 focus:border-[#FFA266] focus:ring-[#FFA266]"
                  required
                  minLength={6}
                />
                <p className="text-xs text-black/60 mt-1">
                  Must be at least 6 characters long
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-[#FFA266] hover:bg-[#FF8F4D] text-black shadow-lg shadow-[#FFA266]/50 group" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-[#32374A]/30 border-t-[#32374A] rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#F5F5F5] text-black/60">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/login">
                <Button variant="outline" className="w-full h-12 border-2 border-[#FFA266]/30 hover:border-[#FFA266] hover:bg-[#FFA266]/10 text-black font-semibold">
                  Sign In Instead
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-center text-xs text-black/50">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
