"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { CatHeartSticker } from "./CuteStickers";
import { Heart, Sparkles } from "lucide-react";

interface ProposalStateProps {
  onAccept: () => void;
}

const NO_PHRASES = [
  "Wait... are you sure? 🥺",
  "nah that's not right...",
  "try again 🥺",
  "be serious...",
  "okay now you're just playing...",
  "okay last chance...",
];

export const ProposalState: React.FC<ProposalStateProps> = ({ onAccept }) => {
  const [noIndex, setNoIndex] = useState(0);
  const [yesScale, setYesScale] = useState(1);
  const [headlineText, setHeadlineText] = useState("Do you love me? ❤️");
  const [noClickCount, setNoClickCount] = useState(0);

  const handleNoClick = () => {
    const nextIndex = (noIndex + 1) % NO_PHRASES.length;
    setNoIndex(nextIndex);
    setHeadlineText(NO_PHRASES[noIndex]);
    
    // Scale YES button up by 40% each click
    setYesScale((prev) => prev * 1.4);
    setNoClickCount((prev) => prev + 1);
  };

  const handleYesClick = () => {
    // Fire festive confetti explosion!
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#FF4D6D", "#2EC4B6", "#FFB3C1", "#FFD166"],
      });
      
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    } catch {
      // Fallback if confetti script encounters issues
    }

    onAccept();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 text-center max-w-xl mx-auto relative overflow-visible"
    >
      {/* Decorative Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "100vh", opacity: 0.2 }}
            animate={{
              y: "-10vh",
              opacity: [0.2, 0.7, 0],
              x: [Math.sin(i) * 30, Math.cos(i) * -30],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear",
            }}
            className="absolute text-pink-300/40 text-xl md:text-2xl"
            style={{ left: `${15 + i * 15}%` }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      {/* Top Sticker GIF */}
      <div className="mb-6 z-10">
        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExajN2ZWV3bjI0a3F6ZnNxcHhtaXNuenBwZzU4Y2hrY2V2eGQ1NDg4ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/aCSURh6OnUyXdOuYcq/giphy.gif"
          alt="Cute Proposal Bear GIF"
          className="w-48 h-48 md:w-60 md:h-60 object-contain mx-auto rounded-3xl drop-shadow-md select-none"
        />
      </div>

      {/* Main Headline */}
      <motion.div className="min-h-[70px] flex items-center justify-center z-10 mb-8 px-2">
        <AnimatePresence mode="wait">
          <motion.h1
            key={headlineText}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.3 }}
            className="text-3xl md:text-4xl font-extrabold text-[#4A3E4E] tracking-tight"
          >
            {headlineText}
          </motion.h1>
        </AnimatePresence>
      </motion.div>

      {/* Interactive Buttons Container */}
      <div className="flex flex-wrap items-center justify-center gap-6 z-20 min-h-[140px] relative w-full">
        {/* YES BUTTON (Scales dynamically) */}
        <motion.button
          onClick={handleYesClick}
          animate={{ scale: yesScale }}
          whileHover={{ scale: yesScale * 1.05 }}
          whileTap={{ scale: yesScale * 0.95 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="bg-[#2EC4B6] hover:bg-[#25ab9e] text-white font-extrabold px-8 py-4 rounded-3xl text-xl md:text-2xl shadow-xl green-glow flex items-center gap-3 transition-colors cursor-pointer z-30"
          style={{
            transformOrigin: "center center",
            maxHeight: "80vh",
            maxWidth: "90vw",
          }}
        >
          <Heart className="w-6 h-6 fill-white text-white animate-bounce" />
          YES
          <Sparkles className="w-5 h-5 text-yellow-200" />
        </motion.button>

        {/* NO BUTTON */}
        <motion.button
          onClick={handleNoClick}
          whileHover={{ scale: 0.95 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="bg-[#FF4D6D] hover:bg-[#e03a58] text-white font-bold px-7 py-4 rounded-3xl text-lg md:text-xl shadow-lg pink-glow flex items-center gap-2 transition-colors cursor-pointer z-20"
        >
          NO 💔
        </motion.button>
      </div>

      {/* Subtext info when clicked multiple times */}
      {noClickCount > 2 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-sm md:text-base text-[#FF4D6D] font-semibold italic animate-pulse"
        >
          Notice how the YES button is getting bigger? You know what to do! 😉
        </motion.p>
      )}
    </motion.div>
  );
};
