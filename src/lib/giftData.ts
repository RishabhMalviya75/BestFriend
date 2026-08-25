// src/lib/giftData.ts
// Central GiftData interface and utilities for URL encoding/decoding

export interface GiftData {
  partnerName: string;
  photos: string[];
  youtubeUrl: string;
  letterContent: string;
}

export const DEFAULT_GIFT_DATA: GiftData = {
  partnerName: "My Love",
  photos: [],
  youtubeUrl: "HgGAzBDE454",
  letterContent: `Today is Valentine's Day, and I just want you to know how grateful I am to have you in my life. From the moment you came into my world, everything felt warmer, kinder, and more meaningful. You make ordinary moments feel special just by being you. No matter where life takes us, you will always be my favorite place to be. Loving you is the easiest and most wonderful thing I know.

Being with you feels like home. In the quiet moments and the loud ones, in laughter and in silence, I find comfort in you. You make me feel understood, supported, and deeply loved, and that is something I will never take for granted.`,
};

/**
 * Extracts the YouTube video ID from various URL formats or plain IDs.
 * Supports: full URLs, youtu.be shortlinks, and bare video IDs.
 */
export function extractYouTubeId(input: string): string {
  if (!input) return DEFAULT_GIFT_DATA.youtubeUrl;
  // Already a clean ID (11 chars alphanumeric/dash/underscore)
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  // youtu.be/ID
  const shortMatch = input.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  // youtube.com/watch?v=ID or /embed/ID
  const longMatch = input.match(/(?:v=|\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (longMatch) return longMatch[1];
  // Fallback: return input as-is (could be an ID already)
  return input.trim();
}

/**
 * Encodes GiftData into a base64 URL-safe string for sharing.
 * Defensively filters out any base64 Data URLs so they never bloat the payload.
 */
export function encodeGiftData(data: GiftData): string {
  const sanitizedPhotos = (data.photos || []).filter(
    (url) => typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))
  );
  const cleanData: GiftData = {
    ...data,
    photos: sanitizedPhotos,
  };
  const json = JSON.stringify(cleanData);
  if (typeof window !== "undefined") {
    return btoa(encodeURIComponent(json));
  }
  return "";
}

/**
 * Decodes a base64 URL-safe string back into GiftData.
 * Returns null if decoding fails.
 */
export function decodeGiftData(encoded: string): GiftData | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(json) as GiftData;
    if (!parsed.partnerName || !parsed.youtubeUrl) return null;
    const validPhotos = Array.isArray(parsed.photos)
      ? parsed.photos.filter((url) => typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://")))
      : [];
    return {
      partnerName: parsed.partnerName || DEFAULT_GIFT_DATA.partnerName,
      photos: validPhotos,
      youtubeUrl: parsed.youtubeUrl || DEFAULT_GIFT_DATA.youtubeUrl,
      letterContent: parsed.letterContent || DEFAULT_GIFT_DATA.letterContent,
    };
  } catch {
    return null;
  }
}

