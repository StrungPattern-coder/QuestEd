"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Trophy, Users, Brain, TrendingUp, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import Aurora from "@/components/Aurora";
import QuestionOfTheDay from "@/components/QuestionOfTheDay";
import StarBorder from "@/components/StarBorder";
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#F5F5F5] leading-tight max-w-5xl px-2"
          >
            {t.home.heroTitle}
            <span className="text-[#FF991C]">{t.home.heroHighlight}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-[#F5F5F5]/80 max-w-3xl leading-relaxed px-4"
          >
            {t.home.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 w-full sm:w-auto px-4"
          >
            <Link href="/quick-quiz" className="w-full sm:w-auto">
              <StarBorder
                as="div"
                color="cyan"
                speed="5s"
                className="w-full cursor-pointer"
              >
                <div className="flex items-center justify-center text-sm sm:text-base font-semibold">
                  Create/Join Quick Quiz
                </div>
              </StarBorder>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 bg-[#FF991C] hover:bg-[#FF8F4D] text-black font-semibold shadow-2xl shadow-[#FF991C]/50 group"
              >
                {t.home.startLearning}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 bg-white/10 hover:bg-white/20 text-[#F5F5F5] border-[#FF991C]/30 backdrop-blur-sm"
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

      {/* Features Section - Infinite Carousel */}
      <div className="relative z-10 pb-20 sm:pb-32 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 px-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-3 sm:mb-4">
            {t.home.whyTitle}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#F5F5F5]/70">
            {t.home.whySubtitle}
          </p>
        </motion.div>

        {/* Infinite Scrolling Carousel */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
          
          <style jsx>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-scroll {
              animation: scroll 30s linear infinite;
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="flex animate-scroll">
            {/* First set of features */}
            {[
              {
                icon: Zap,
                title: t.home.features.liveQuizzes.title,
                description: t.home.features.liveQuizzes.description,
              },
              {
                icon: Users,
                title: t.home.features.classroom.title,
                description: t.home.features.classroom.description,
              },
              {
                icon: Trophy,
                title: t.home.features.gamified.title,
                description: t.home.features.gamified.description,
              },
              {
                icon: TrendingUp,
                title: t.home.features.analytics.title,
                description: t.home.features.analytics.description,
              },
              {
                icon: Brain,
                title: t.home.features.adaptive.title,
                description: t.home.features.adaptive.description,
              },
              {
                icon: Sparkles,
                title: t.home.features.feedback.title,
                description: t.home.features.feedback.description,
              }
            ].concat([
              // Duplicate for infinite effect
              {
                icon: Zap,
                title: t.home.features.liveQuizzes.title,
                description: t.home.features.liveQuizzes.description,
              },
              {
                icon: Users,
                title: t.home.features.classroom.title,
                description: t.home.features.classroom.description,
              },
              {
                icon: Trophy,
                title: t.home.features.gamified.title,
                description: t.home.features.gamified.description,
              },
              {
                icon: TrendingUp,
                title: t.home.features.analytics.title,
                description: t.home.features.analytics.description,
              },
              {
                icon: Brain,
                title: t.home.features.adaptive.title,
                description: t.home.features.adaptive.description,
              },
              {
                icon: Sparkles,
                title: t.home.features.feedback.title,
                description: t.home.features.feedback.description,
              }
            ]).map((feature, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 sm:w-96 mx-4 group"
              >
                <div 
                  className="relative overflow-hidden rounded-2xl p-6 sm:p-8 border-2 border-[#FF991C]/40 backdrop-blur-sm transition-all duration-300 h-full shadow-xl hover:shadow-2xl hover:shadow-[#FF991C]/30 hover:scale-105"
                  style={{
                    background: 'radial-gradient(circle at 50% 0%, rgba(255, 153, 28, 0.35) 0%, rgba(255, 143, 77, 0.15) 50%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(135deg, rgba(255, 153, 28, 0.25) 0%, rgba(255, 184, 77, 0.2) 100%)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF991C]/15 via-transparent to-[#FFB84D]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <div className="relative w-16 h-16 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FF991C] via-[#FFB84D] to-[#FF8F4D] rounded-xl blur-md opacity-70" />
                      <div className="relative bg-gradient-to-br from-[#FF991C] to-[#FF8F4D] w-full h-full rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <feature.icon className="h-8 w-8 text-black drop-shadow-lg" strokeWidth={2.5} />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-[#F5F5F5] mb-3 drop-shadow-lg">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[#F5F5F5]/90 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interested Section */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl"
        >
          {/* Image on the left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-start"
          >
            <img
              src="/miniPekka.standing.webp"
              alt="Mini Pekka"
              className="w-full max-w-md h-auto object-contain"
            />
          </motion.div>

          {/* Text on the right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-6">
              Want to learn more about QuestEd?
            </h2>
            <Link href="/about">
              <span className="inline-flex items-center text-[#FF991C] hover:text-[#FF8F4D] text-lg sm:text-xl font-semibold transition-colors group cursor-pointer">
                Click here
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Question of the Day Component */}
      <QuestionOfTheDay />
    </main>
  );
}
