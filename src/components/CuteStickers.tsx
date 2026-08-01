"use client";

import React from "react";
import { motion } from "framer-motion";

// Cute White Cat holding a Red Heart (Matching Image 4)
export const CatHeartSticker = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="relative w-48 h-48 md:w-56 md:h-56 mx-auto flex items-center justify-center select-none"
    >
      {/* Floating Red Hearts above head */}
      <motion.div
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-1 right-12 text-xl"
      >
        ❤️
      </motion.div>
      <motion.div
        animate={{ y: [3, -3, 3] }}
        transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        className="absolute top-2 right-6 text-base"
      >
        ❤️
      </motion.div>
      <motion.div
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="absolute top-4 left-10 text-lg"
      >
        ❤️
      </motion.div>

      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cat Head */}
        <path
          d="M 60 70 C 45 45 65 30 75 50 C 90 42 110 42 125 50 C 135 30 155 45 140 70 C 160 90 155 120 140 130 C 120 140 80 140 60 130 C 45 120 40 90 60 70 Z"
          fill="white"
          stroke="#1A1A1A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Ears inner detail */}
        <path d="M 62 60 Q 70 48 74 58" fill="#FFCCD5" stroke="#1A1A1A" strokeWidth="2" />
        <path d="M 138 60 Q 130 48 126 58" fill="#FFCCD5" stroke="#1A1A1A" strokeWidth="2" />

        {/* Eyes (Happy Closed Arcs) */}
        <path d="M 75 80 Q 82 74 88 80" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M 112 80 Q 118 74 124 80" stroke="#1A1A1A" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Rosy Blush */}
        <ellipse cx="72" cy="88" rx="7" ry="4" fill="#FF8FA3" />
        <ellipse cx="128" cy="88" rx="7" ry="4" fill="#FF8FA3" />

        {/* Cat Mouth */}
        <path d="M 94 85 Q 100 90 106 85" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Paws */}
        <ellipse cx="70" cy="115" rx="12" ry="8" fill="white" stroke="#1A1A1A" strokeWidth="3.5" />
        <ellipse cx="130" cy="115" rx="12" ry="8" fill="white" stroke="#1A1A1A" strokeWidth="3.5" />

        {/* Big Pinkish Red Heart held in arms */}
        <path
          d="M 100 145 C 100 145 68 120 68 100 C 68 88 78 80 90 80 C 96 80 100 84 100 87 C 100 84 104 80 110 80 C 122 80 132 88 132 100 C 132 120 100 145 100 145 Z"
          fill="#FF5D73"
          stroke="#1A1A1A"
          strokeWidth="3.5"
        />

        {/* Subtle Heart Highlight */}
        <path d="M 78 94 Q 82 86 90 88" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
      </svg>
    </motion.div>
  );
};

// Gift Box Vector Graphic (Matching Image 4)
export const GiftBoxSticker = () => {
  return (
    <div className="w-28 h-28 md:w-32 md:h-32 mx-auto relative flex items-center justify-center">
      {/* Small floating hearts around gift */}
      <div className="absolute -top-1 -right-1 text-xs">💕</div>
      <div className="absolute top-2 -left-1 text-xs">💕</div>

      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm" fill="none">
        {/* Gift Box Base */}
        <rect x="25" y="55" width="70" height="50" rx="8" fill="white" stroke="#E6A5B8" strokeWidth="3" />

        {/* Gift Lid */}
        <rect x="20" y="45" width="80" height="15" rx="5" fill="#FFF0F3" stroke="#E6A5B8" strokeWidth="3" />

        {/* Vertical Ribbon */}
        <rect x="52" y="45" width="16" height="60" fill="#FFCCD5" stroke="#E6A5B8" strokeWidth="2" />

        {/* Bow Tie on Top */}
        <path
          d="M 60 45 C 45 28 35 42 55 45 C 35 45 45 28 60 45 Z"
          fill="#FF8FA3"
          stroke="#E6A5B8"
          strokeWidth="2.5"
        />
        <path
          d="M 60 45 C 75 28 85 42 65 45 C 85 45 75 28 60 45 Z"
          fill="#FF8FA3"
          stroke="#E6A5B8"
          strokeWidth="2.5"
        />
        <circle cx="60" cy="45" r="5" fill="#FF4D6D" stroke="#E6A5B8" strokeWidth="2" />

        {/* Hanging Heart Tag */}
        <path
          d="M 70 65 C 70 65 60 55 60 50 C 60 46 64 43 68 45 C 70 45 70 47 70 47 C 70 47 70 45 72 45 C 76 43 80 46 80 50 C 80 55 70 65 70 65 Z"
          fill="#FF4D6D"
          stroke="#1A1A1A"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};
