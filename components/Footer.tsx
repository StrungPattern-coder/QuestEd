"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";

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

          {/* Center Button */}
          <Link href="/about-creator">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-[#F5F5F5] border-[#FF991C]/30 backdrop-blur-sm"
            >
              <User className="mr-2 h-4 w-4" />
              About the Creator
            </Button>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/StrungPattern-coder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F5F5F5]/60 hover:text-[#FF991C] transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="mailto:support@quested.com"
              className="text-[#F5F5F5]/60 hover:text-[#FF991C] transition-colors"
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
