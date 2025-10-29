"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send reset link');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Link href="/login" className="absolute top-8 left-8">
          <Button variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="bg-green-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-black mb-4">Check Your Email</h2>
                <p className="text-black/70 mb-6">
                  If an account with <strong>{email}</strong> exists, we've sent a password reset link to your email.
                </p>
                <div className="bg-[#FF991C]/10 border border-[#FF991C]/30 rounded-lg p-4 mb-6">
                  <p className="text-sm text-black/80">
                    <strong>Next steps:</strong><br/>
                    1. Check your inbox (and spam folder)<br/>
                    2. Click the reset link in the email<br/>
                    3. Enter your new password<br/>
                    4. Login with your new password
                  </p>
                </div>
                <p className="text-xs text-black/60">
                  The reset link will expire in 1 hour for security reasons.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Link href="/login" className="absolute top-8 left-8">
        <Button variant="ghost" className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20">
          <CardHeader className="text-center">
            <div className="bg-[#FF991C]/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-[#FF991C]" />
            </div>
            <CardTitle className="text-3xl text-black">Forgot Password?</CardTitle>
            <CardDescription className="text-black/70 text-base">
              No worries! Enter your email and we'll send you a reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/20 border border-red-300/30 text-black p-4 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-black font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/50 border-black/20 text-black placeholder:text-black/40"
                  required
                />
                <p className="text-xs text-black/60">
                  Enter the email address associated with your account
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF991C] hover:bg-[#FF8F4D] text-black font-bold py-6 text-lg rounded-lg shadow-lg shadow-[#FF991C]/30"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-5 w-5" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-black/60">
                Remember your password?{" "}
                <Link href="/login" className="text-[#FF991C] hover:text-[#FF8F4D] font-semibold">
                  Back to Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
