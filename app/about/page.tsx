"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Code, Users, Globe, Trophy, Check } from "lucide-react";
import StarBorder from "@/components/StarBorder";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#FF991C]/10 to-black" />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 sm:px-6 pt-6 pb-4">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="text-[#F5F5F5] hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#F5F5F5] mb-6">
              What is QuestEd?
            </h1>
            
            <p className="text-xl sm:text-2xl text-[#F5F5F5]/80 mb-8 leading-relaxed">
              A completely <span className="text-[#FF991C] font-semibold">free and open-source</span> alternative to Kahoot
            </p>

            <div className="flex items-center justify-center gap-4 text-[#F5F5F5]/60 text-sm">
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#FF991C]" />
                Built with passion
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <Code className="h-4 w-4 text-[#FF991C]" />
                Open source
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#FF991C]" />
                Free forever
              </span>
            </div>
          </div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-[#FF991C]/10 to-[#FF8F4D]/10 backdrop-blur-xl border-2 border-[#FF991C]/30 rounded-2xl p-8 sm:p-12 mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-[#F5F5F5]/80 leading-relaxed justify-normal">
              QuestEd was created to democratize interactive learning. We believe that every teacher and student deserves access to powerful, engaging quiz tools without breaking the bank or dealing with restrictive paywalls.
            </p>
          </motion.div>

          {/* Why QuestEd */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] mb-8 text-center">
              Why Choose QuestEd?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Heart,
                  title: "100% Free",
                  description: "No subscriptions, no hidden fees, no premium tiers. Everything is free, forever."
                },
                {
                  icon: Code,
                  title: "Open Source",
                  description: "Transparent, community-driven, and fully customizable. Host it yourself if you want."
                },
                {
                  icon: Users,
                  title: "No Limits",
                  description: "Unlimited students, unlimited quizzes, unlimited everything. No artificial restrictions."
                },
                {
                  icon: Trophy,
                  title: "Full Features",
                  description: "Live quizzes, analytics, leaderboards, and more. All features included from day one."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-[#FF991C]/20 rounded-xl p-6 hover:border-[#FF991C]/50 transition-all"
                >
                  <div className="bg-[#FF991C]/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-[#FF991C]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#F5F5F5] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#F5F5F5]/70">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* What You Get */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-[#FF991C]/20 rounded-2xl p-8 sm:p-12 mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] mb-8">
              What You Get
            </h2>

            <div className="space-y-4">
              {[
                "Live quiz competitions with real-time leaderboards",
                "Deadline-based assessments for homework",
                "Comprehensive analytics and insights",
                "Classroom management tools",
                "Question bank and templates",
                "Instant feedback and results",
                "Mobile-friendly interface",
                "Multi-language support"
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="bg-[#FF991C]/20 rounded-full p-1 mt-0.5">
                    <Check className="h-4 w-4 text-[#FF991C]" />
                  </div>
                  <span className="text-[#F5F5F5]/80 text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* The Difference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] mb-6">
              The Difference
            </h2>
            <p className="text-lg text-[#F5F5F5]/80 leading-relaxed mb-6">
              Unlike Kahoot and other platforms that charge for basic features, QuestEd gives you everything you need to create engaging, interactive learning experiences—at no cost.
            </p>
            <p className="text-[#F5F5F5]/70 leading-relaxed">
              Built by educators, for educators. No corporate agenda, no profit margins, just a passion for making education better and more accessible for everyone.
            </p>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center pt-8 border-t border-[#FF991C]/20 mb-0"
          >
            <h3 className="text-2xl font-bold text-[#F5F5F5] mb-6">
              Ready to get started?
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/signup" className="w-full sm:w-auto">
                <StarBorder
                  as="div"
                  color="orange"
                  speed="5s"
                  className="w-full cursor-pointer"
                >
                  <div className="flex items-center justify-center text-sm sm:text-base font-semibold px-8 py-3">
                    Create Free Account
                  </div>
                </StarBorder>
              </Link>
              <Link href="/about-creator" className="w-full sm:w-auto">
                <StarBorder
                  as="div"
                  color="orange"
                  speed="5s"
                  className="w-full cursor-pointer"
                >
                  <div className="flex items-center justify-center text-sm sm:text-base font-semibold px-8 py-3">
                    Meet the Creator
                  </div>
                </StarBorder>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Goblins at viewport edges - outside container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative z-20 w-full pointer-events-none"
      >
        <div className="absolute bottom-0 left-0">
          <img
            src="/goblin.617888a7.png"
            alt="Goblin"
            className="w-[200px] sm:w-[300px] lg:w-[320px] h-auto object-contain"
          />
        </div>
        <div className="absolute bottom-0 right-0">
          <img
            src="/goblin2.1b5f5a6c.png"
            alt="Goblin 2"
            className="w-[145px] sm:w-[220px] lg:w-[250px] h-auto object-contain"
          />
        </div>
      </motion.div>
    </div>
  );
}
