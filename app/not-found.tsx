"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, BookOpen, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Static Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#FF991C]/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[#FF8F4D]/20 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Simplified Floating Question Marks */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] text-[#FF991C]/10 text-4xl md:text-6xl font-bold animate-pulse">?</div>
        <div className="absolute top-[20%] right-[20%] text-[#FF991C]/10 text-4xl md:text-6xl font-bold animate-pulse" style={{ animationDelay: '1s' }}>?</div>
        <div className="absolute bottom-[25%] left-[10%] text-[#FF991C]/10 text-4xl md:text-6xl font-bold animate-pulse" style={{ animationDelay: '2s' }}>?</div>
        <div className="absolute bottom-[15%] right-[15%] text-[#FF991C]/10 text-4xl md:text-6xl font-bold animate-pulse" style={{ animationDelay: '3s' }}>?</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          {/* 404 Number */}
          <div className="relative mb-8">
            <div className="text-[120px] sm:text-[180px] md:text-[250px] font-black leading-none">
              <span className="bg-gradient-to-br from-[#FF991C] via-[#FF8F4D] to-[#FF991C] bg-clip-text text-transparent drop-shadow-2xl">
                404
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-4">
              Oops! Wrong Answer! 🤔
            </h1>
            <p className="text-lg sm:text-xl text-[#F5F5F5]/80 max-w-2xl mx-auto">
              Looks like you've stumbled upon a page that doesn't exist in our quiz database.
              <br />
              <span className="text-[#FF991C] font-semibold">
                This question is marked as incorrect!
              </span>
            </p>
          </div>

          {/* Fun Quiz-themed Message */}
          <div className="mb-12 p-6 sm:p-8 bg-gradient-to-br from-[#FF991C]/10 to-[#FF8F4D]/10 backdrop-blur-xl border-2 border-[#FF991C]/30 rounded-2xl max-w-2xl mx-auto">
            <div className="flex items-start gap-4 text-left">
              <div className="bg-[#FF991C]/20 p-3 rounded-xl flex-shrink-0">
                <BookOpen className="w-6 h-6 text-[#FF991C]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#F5F5F5] mb-2">
                  Did You Know?
                </h3>
                <p className="text-[#F5F5F5]/70 text-sm sm:text-base">
                  In QuestEd, every wrong answer is a learning opportunity! 
                  But this 404 error? That's just a wrong turn in the digital hallway. 
                  Let's get you back to the right classroom! 📚
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#FF991C] to-[#FF8F4D] hover:from-[#FF8F4D] hover:to-[#FF991C] text-black font-bold px-8 py-6 rounded-xl shadow-lg shadow-[#FF991C]/50 hover:shadow-xl hover:shadow-[#FF991C]/70 transition-all duration-300 group min-w-[200px]"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Back to Home
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-transparent border-2 border-[#FF991C] text-[#FF991C] hover:bg-[#FF991C] hover:text-black font-semibold px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300 group min-w-[200px]"
            >
              <Link href="/dashboard/student">
                <Compass className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                Go to Dashboard
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-[#FF991C]/20">
            <p className="text-[#F5F5F5]/60 mb-4 text-sm">Quick Links:</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                href="/login"
                className="text-[#F5F5F5]/70 hover:text-[#FF991C] transition-colors duration-200 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Login
              </Link>
              <span className="text-[#F5F5F5]/30">•</span>
              <Link
                href="/signup"
                className="text-[#F5F5F5]/70 hover:text-[#FF991C] transition-colors duration-200"
              >
                Sign Up
              </Link>
              <span className="text-[#F5F5F5]/30">•</span>
              <Link
                href="/about-creator"
                className="text-[#F5F5F5]/70 hover:text-[#FF991C] transition-colors duration-200"
              >
                About
              </Link>
              <span className="text-[#F5F5F5]/30">•</span>
              <Link
                href="/how-to-use"
                className="text-[#F5F5F5]/70 hover:text-[#FF991C] transition-colors duration-200"
              >
                Help
              </Link>
            </div>
          </div>

          {/* Fun Easter Egg */}
          <div className="mt-8">
            <p className="text-[#F5F5F5]/40 text-xs italic">
              Error Code: QUEST_NOT_FOUND_404 | Score: 0/1 (Better luck next time!)
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FF991C] to-transparent" />
    </div>
  );
}
