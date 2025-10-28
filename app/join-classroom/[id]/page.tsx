"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, BookOpen } from "lucide-react";

export default function JoinClassroomPage() {
  const router = useRouter();
  const params = useParams();
  const classroomId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [classroomName, setClassroomName] = useState("");

  useEffect(() => {
    joinClassroom();
  }, [classroomId]);

  const joinClassroom = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/login?redirect=/join-classroom/${classroomId}`);
      return;
    }

    try {
      const response = await fetch(`/api/student/join-classroom/${classroomId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to join classroom");
        return;
      }

      setClassroomName(data.classroomName || "the classroom");
      setSuccess(true);

      // Redirect to student dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard/student");
      }, 2000);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#FFA266]/20 rounded-full blur-3xl animate-pulse-color"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-[#FFA266]/20 rounded-full blur-3xl animate-pulse-color" style={{ animationDelay: "2s" }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-[#F5F5F5]/95 border-[#FFA266]/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-[#FFA266]/20 p-4 rounded-full">
                {loading ? (
                  <Loader2 className="h-12 w-12 text-[#FFA266] animate-spin" />
                ) : success ? (
                  <CheckCircle className="h-12 w-12 text-green-600" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-600" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl text-black">
              {loading ? "Joining Classroom..." : success ? "Success!" : "Error"}
            </CardTitle>
            <CardDescription className="text-black/60">
              {loading && "Please wait while we add you to the classroom"}
              {success && `You have been added to ${classroomName}`}
              {error && "Something went wrong"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm">
                  {error}
                </div>
                <Button
                  onClick={() => router.push("/dashboard/student")}
                  className="w-full bg-[#FFA266] hover:bg-[#FF8F4D] text-black"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}

            {success && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm text-center">
                  Redirecting you to your dashboard...
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-center">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-[#FFA266] rounded-full"></div>
                  <div className="h-2 w-2 bg-[#FFA266] rounded-full" style={{ animationDelay: "0.2s" }}></div>
                  <div className="h-2 w-2 bg-[#FFA266] rounded-full" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
