"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { soundManager } from "@/lib/sounds";

interface SoundToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function SoundToggle({
  className = "",
  size = "md",
  showLabel = false,
}: SoundToggleProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsMuted(soundManager.getMuted());
  }, []);

  const handleToggle = () => {
    const newMutedState = soundManager.toggleMute();
    setIsMuted(newMutedState ?? false);
  };

  if (!isClient) {
    return null; // Avoid hydration issues
  }

  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses[size]} ${className} 
        flex items-center justify-center gap-2
        rounded-full bg-white/10 hover:bg-white/20 
        backdrop-blur-sm border border-white/20
        transition-all duration-200 hover:scale-110
        group relative
      `}
      title={isMuted ? "Unmute sounds" : "Mute sounds"}
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? (
        <VolumeX
          size={iconSizes[size]}
          className="text-white/70 group-hover:text-white transition-colors"
        />
      ) : (
        <Volume2
          size={iconSizes[size]}
          className="text-white group-hover:text-white transition-colors"
        />
      )}

      {showLabel && (
        <span className="text-white/90 font-medium">
          {isMuted ? "Unmute" : "Mute"}
        </span>
      )}

      {/* Tooltip */}
      <span
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 
        px-2 py-1 bg-black/80 text-white text-xs rounded
        opacity-0 group-hover:opacity-100 transition-opacity
        whitespace-nowrap pointer-events-none"
      >
        {isMuted ? "Unmute sounds" : "Mute sounds"}
      </span>
    </button>
  );
}
