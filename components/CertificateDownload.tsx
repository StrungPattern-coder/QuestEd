"use client";

import { useState } from "react";
import { Award, Download, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { downloadCertificate, downloadBadge } from "@/lib/certificateGenerator";

interface CertificateDownloadProps {
  playerName: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  placement?: 1 | 2 | 3;
  className?: string;
}

export default function CertificateDownload({
  playerName,
  quizTitle,
  score,
  totalQuestions,
  percentage,
  placement,
  className = "",
}: CertificateDownloadProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadCertificate = async () => {
    setIsGenerating(true);
    try {
      await downloadCertificate({
        playerName,
        quizTitle,
        score,
        totalQuestions,
        percentage,
        placement,
        date: new Date(),
      });
    } catch (error) {
      console.error("Failed to generate certificate:", error);
      alert("Failed to generate certificate. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadBadge = async () => {
    setIsGenerating(true);
    try {
      let badgeType: "1st" | "2nd" | "3rd" | "participation" | "perfect" = "participation";
      let details = `${percentage}% Score`;

      if (percentage === 100) {
        badgeType = "perfect";
        details = "100% Accuracy";
      } else if (placement === 1) {
        badgeType = "1st";
        details = quizTitle;
      } else if (placement === 2) {
        badgeType = "2nd";
        details = quizTitle;
      } else if (placement === 3) {
        badgeType = "3rd";
        details = quizTitle;
      }

      await downloadBadge({
        type: badgeType,
        playerName,
        details,
      });
    } catch (error) {
      console.error("Failed to generate badge:", error);
      alert("Failed to generate badge. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {/* Download Certificate */}
      <motion.button
        onClick={handleDownloadCertificate}
        disabled={isGenerating}
        className="flex items-center justify-center gap-2 px-6 py-3
          bg-gradient-to-r from-blue-500 to-cyan-500
          hover:from-blue-600 hover:to-cyan-600
          disabled:from-gray-400 disabled:to-gray-500
          text-white font-semibold rounded-xl
          shadow-lg hover:shadow-xl
          transition-all duration-200
          disabled:cursor-not-allowed"
        whileHover={{ scale: isGenerating ? 1 : 1.05 }}
        whileTap={{ scale: isGenerating ? 1 : 0.95 }}
      >
        <FileText className="w-5 h-5" />
        <span>{isGenerating ? "Generating..." : "Download Certificate"}</span>
      </motion.button>

      {/* Download Badge */}
      <motion.button
        onClick={handleDownloadBadge}
        disabled={isGenerating}
        className="flex items-center justify-center gap-2 px-6 py-3
          bg-gradient-to-r from-purple-500 to-pink-500
          hover:from-purple-600 hover:to-pink-600
          disabled:from-gray-400 disabled:to-gray-500
          text-white font-semibold rounded-xl
          shadow-lg hover:shadow-xl
          transition-all duration-200
          disabled:cursor-not-allowed"
        whileHover={{ scale: isGenerating ? 1 : 1.05 }}
        whileTap={{ scale: isGenerating ? 1 : 0.95 }}
      >
        <Award className="w-5 h-5" />
        <span>{isGenerating ? "Generating..." : "Download Badge"}</span>
      </motion.button>
    </div>
  );
}
