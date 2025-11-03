"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, Linkedin, Mail, ExternalLink, Smartphone } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import Aurora from "@/components/Aurora";
import { useEffect, useState } from "react";

export default function AboutCreator() {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  useEffect(() => {
    // Detect if device is mobile and has gyroscope
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      
      // Show hint for mobile users, hide after 5 seconds
      if (mobile) {
        setShowMobileHint(true);
        const timer = setTimeout(() => setShowMobileHint(false), 5000);
        return () => clearTimeout(timer);
      }
    };
    
    checkMobile();
  }, []);

  // Auto-scroll projects every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProjectIndex((prev) => (prev + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const projects = [
  {
    title: "QuestEd",
    description:
      "Free, open-source quiz platform — an alternative to Kahoot with unlimited quizzes, real-time multiplayer, classrooms, leaderboards, and teacher dashboards.",
    tech: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
    link: "https://github.com/StrungPattern-coder/QuestEd",
    status: "Active",
  },
  {
    title: "Connect",
    description:
      "Hackathon discovery and participation platform — aggregates hackathons across India, offers personalized recommendations, dashboards, and real-time updates.",
    tech: ["Next.js", "FastAPI", "Supabase", "PostgreSQL", "Celery", "Redis"],
    link: "https://connect-website-three.vercel.app",
    status: "Active",
  },
  {
    title: "QuickCourt",
    description:
      "Real-time multi-sport court discovery, booking, and engagement platform. Includes live availability, instant slot locking, secure Razorpay payments, loyalty & rewards, referral codes, and admin/owner workflows — built with Vite + React + Express + Neon Postgres + Prisma.",
    tech: ["React", "Vite", "Express", "PostgreSQL (Neon)", "Prisma", "Razorpay"],
    link: "https://quick-court-ten.vercel.app",
    status: "Active",
  },
  {
    title: "Document Intelligence System — 1A",
    description:
      "Lightning-fast PDF outline extractor with zero ML dependencies — extracts titles and headings using advanced rule-based intelligence matching ML accuracy. Multilingual, OCR-enabled, Dockerized, and optimized for hackathon constraints.",
    tech: ["Python", "PyMuPDF (fitz)", "Tesseract OCR", "Docker"],
    link: "https://github.com/StrungPattern-coder/cpt-adobe-1a",
    status: "Completed",
  },
  {
    title: "Document Intelligence System — 1B",
    description:
      "Persona-driven offline document analysis system for extracting persona- and task-specific insights from unstructured PDFs. Uses all-mpnet-base-v2 embeddings, extractive summarization, diversity-based ranking, and fully containerized Docker environment.",
    tech: [
      "Python",
      "Sentence Transformers",
      "PyTorch (CPU)",
      "PyMuPDF",
      "Docker",
      "NumPy",
      "NLTK",
    ],
    link: "https://github.com/StrungPattern-coder/cpt-adobe-1b",
    status: "Completed",
  },
];

  const handleContactClick = () => {
    window.location.href = "mailto:ksriram4584@gmail.com"; // Opens default email client
  };

  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#FF991C", "#FF8F4D", "#FF991C"]}
          blend={0.5}
          amplitude={0.6}
          speed={0.5}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center pt-6 pb-4 px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Button 
            variant="ghost" 
            className="text-[#F5F5F5] hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </nav>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#F5F5F5] mb-4">
            About the <span className="text-[#FF991C]">Creator</span>
          </h1>
          <p className="text-lg text-[#F5F5F5]/80 max-w-2xl mx-auto">
            Hi! I'm Sriram Kommalapudi, a passionate software engineer who loves building tools that make learning interactive and accessible.
          </p>
        </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
          {/* Left Column - Profile Card + Connect Section */}
          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center relative"
            >
              <ProfileCard
                name="Sriram Kommalapudi"
                title="Software Developer"
                handle="sriram_kommalapudi"
                status="Available for Projects"
                contactText="Contact Me"
                avatarUrl="/sriram-temporary-avatar.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={true}
                mobileTiltSensitivity={8}
                onContactClick={handleContactClick}
              />
              
              {/* Mobile Gyroscope Hint */}
              {isMobile && showMobileHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 bg-[#FF991C] text-black px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2 whitespace-nowrap"
                >
                  <Smartphone className="h-4 w-4" />
                  Tilt your device to move the card!
                </motion.div>
              )}
            </motion.div>

            {/* Connect Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white/10 backdrop-blur-xl border border-[#FF991C]/30 rounded-2xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">Let's Connect</h2>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://github.com/StrungPattern-coder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-[#F5F5F5] rounded-full transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    GitHub
                  </a>
                  <a
                    href="mailto:ksriram4584@gmail.com"
                    className="flex items-center gap-2 px-4 py-2 bg-[#FF991C] hover:bg-[#FF8F4D] text-black rounded-full transition-colors font-semibold"
                  >
                    <Mail className="h-5 w-5" />
                    Email Me
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Projects & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* About Section */}
            <div className="bg-white/10 backdrop-blur-xl border border-[#FF991C]/30 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-4">About Me</h2>
                <p className="text-[#F5F5F5]/80 leading-relaxed mb-4">
                  I'm a Computer Engineering student who loves building things that solve real problems and make life a little easier. 
                  For me, technology is more than just code — it's about creating something meaningful, something that people actually enjoy using. 
                  QuestEd is one step in that journey, an open-source platform built with the idea of learning, collaboration, and impact.
                </p>
              <p className="text-[#F5F5F5]/80 leading-relaxed">
                I believe in open-source software and the power of community-driven development. When I'm not coding, 
                you'll find me exploring new technologies and contributing to projects that make a difference.
              </p>
            </div>

            {/* Projects Section - Auto-scrolling Carousel */}
            <div className="bg-white/10 backdrop-blur-xl border border-[#FF991C]/30 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#F5F5F5]">Featured Projects</h2>
                <div className="flex items-center gap-2">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentProjectIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentProjectIndex 
                          ? 'bg-[#FF991C] w-6' 
                          : 'bg-[#F5F5F5]/30 hover:bg-[#F5F5F5]/50'
                      }`}
                      aria-label={`Go to project ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Project Carousel */}
              <div className="relative overflow-hidden min-h-[280px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentProjectIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-[#F5F5F5] mb-2">
                          {projects[currentProjectIndex].title}
                        </h3>
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-[#FF991C] text-black rounded-full">
                          {projects[currentProjectIndex].status}
                        </span>
                      </div>
                      
                      <a
                        href={projects[currentProjectIndex].link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF991C] hover:text-[#FF8F4D] transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                    
                    <p className="text-[#F5F5F5]/80 text-sm leading-relaxed">
                      {projects[currentProjectIndex].description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {projects[currentProjectIndex].tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 text-xs bg-white/10 text-[#F5F5F5] rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#F5F5F5]/10">
                <button
                  onClick={() => setCurrentProjectIndex((prev) => (prev - 1 + projects.length) % projects.length)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-[#F5F5F5] rounded-full transition-colors text-sm font-medium"
                >
                  ← Previous
                </button>
                <span className="text-[#F5F5F5]/60 text-sm">
                  {currentProjectIndex + 1} / {projects.length}
                </span>
                <button
                  onClick={() => setCurrentProjectIndex((prev) => (prev + 1) % projects.length)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-[#F5F5F5] rounded-full transition-colors text-sm font-medium"
                >
                  Next →
                </button>
              </div>

              {/* More Projects Link */}
              <div className="mt-6 pt-4 border-t border-[#F5F5F5]/10">
                <a
                  href="https://github.com/StrungPattern-coder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-[#FF991C] hover:text-[#FF8F4D] transition-colors text-sm font-medium group"
                >
                  <Github className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  Visit my GitHub profile to explore more of my latest projects
                  <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
