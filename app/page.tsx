"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Trophy, Users, Brain, TrendingUp, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFA266]/30 rounded-full blur-3xl animate-pulse-color"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFA266]/20 rounded-full blur-3xl animate-pulse-color" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#FFA266]/20 rounded-full blur-3xl animate-pulse-color" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="bg-[#FFA266] p-2 rounded-xl">
              <Brain className="h-6 w-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-[#F5F5F5]">
              QuestEd
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <Link href="/login">
              <Button variant="ghost" className="text-[#F5F5F5] hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#FFA266] hover:bg-[#FF8F4D] text-black font-semibold shadow-lg shadow-[#FFA266]/50">
                Get Started
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-[#FFA266]/30"
          >
            <Sparkles className="h-4 w-4 text-[#FFA266]" />
            <span className="text-sm text-[#F5F5F5]">PICT College German Testing Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-[#F5F5F5] leading-tight max-w-5xl"
          >
            Master German with
            <span className="text-[#FFA266]"> Interactive Quizzes</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-[#F5F5F5]/80 max-w-3xl leading-relaxed"
          >
            Experience the perfect blend of Kahoot's excitement and Duolingo's effectiveness. 
            Live quizzes, instant feedback, and competitive learning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Link href="/signup">
              <Button size="lg" className="text-lg px-10 py-7 bg-[#FFA266] hover:bg-[#FF8F4D] text-black font-semibold shadow-2xl shadow-[#FFA266]/50 group">
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-10 py-7 bg-white/10 hover:bg-white/20 text-[#F5F5F5] border-[#FFA266]/30 backdrop-blur-sm">
                Sign In
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-[#FFA266]/20"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFA266] mb-1">500+</div>
              <div className="text-sm text-[#F5F5F5]/70">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFA266] mb-1">50+</div>
              <div className="text-sm text-[#F5F5F5]/70">Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FFA266] mb-1">10K+</div>
              <div className="text-sm text-[#F5F5F5]/70">Tests Completed</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-[#F5F5F5] mb-4">
            Why Choose QuestEd?
          </h2>
          <p className="text-xl text-[#F5F5F5]/70">
            Powerful features designed for modern language learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Zap,
              title: "Live Quizzes",
              description: "Real-time interactive tests with instant feedback and live leaderboards. Feel the adrenaline!",
              delay: 0
            },
            {
              icon: Users,
              title: "Classroom Management",
              description: "Effortlessly organize students, assign tests, and track progress all in one place.",
              delay: 0.1
            },
            {
              icon: Trophy,
              title: "Gamified Learning",
              description: "Earn points, climb leaderboards, and compete with classmates to stay motivated.",
              delay: 0.2
            },
            {
              icon: TrendingUp,
              title: "Detailed Analytics",
              description: "Comprehensive insights into performance, progress, and areas for improvement.",
              delay: 0.3
            },
            {
              icon: Brain,
              title: "Adaptive Testing",
              description: "Smart question selection that adapts to your skill level for optimal learning.",
              delay: 0.4
            },
            {
              icon: Sparkles,
              title: "Instant Feedback",
              description: "Get immediate results and explanations to reinforce learning in real-time.",
              delay: 0.5
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: feature.delay }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <div className="bg-[#F5F5F5] rounded-2xl p-8 border-2 border-[#FFA266]/20 hover:border-[#FFA266] transition-all duration-300 h-full hover:shadow-2xl hover:shadow-[#FFA266]/20">
                <div className="inline-flex p-4 rounded-xl bg-[#FFA266] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-2xl font-semibold text-black mb-3 group-hover:text-[#FFA266] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-black/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-[#FFA266] rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDZjMy4zMSAwIDYgMi42OSA2IDZzLTIuNjkgNi02IDYtNi0yLjY5LTYtNiAyLjY5LTYgNi02eiIgZmlsbD0iIzMyMzc0QSIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Ready to Transform Your German Learning?
            </h2>
            <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
              Join hundreds of PICT students already mastering German through interactive quizzes
            </p>
            <Link href="/signup">
              <Button size="lg" className="text-lg px-12 py-7 bg-black text-[#F5F5F5] hover:bg-black/90 shadow-2xl group">
                Create Free Account
                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
