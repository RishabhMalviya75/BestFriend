"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X, Sparkles } from "lucide-react";

interface PhotoMemoriesViewProps {
  onBack: () => void;
  photos?: string[]; // Dynamic photo URLs from GiftData
}

interface PhotoItem {
  id: string;
  url?: string;    // Dynamic URL if provided
  gradient: string;
  emoji: string;
  title: string;
}

// Fallback gradient photos used when no custom URLs are provided
const FALLBACK_PHOTOS: Omit<PhotoItem, "id">[] = [
  { title: "Sunset Walk 🌅", gradient: "from-amber-200 via-rose-300 to-pink-300", emoji: "🌅" },
  { title: "Coffee Date ☕", gradient: "from-orange-200 via-[#FFCCD5] to-[#FF8FA3]", emoji: "☕" },
  { title: "Stargazing 🌌", gradient: "from-indigo-200 to-purple-300", emoji: "🌌" },
  { title: "Rainy Day ☔", gradient: "from-sky-200 to-indigo-200", emoji: "☔" },
  { title: "Road Trip 🚗", gradient: "from-emerald-200 to-teal-300", emoji: "🚗" },
  { title: "Surprise Flowers 💐", gradient: "from-emerald-100 via-teal-200 to-cyan-200", emoji: "💐" },
  { title: "Silly Selfie ✌️", gradient: "from-rose-200 to-pink-300", emoji: "✌️" },
  { title: "Movie Night 🎬", gradient: "from-amber-100 to-rose-200", emoji: "🎬" },
  { title: "Forever & Always 💕", gradient: "from-[#FF4D6D] via-[#FF758F] to-[#FFB3C1]", emoji: "💖" },
];

function buildPhotos(photos: string[]): PhotoItem[] {
  if (photos.length > 0) {
    return photos.map((url, i) => ({
      id: `custom-${i}`,
      url,
      title: `Memory ${i + 1}`,
      gradient: FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length].gradient,
      emoji: FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length].emoji,
    }));
  }
  return FALLBACK_PHOTOS.map((p, i) => ({ ...p, id: `fallback-${i}` }));
}

function splitIntoColumns<T>(items: T[], cols: number): T[][] {
  const result: T[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => result[i % cols].push(item));
  return result;
}

export const PhotoMemoriesView: React.FC<PhotoMemoriesViewProps> = ({ onBack, photos = [] }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const allPhotos = buildPhotos(photos);
  const [col1, col2, col3] = splitIntoColumns(allPhotos, 3);

  const PhotoCardContent = ({ photo }: { photo: PhotoItem }) => (
    <div className={`w-full h-full flex items-center justify-center relative overflow-hidden`}>
      {photo.url ? (
        <img
          src={photo.url}
          alt={photo.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            if (target.nextSibling) (target.nextSibling as HTMLElement).style.display = "flex";
          }}
        />
      ) : null}
      {/* Gradient Fallback (always rendered, hidden when image loads) */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${photo.gradient} flex flex-col items-center justify-center`}
        style={{ display: photo.url ? "none" : "flex" }}
      >
        <svg viewBox="0 0 100 60" className="absolute bottom-0 w-full h-1/2 opacity-70">
          <path d="M 0 40 Q 25 20 50 35 Q 75 50 100 30 L 100 60 L 0 60 Z" fill="#6B8E23" />
        </svg>
        <span className="text-3xl z-10">{photo.emoji}</span>
      </div>
    </div>
  );

  const renderPolaroid = (photo: PhotoItem, rotation: string) => (
    <motion.div
      key={photo.id}
      whileHover={{ scale: 1.04, rotate: 0 }}
      onClick={() => setSelectedPhoto(photo)}
      className={`bg-white p-3 rounded-xl shadow-md cursor-pointer border border-gray-100 ${rotation} w-full max-w-[240px] mx-auto transition-all duration-300`}
    >
      <div className="w-full h-40 md:h-48 rounded-md overflow-hidden shadow-inner">
        <PhotoCardContent photo={photo} />
      </div>
      <div className="h-6" />
    </motion.div>
  );

  const renderStripPhoto = (photo: PhotoItem) => (
    <div
      key={photo.id}
      onClick={() => setSelectedPhoto(photo)}
      className="w-full h-20 md:h-24 rounded overflow-hidden cursor-pointer shadow-inner"
    >
      <PhotoCardContent photo={photo} />
    </div>
  );

  // Identify strip vs polaroid photos
  const strip1 = col2.slice(0, 4);
  const strip2 = col2.slice(4, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-8 max-w-6xl mx-auto flex flex-col font-ui relative"
    >
      {/* Sparkles */}
      <div className="absolute top-12 left-1/4 text-pink-300 text-xl pointer-events-none select-none">✨</div>
      <div className="absolute top-20 right-1/4 text-pink-300 text-xl pointer-events-none select-none">✨</div>
      <div className="absolute bottom-32 left-1/3 text-pink-300 text-xl pointer-events-none select-none">✨</div>

      <div className="w-full flex justify-start mb-6">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#FF4D6D] hover:bg-[#e03a58] text-white font-extrabold px-6 py-2.5 rounded-full text-sm shadow-md flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back
        </motion.button>
      </div>

      {/* 3 Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto w-full">
        {/* LEFT COLUMN: polaroids */}
        <div className="lg:col-span-4 flex flex-col items-center gap-6">
          <div className="space-y-4 w-full flex flex-col items-center">
            {col1.slice(0, 2).map((photo, i) =>
              renderPolaroid(photo, i % 2 === 0 ? "-rotate-3" : "rotate-3")
            )}
          </div>
          <h2 className="font-cursive text-3xl md:text-4xl font-bold text-[#A82846] text-center mt-2">
            memories with you
          </h2>
        </div>

        {/* MIDDLE COLUMN: two photo strips */}
        <div className="lg:col-span-4 flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-3 w-full">
            <motion.div
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="bg-white p-2.5 rounded-lg shadow-md border border-gray-200 -rotate-2 flex flex-col gap-3 w-32 md:w-36"
            >
              {(strip1.length ? strip1 : col1.slice(0, 4)).map((p) => renderStripPhoto(p))}
            </motion.div>
            <motion.div
              whileHover={{ rotate: 0, scale: 1.02 }}
              className="bg-white p-2.5 rounded-lg shadow-md border border-gray-200 rotate-2 flex flex-col gap-3 w-32 md:w-36"
            >
              {(strip2.length ? strip2 : col3.slice(0, 4)).map((p) => renderStripPhoto(p))}
            </motion.div>
          </div>
          <h2 className="font-cursive text-3xl md:text-4xl font-bold text-[#A82846] text-center mt-2">
            Captured memories
          </h2>
        </div>

        {/* RIGHT COLUMN: polaroids */}
        <div className="lg:col-span-4 flex flex-col items-center gap-6">
          <div className="space-y-4 w-full flex flex-col items-center">
            {col3.slice(0, 2).map((photo, i) =>
              renderPolaroid(photo, i % 2 === 0 ? "rotate-2" : "-rotate-3")
            )}
          </div>
          <h2 className="font-cursive text-3xl md:text-4xl font-bold text-[#A82846] text-center mt-2">
            us, in frames
          </h2>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative text-center"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-full h-56 rounded-xl overflow-hidden mb-4">
                {selectedPhoto.url ? (
                  <img src={selectedPhoto.url} alt={selectedPhoto.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${selectedPhoto.gradient} flex items-center justify-center relative`}>
                    <svg viewBox="0 0 100 60" className="absolute bottom-0 w-full h-1/2 opacity-70">
                      <path d="M 0 40 Q 25 20 50 35 Q 75 50 100 30 L 100 60 L 0 60 Z" fill="#6B8E23" />
                    </svg>
                    <span className="text-5xl z-10 animate-bounce">{selectedPhoto.emoji}</span>
                  </div>
                )}
              </div>
              <h3 className="font-cursive text-3xl font-bold text-[#A82846]">
                {selectedPhoto.title}
              </h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
