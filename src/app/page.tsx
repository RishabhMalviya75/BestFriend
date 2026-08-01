"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ProposalState } from "@/components/ProposalState";
import { GiftHubState, GiftType } from "@/components/GiftHubState";
import { PhotoMemoriesView } from "@/components/PhotoMemoriesView";
import { MusicPlayerView } from "@/components/MusicPlayerView";
import { LoveLetterView } from "@/components/LoveLetterView";
import { CreateModal } from "@/components/CreateModal";
import { Heart, Wand2 } from "lucide-react";
import { GiftData, DEFAULT_GIFT_DATA, decodeGiftData } from "@/lib/giftData";

type AppState = "PROPOSAL" | "GIFT_HUB" | "GIFT_PHOTOS" | "GIFT_MUSIC" | "GIFT_LETTER";

function AppContent() {
  const searchParams = useSearchParams();

  // Parse GiftData from URL ?data= param at mount time
  const getInitialData = (): GiftData => {
    const encoded = searchParams.get("data");
    if (encoded) {
      const decoded = decodeGiftData(encoded);
      if (decoded) return decoded;
    }
    return { ...DEFAULT_GIFT_DATA };
  };

  // giftData is mutable — the CreateModal can update it live via setGiftData
  const [giftData, setGiftData] = useState<GiftData>(getInitialData);
  const [currentState, setCurrentState] = useState<AppState>("PROPOSAL");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isCustomized =
    !!searchParams.get("data") ||
    giftData.partnerName !== DEFAULT_GIFT_DATA.partnerName ||
    giftData.photos.length > 0 ||
    giftData.youtubeUrl !== DEFAULT_GIFT_DATA.youtubeUrl ||
    giftData.letterContent !== DEFAULT_GIFT_DATA.letterContent;

  const handleProposalAccept = () => setCurrentState("GIFT_HUB");

  const handleSelectGift = (gift: GiftType) => {
    if (gift === "photos") setCurrentState("GIFT_PHOTOS");
    else if (gift === "music") setCurrentState("GIFT_MUSIC");
    else if (gift === "letter") setCurrentState("GIFT_LETTER");
  };

  const handleBackToHub = () => setCurrentState("GIFT_HUB");

  // Called by CreateModal when user clicks "Apply Changes & Preview Now"
  const handleApplyGiftData = (data: GiftData) => {
    setGiftData(data);
  };

  return (
    <main className="min-h-screen bg-[#FFF5F7] text-[#4A3E4E] relative overflow-hidden flex flex-col justify-between selection:bg-[#FF4D6D] selection:text-white">
      {/* Header Bar */}
      <header className="w-full py-4 px-6 flex items-center justify-between z-30 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-[#FF4D6D] text-white flex items-center justify-center shadow-md pink-glow">
            <Heart className="w-5 h-5 fill-white text-white" />
          </div>
          <span className="font-extrabold text-lg md:text-xl text-[#FF4D6D] tracking-tight">
            LoveProposal <span className="text-[#2EC4B6]">💕</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Personalized badge */}
          {isCustomized && currentState !== "PROPOSAL" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-pink-200 shadow-sm text-xs font-extrabold text-[#4A3E4E]"
            >
              <span className="w-2 h-2 rounded-full bg-[#2EC4B6] animate-ping" />
              Personalized Gift Active ✨
            </motion.div>
          )}

          {/* Customize & Share button */}
          <motion.button
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] text-white font-extrabold px-4 py-2 rounded-full text-xs md:text-sm shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Wand2 className="w-4 h-4" />
            <span className="hidden sm:inline">Customize & Share</span>
            <span className="sm:hidden">✏️</span>
          </motion.button>
        </div>
      </header>

      {/* Main Dynamic View */}
      <div className="flex-1 flex flex-col justify-center z-10 py-4">
        <AnimatePresence mode="wait">
          {currentState === "PROPOSAL" && (
            <ProposalState key="proposal" onAccept={handleProposalAccept} />
          )}

          {currentState === "GIFT_HUB" && (
            <GiftHubState key="gift_hub" onSelectGift={handleSelectGift} />
          )}

          {currentState === "GIFT_PHOTOS" && (
            <PhotoMemoriesView
              key="gift_photos"
              onBack={handleBackToHub}
              photos={giftData.photos}
            />
          )}

          {currentState === "GIFT_MUSIC" && (
            <MusicPlayerView
              key="gift_music"
              onBack={handleBackToHub}
              youtubeUrl={giftData.youtubeUrl}
            />
          )}

          {currentState === "GIFT_LETTER" && (
            <LoveLetterView
              key="gift_letter"
              onBack={handleBackToHub}
              partnerName={giftData.partnerName}
              letterContent={giftData.letterContent}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-semibold text-[#4A3E4E]/50 z-20">
        Made with ❤️ for someone very special • Forever & Always
      </footer>

      {/* Customize & Share Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateModal
            onClose={() => setShowCreateModal(false)}
            onApply={handleApplyGiftData}
            initialData={giftData}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
          <div className="text-[#FF4D6D] font-extrabold text-2xl animate-pulse">
            Loading your gift… 💕
          </div>
        </div>
      }
    >
      <AppContent />
    </Suspense>
  );
}
