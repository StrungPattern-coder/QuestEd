"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Users } from "lucide-react";

export default function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    // Fetch visitor count
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('/api/stats/visitors');
        const data = await response.json();
        
        if (data.totalVisitors !== undefined) {
          setVisitorCount(data.totalVisitors);
        }
      } catch (error) {
        console.error('Failed to fetch visitor count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVisitorCount();
  }, []);

  // Animate counter
  useEffect(() => {
    if (visitorCount === null) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = visitorCount / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= visitorCount) {
        setDisplayCount(visitorCount);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [visitorCount]);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 text-[#F5F5F5]/50">
        <Eye className="h-4 w-4 animate-pulse" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (visitorCount === null) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-sm border border-[#FF991C]/30 rounded-full px-4 py-2 shadow-lg hover:shadow-xl hover:shadow-[#FF991C]/20 transition-all duration-300 group cursor-default"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-[#FF991C] rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative bg-gradient-to-br from-[#FF991C] to-[#FF8F4D] p-1.5 rounded-full">
          <Users className="h-4 w-4 text-black" strokeWidth={2.5} />
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-[10px] text-[#F5F5F5]/60 font-medium uppercase tracking-wider">
          Total Visitors
        </span>
        <span className="text-xl font-bold text-[#F5F5F5] tabular-nums">
          {formatNumber(displayCount)}
        </span>
      </div>

      <div className="ml-1.5 flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-[#FF991C] rounded-full animate-pulse" />
        <span className="text-[10px] text-[#FF991C] font-semibold">
          LIVE
        </span>
      </div>
    </motion.div>
  );
}
