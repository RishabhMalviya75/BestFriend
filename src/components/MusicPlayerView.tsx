"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Shuffle, Disc } from "lucide-react";
import { extractYouTubeId } from "@/lib/giftData";

interface MusicPlayerViewProps {
  onBack: () => void;
  youtubeUrl?: string; // Dynamic YouTube URL or ID from GiftData
}

export const MusicPlayerView: React.FC<MusicPlayerViewProps> = ({
  onBack,
  youtubeUrl = "HgGAzBDE454",
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  // Extract the clean video ID from whatever format was provided
  const videoId = extractYouTubeId(youtubeUrl);
  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&controls=1`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-8 max-w-5xl mx-auto flex flex-col justify-between font-ui"
    >
      {/* Header Title */}
      <div className="text-center my-4">
        <h1 className="font-cursive text-3xl md:text-5xl font-extrabold text-[#A82846] tracking-wide">
          A song that reminds me of us
        </h1>
      </div>

      {/* Music Player Deck */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch my-auto max-w-4xl mx-auto w-full">
        {/* LEFT: Vinyl Record */}
        <div className="md:col-span-5 bg-[#FFCCD5]/50 border border-[#FFA6B9]/60 rounded-3xl p-6 md:p-8 flex items-center justify-center shadow-md">
          <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-[#1C1A1B] p-3 flex items-center justify-center shadow-2xl border-4 border-gray-900 overflow-hidden">
            <div
              className={`w-full h-full rounded-full border-[10px] border-dashed border-gray-700/50 flex items-center justify-center ${
                isPlaying ? "animate-spin-slow" : "animate-spin-paused"
              }`}
            >
              <div className="w-5/6 h-5/6 rounded-full border-[6px] border-gray-800 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-[#E5889A] flex flex-col items-center justify-center text-white text-center shadow-inner border-2 border-white/80">
                  <span className="font-cursive text-lg font-extrabold tracking-tight">
                    bridestory
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: YouTube + Controls */}
        <div className="md:col-span-7 bg-[#FFCCD5]/50 border border-[#FFA6B9]/60 rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-4 shadow-md">
          {/* YouTube iframe — re-renders whenever videoId changes */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-[#FFA6B9]/40 bg-black">
            <iframe
              key={videoId} // Force re-render on ID change
              className="w-full h-full"
              src={embedSrc}
              title="Song that reminds me of us"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Pink Control Bar */}
          <div className="bg-[#E27387] rounded-2xl p-4 md:p-5 text-white flex flex-col justify-between gap-3 shadow-inner">
            <div className="flex items-center justify-center gap-6">
              <button className="text-white/80 hover:text-white transition-colors cursor-pointer">
                <Shuffle className="w-4 h-4" />
              </button>
              <button className="text-white/90 hover:text-white transition-colors cursor-pointer">
                <SkipBack className="w-5 h-5 fill-current" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-white text-[#E27387] flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                )}
              </button>
              <button className="text-white/90 hover:text-white transition-colors cursor-pointer">
                <SkipForward className="w-5 h-5 fill-current" />
              </button>
              <button className="text-white/80 hover:text-white transition-colors cursor-pointer">
                <Disc className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-1.5 bg-white/40 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full w-1/3" />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-white/80">
                <span>0:00</span>
                <span>–:––</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Go Back Button */}
      <div className="my-4 text-left">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#FF4D6D] hover:bg-[#e03a58] text-white font-extrabold px-6 py-2.5 rounded-full text-sm shadow-md inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </motion.button>
      </div>
    </motion.div>
  );
};
