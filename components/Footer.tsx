"use client";

import { motion } from "framer-motion";
import { Github, Mail, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="relative z-10 mt-auto border-t border-[#F5F5F5]/10 bg-black/50 backdrop-blur-sm"
    >
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-[#F5F5F5]/60">
            © {currentYear} QuestEd. All rights reserved.
          </p>

          {/* Made with love */}
          <div className="flex items-center gap-2 text-sm text-[#F5F5F5]/60">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-[#FFA266] fill-[#FFA266] animate-pulse" />
            <span>for educators</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5F5F5]/60 hover:text-[#FFA266] transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="mailto:support@quested.com"
              className="text-[#F5F5F5]/60 hover:text-[#FFA266] transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
