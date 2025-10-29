"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Trophy, Users, Brain, TrendingUp, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Aurora from "@/components/Aurora";
import { useEffect, useState } from "react";

export default function Home() {
  const { t } = useLanguage();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if device is mobile for performance optimization
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Aurora Background - Simplified on mobile */}
      {!isMobile && (
        <div className="absolute inset-0 z-0">
          <Aurora
            colorStops={["#FF991C", "#FF8F4D", "#FF991C"]}
            blend={0.5}
            amplitude={0.6}
            speed={0.5}
          />
        </div>
      )}
      {isMobile && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-[#FF991C]/10 to-black" />
      )}

      {/* Navigation */}
      <nav className="relative z-10 flex justify-center pt-4 pb-4 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-xl border border-[#FF991C]/30 rounded-2xl lg:rounded-full px-4 sm:px-6 lg:px-8 py-3 lg:py-4 shadow-2xl w-full max-w-6xl"
        >
          <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
            {/* Brand */}
            <Link href="/">
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-[#F5F5F5] hover:text-[#FF991C] transition-colors cursor-pointer">
                {t.brandName}
              </span>
            </Link>

            {/* Divider - Hidden on mobile */}
            <div className="hidden sm:block h-8 w-px bg-[#F5F5F5]/20"></div>

            {/* Navigation Items */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <Link href="/login">
                <Button 
                  variant="ghost" 
                  className="text-[#F5F5F5] hover:bg-white/10 rounded-full text-sm sm:text-base px-3 sm:px-4 h-9 sm:h-10"
                >
                  {t.login}
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-[#FF991C] hover:bg-[#FF8F4D] text-black font-semibold shadow-lg shadow-[#FF991C]/50 rounded-full text-sm sm:text-base px-3 sm:px-4 h-9 sm:h-10">
                  {t.getStarted}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-24 lg:pb-32">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-[#F5F5F5] leading-tight max-w-5xl px-2"
          >
            {t.home.heroTitle}
            <span className="text-[#FF991C]">{t.home.heroHighlight}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#F5F5F5]/80 max-w-3xl leading-relaxed px-4"
          >
            {t.home.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto px-4"
          >
            <Link href="/signup" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-[#FF991C] hover:bg-[#FF8F4D] text-black font-semibold shadow-2xl shadow-[#FF991C]/50 group"
              >
                {t.home.startLearning}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 bg-white/10 hover:bg-white/20 text-[#F5F5F5] border-[#FF991C]/30 backdrop-blur-sm"
              >
                {t.signIn}
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-[#FF991C]/20"
          >
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pb-20 sm:pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-3 sm:mb-4 px-4">
            {t.home.whyTitle}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[#F5F5F5]/70 px-4">
            {t.home.whySubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: Zap,
              title: t.home.features.liveQuizzes.title,
              description: t.home.features.liveQuizzes.description,
              delay: 0
            },
            {
              icon: Users,
              title: t.home.features.classroom.title,
              description: t.home.features.classroom.description,
              delay: 0.1
            },
            {
              icon: Trophy,
              title: t.home.features.gamified.title,
              description: t.home.features.gamified.description,
              delay: 0.2
            },
            {
              icon: TrendingUp,
              title: t.home.features.analytics.title,
              description: t.home.features.analytics.description,
              delay: 0.3
            },
            {
              icon: Brain,
              title: t.home.features.adaptive.title,
              description: t.home.features.adaptive.description,
              delay: 0.4
            },
            {
              icon: Sparkles,
              title: t.home.features.feedback.title,
              description: t.home.features.feedback.description,
              delay: 0.5
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-[#F5F5F5] rounded-2xl p-6 sm:p-8 border-2 border-[#FF991C]/20 hover:border-[#FF991C] transition-all duration-300 h-full hover:shadow-2xl hover:shadow-[#FF991C]/20 md:hover:scale-105 md:hover:-translate-y-1">
                <div className="inline-flex p-3 sm:p-4 rounded-xl bg-[#FF991C] mb-4 sm:mb-6 transition-transform duration-300 md:group-hover:scale-110">
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-black" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-black mb-2 sm:mb-3 transition-colors md:group-hover:text-[#FF991C]">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-black/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-[#FF991C] rounded-3xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDZjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjkgNi02IDYtNi0yLjY5LTYtNiAyLjY5LTYgNi02eiIgZmlsbD0iIzMyMzc0QSIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
              {t.home.ctaTitle}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-black/80 mb-8 max-w-2xl mx-auto px-2">
              {t.home.ctaDescription}
            </p>
            <Link href="/signup" className="inline-block w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-12 py-6 sm:py-7 bg-black text-[#F5F5F5] hover:bg-black/90 shadow-2xl group whitespace-normal sm:whitespace-nowrap"
              >
                <span className="block sm:inline">{t.home.ctaButton}</span>
                <Sparkles className="ml-2 h-5 w-5 inline-block group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
