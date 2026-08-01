"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface LoveLetterViewProps {
  onBack: () => void;
  partnerName?: string;     // Dynamic partner name from GiftData
  letterContent?: string;   // Dynamic letter body from GiftData
}

const DEFAULT_LETTER = `Today is Valentine's Day, and I just want you to know how grateful I am to have you in my life. From the moment you came into my world, everything felt warmer, kinder, and more meaningful. You make ordinary moments feel special just by being you. No matter where life takes us, you will always be my favorite place to be. Loving you is the easiest and most wonderful thing I know.

Being with you feels like home. In the quiet moments and the loud ones, in laughter and in silence, I find comfort in you. You make me feel understood, supported, and deeply loved, and that is something I will never take for granted.`;

export const LoveLetterView: React.FC<LoveLetterViewProps> = ({
  onBack,
  partnerName = "My Love",
  letterContent = DEFAULT_LETTER,
}) => {
  // Split the letter into paragraphs by double newline
  const paragraphs = letterContent
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-8 max-w-4xl mx-auto flex flex-col justify-between font-ui relative overflow-hidden"
    >
      {/* Background Red Lip Kiss Marks */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
        {[
          { top: "5%", left: "10%", rotate: "12deg" },
          { top: "15%", right: "12%", rotate: "-18deg" },
          { top: "45%", left: "4%", rotate: "25deg" },
          { top: "60%", right: "6%", rotate: "-10deg" },
          { bottom: "8%", left: "15%", rotate: "15deg" },
          { bottom: "12%", right: "20%", rotate: "-22deg" },
        ].map((kiss, idx) => (
          <div
            key={idx}
            className="absolute text-5xl md:text-6xl"
            style={{ ...kiss, transform: `rotate(${kiss.rotate})` }}
          >
            💋
          </div>
        ))}
      </div>

      {/* Main Stationery Letter Card */}
      <motion.div
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        className="bg-[#F8F8F8] rounded-3xl p-8 md:p-14 shadow-2xl border border-gray-200/80 my-auto text-left relative z-10 max-w-3xl mx-auto w-full"
      >
        {/* Cursive Heading — uses partner name */}
        <h1 className="font-cursive text-3xl md:text-5xl font-extrabold text-[#A82846] mb-8 tracking-tight">
          Happy Valentine's Day,{" "}
          <span className="italic">{partnerName}</span>
        </h1>

        {/* Dynamic Letter Paragraphs */}
        <div className="space-y-6 text-[#2C2C2C] text-base md:text-lg font-serif leading-relaxed opacity-90">
          {paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Signature */}
        <div className="mt-12 text-right">
          <span className="font-cursive text-4xl md:text-5xl font-extrabold text-[#A82846]">
            Forever yours
          </span>
        </div>
      </motion.div>

      {/* Go Back Button */}
      <div className="w-full max-w-3xl mx-auto flex justify-start mt-6 z-20">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#E57388] hover:bg-[#d45e74] text-white font-extrabold px-8 py-3 rounded-full text-base shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          Go back
        </motion.button>
      </div>
    </motion.div>
  );
};
