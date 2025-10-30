"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, Linkedin, Mail, ExternalLink, Smartphone } from "lucide-react";
import ProfileCard from "@/components/ProfileCard";
import Aurora from "@/components/Aurora";
import { useEffect, useState } from "react";

export default function AboutCreator() {
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileHint, setShowMobileHint] = useState(false);

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

  const projects = [
    {
      title: "QuestEd",
      description: "Free, open-source quiz platform - An alternative to Kahoot with unlimited quizzes, students, and features.",
      tech: ["Next.js", "TypeScript", "MongoDB", "Tailwind CSS"],
      link: "https://github.com/StrungPattern-coder/QuestEd",
      status: "Active"
    },
    // Add more projects here as needed
  ];

  const handleContactClick = () => {
    window.location.href = "mailto:sriram@example.com"; // Replace with your actual email
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
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center relative"
          >
            <ProfileCard
              name="Sriram Kommalapudi"
              title="Full Stack Developer"
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

          {/* Projects & Info */}
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
                I'm a software engineer with a passion for creating educational technology that empowers teachers and students. 
                QuestEd is my vision of making interactive learning accessible to everyone, without paywalls or limitations.
              </p>
              <p className="text-[#F5F5F5]/80 leading-relaxed">
                I believe in open-source software and the power of community-driven development. When I'm not coding, 
                you'll find me exploring new technologies and contributing to projects that make a difference.
              </p>
            </div>

            {/* Projects Section */}
            <div className="bg-white/10 backdrop-blur-xl border border-[#FF991C]/30 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#F5F5F5] mb-6">Featured Projects</h2>
              <div className="space-y-6">
                {projects.map((project, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-[#F5F5F5]">{project.title}</h3>
                        <span className="inline-block px-2 py-1 text-xs bg-[#FF991C] text-black rounded-full mt-1">
                          {project.status}
                        </span>
                      </div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF991C] hover:text-[#FF8F4D] transition-colors"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    </div>
                    <p className="text-[#F5F5F5]/70 text-sm">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 text-xs bg-white/10 text-[#F5F5F5] rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect Section */}
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
      </div>
    </main>
  );
}
