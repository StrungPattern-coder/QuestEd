"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { Mail, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });

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
    <div className="min-h-screen bg-black flex items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden">
      {/* Banner Image - Right Side */}
      <div className="absolute right-0 bottom-0 z-10 pointer-events-none">
        <Image
          src="/Banner_This_is_Fine.png"
          alt="Banner"
          width={600}
          height={800}
          className="object-contain w-[200px] sm:w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px] h-auto opacity-50 sm:opacity-70 lg:opacity-100"
          priority
        />
      </div>

      <Link href="/" className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 z-20">
        <Button 
          variant="ghost" 
          className="text-[#F5F5F5] hover:bg-white/10 group text-sm sm:text-base px-2 sm:px-4 h-9 sm:h-10"
        >
          <ArrowLeft className="mr-1 sm:mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">{t.auth.backToHome}</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </Link>
      
      <div className="absolute top-4 sm:top-6 lg:top-8 right-4 sm:right-6 lg:right-8 z-20">
        <LanguageSwitcher />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="backdrop-blur-xl bg-[#F5F5F5]/95 border-[#FF991C]/20 shadow-2xl">
          <CardHeader className="space-y-2 sm:space-y-3 text-center pb-6 sm:pb-8 px-4 sm:px-6">
            <CardTitle className="text-3xl sm:text-4xl font-bold text-black">
              {t.auth.loginTitle}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-black/70">
              {t.auth.loginDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border border-red-200 text-red-700 p-3 sm:p-4 rounded-lg text-xs sm:text-sm flex items-start gap-2"
                >
                  <div className="flex-shrink-0 mt-0.5">⚠️</div>
                  <div>{error}</div>
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-black flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {t.auth.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.auth.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-[#FF991C] focus:ring-[#FF991C]"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs sm:text-sm font-semibold text-black flex items-center gap-2">
                    <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    {t.auth.password}
                  </Label>
                  <Link href="/forgot-password" className="text-sm text-[#FF991C] hover:text-[#FF8F4D] font-semibold">
                    Forgot?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder={t.auth.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 border-gray-300 focus:border-[#FF991C] focus:ring-[#FF991C]"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-[#FF991C] hover:bg-[#FF8F4D] text-black shadow-lg shadow-[#FF991C]/50 group" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-[#32374A]/30 border-t-[#32374A] rounded-full animate-spin mr-2"></div>
                    {t.common.loading}
                  </>
                ) : (
                  <>
                    {t.auth.loginButton}
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
                <span className="px-4 bg-[#F5F5F5] text-black/60">{t.auth.noAccount}</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/signup">
                <Button variant="outline" className="w-full h-12 border-2 border-[#FF991C]/30 hover:border-[#FF991C] hover:bg-[#FF991C]/10 text-black font-semibold">
                  {t.auth.signupButton}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
