"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { studentApi } from "@/lib/api";
import { Brain, Loader2, Zap, Users } from "lucide-react";

export default function JoinLiveTestPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await studentApi.joinLiveTest(joinCode.toUpperCase());
      if (response.error) {
        setError(response.error);
        setLoading(false);
        return;
      }

      if (response.data) {
        const testId = (response.data as any).test._id;
        router.push(`/dashboard/student/tests/${testId}/take`);
      }
    } catch (err) {
      setError("Failed to join test. Please check the code and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FFA266]/20 rounded-full blur-3xl animate-pulse-color"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-[#FFA266]/20 rounded-full blur-3xl animate-pulse-color" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FFA266]/20 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-[#FFA266] p-4 rounded-2xl">
                  <Zap className="h-12 w-12 text-black" />
                </div>
              </div>
              <CardTitle className="text-3xl text-black mb-2">Join Live Quiz</CardTitle>
              <CardDescription className="text-black/60 text-base">
                Enter the code provided by your teacher
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleJoin} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-lg text-sm font-medium">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="h-16 text-center text-3xl font-bold tracking-widest border-2 border-[#FFA266]/30 focus:border-[#FFA266] uppercase"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-black/60 text-center">
                    Example: ABC123
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={loading || joinCode.length < 6}
                  className="w-full h-14 bg-[#FFA266] hover:bg-[#FF8F4D] text-black font-bold text-lg shadow-xl disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      Join Quiz
                    </>
                  )}
                </Button>

                <div className="pt-4 border-t border-black/10">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push("/dashboard/student")}
                    className="w-full text-black/70 hover:text-black hover:bg-black/5"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </form>

              {/* Info Section */}
              <div className="mt-8 pt-6 border-t border-black/10">
                <h4 className="text-sm font-semibold text-black mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#FFA266]" />
                  How it works:
                </h4>
                <ol className="space-y-2 text-xs text-black/70">
                  <li className="flex gap-2">
                    <span className="font-bold text-[#FFA266]">1.</span>
                    <span>Your teacher starts a live quiz and shares a join code</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#FFA266]">2.</span>
                    <span>Enter the code above to join the session</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#FFA266]">3.</span>
                    <span>Answer questions in real-time and compete with classmates</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-[#FFA266]">4.</span>
                    <span>Watch your score climb on the live leaderboard!</span>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
