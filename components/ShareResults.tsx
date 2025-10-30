"use client";

import { useState } from "react";
import { Share2, Twitter, Facebook, MessageCircle, Link2, Download, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareResultsProps {
  quizTitle: string;
  playerName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  placement?: 1 | 2 | 3 | number;
  className?: string;
}

export default function ShareResults({
  quizTitle,
  playerName,
  score,
  totalQuestions,
  percentage,
  placement,
  className = "",
}: ShareResultsProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate share text
  const getShareText = () => {
    const placementText = placement && placement <= 3 
      ? `🏆 I placed #${placement} in` 
      : `📊 I scored ${percentage}% in`;
    
    return `${placementText} "${quizTitle}" on QuestEd! 🎯\n\n` +
           `Score: ${score}/${totalQuestions} (${percentage}%)\n` +
           `#QuestEd #Quiz #Education`;
  };

  // Get shareable URL (would be the actual quiz or results page)
  const getShareUrl = () => {
    return typeof window !== 'undefined' ? window.location.href : '';
  };

  // Share to Twitter
  const shareToTwitter = () => {
    const text = getShareText();
    const url = getShareUrl();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  };

  // Share to Facebook
  const shareToFacebook = () => {
    const url = getShareUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  };

  // Share to WhatsApp
  const shareToWhatsApp = () => {
    const text = getShareText();
    const url = getShareUrl();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  // Generate and download image (placeholder - would need canvas implementation)
  const downloadImage = () => {
    // TODO: Implement canvas-based image generation
    alert('Image generation coming soon! This will create a shareable image of your results.');
  };

  // Use native share API if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${quizTitle} Results`,
          text: getShareText(),
          url: getShareUrl(),
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  const shareButtons = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-[#1DA1F2] hover:bg-[#1a8cd8]',
      action: shareToTwitter,
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-[#1877F2] hover:bg-[#166fe5]',
      action: shareToFacebook,
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366] hover:bg-[#20bd5a]',
      action: shareToWhatsApp,
    },
    {
      name: copied ? 'Copied!' : 'Copy Link',
      icon: copied ? Check : Link2,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: copyLink,
    },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Main share button */}
      <motion.button
        onClick={handleNativeShare}
        className="flex items-center gap-2 px-6 py-3 
          bg-gradient-to-r from-purple-500 to-pink-500 
          hover:from-purple-600 hover:to-pink-600
          text-white font-semibold rounded-xl
          shadow-lg hover:shadow-xl
          transition-all duration-200 hover:scale-105
          group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span>Share Results</span>
      </motion.button>

      {/* Share menu (for browsers without native share) */}
      <AnimatePresence>
        {showShareMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowShareMenu(false)}
            />

            {/* Share menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-full mt-4 left-1/2 -translate-x-1/2 
                bg-white dark:bg-gray-800 rounded-2xl shadow-2xl 
                p-6 z-50 min-w-[320px]"
            >
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Share Your Results
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Let others know about your achievement!
                </p>
              </div>

              {/* Share buttons grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {shareButtons.map((button) => (
                  <motion.button
                    key={button.name}
                    onClick={button.action}
                    className={`${button.color} text-white 
                      flex flex-col items-center justify-center gap-2 
                      p-4 rounded-xl transition-all duration-200
                      hover:shadow-lg`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button.icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{button.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Download image button */}
              <motion.button
                onClick={downloadImage}
                className="w-full flex items-center justify-center gap-2 
                  py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 
                  hover:from-orange-600 hover:to-red-600
                  text-white font-semibold rounded-xl
                  transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-5 h-5" />
                <span>Download as Image</span>
              </motion.button>

              {/* Close button */}
              <button
                onClick={() => setShowShareMenu(false)}
                className="w-full mt-3 py-2 text-gray-600 dark:text-gray-400 
                  hover:text-gray-900 dark:hover:text-white
                  font-medium transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
