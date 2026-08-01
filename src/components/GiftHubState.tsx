"use client";

import React from "react";
import { motion } from "framer-motion";
import { CatHeartSticker, GiftBoxSticker } from "./CuteStickers";

export type GiftType = "photos" | "music" | "letter";

interface GiftHubStateProps {
  onSelectGift: (gift: GiftType) => void;
}

export const GiftHubState: React.FC<GiftHubStateProps> = ({ onSelectGift }) => {
  const gifts = [
    { id: "photos" as GiftType, label: "GIFT 1" },
    { id: "music" as GiftType, label: "GIFT 2" },
    { id: "letter" as GiftType, label: "GIFT 3" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 max-w-4xl mx-auto text-center font-ui"
    >
      {/* Header Title matching Image 4 */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-5xl font-extrabold text-[#C93B57] tracking-tight mb-2 flex items-center justify-center gap-2"
      >
        I knew you'd say yes <span className="text-[#FF4D6D]">❤️</span>
      </motion.h1>

      {/* GIF matching Image 4 */}
      <div className="mb-6">
        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGgxeHR2ZG1qdXp4ZWY5bGozam5keDh5YjM5ZHY3dnFwdnF5ZzFxcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Kep0eJcSyu126vIlND/giphy.gif"
          alt="Cute Hugging Cat GIF"
          className="w-48 h-48 md:w-60 md:h-60 object-contain mx-auto rounded-3xl drop-shadow-md select-none"
        />
      </div>

      {/* 3 Pink Gift Cards Matching Image 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 w-full max-w-3xl px-4">
        {gifts.map((gift, index) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.15, duration: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectGift(gift.id)}
            className="bg-[#FFCCD5]/60 border border-[#FFA6B9]/80 rounded-3xl p-6 md:p-8 flex flex-col items-center justify-between cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 min-h-[220px]"
          >
            {/* Gift Box Graphic */}
            <div className="my-auto">
              <GiftBoxSticker />
            </div>

            {/* Label GIFT 1 / GIFT 2 / GIFT 3 */}
            <h3 className="text-xl md:text-2xl font-black text-[#A82846] mt-4 tracking-wide">
              {gift.label}
            </h3>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
