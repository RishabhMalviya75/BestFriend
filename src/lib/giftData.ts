// src/lib/giftData.ts
// Central GiftData interface and utilities for URL encoding/decoding
import LZString from "lz-string";

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

/** Compact internal interface for URL encoding to minimize JSON footprint */
interface CompactGiftData {
  n?: string; // partnerName
  p?: string[]; // photos
  y?: string; // youtubeUrl
  l?: string; // letterContent
}

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
 * Encodes GiftData into a compact, compressed URL-safe string.
 * Omits unchanged default values, uses single-character JSON keys,
 * and compresses using LZ-String for maximum URL length reduction.
 */
export function encodeGiftData(data: GiftData): string {
  const sanitizedPhotos = (data.photos || []).filter(
    (url) => typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://"))
  );

  const compact: CompactGiftData = {};

  const cleanName = (data.partnerName || "").trim();
  if (cleanName && cleanName !== DEFAULT_GIFT_DATA.partnerName) {
    compact.n = cleanName;
  }

  if (sanitizedPhotos.length > 0) {
    compact.p = sanitizedPhotos;
  }

  const extractedYt = extractYouTubeId(data.youtubeUrl);
  if (extractedYt && extractedYt !== DEFAULT_GIFT_DATA.youtubeUrl) {
    compact.y = extractedYt;
  }

  const cleanLetter = (data.letterContent || "").trim();
  if (cleanLetter && cleanLetter !== DEFAULT_GIFT_DATA.letterContent) {
    compact.l = cleanLetter;
  }

  const json = JSON.stringify(compact);
  return LZString.compressToEncodedURIComponent(json);
}

/**
 * Decodes a compressed or legacy base64 string back into GiftData.
 * Fully backward-compatible with older Base64 encoded links.
 */
export function decodeGiftData(encoded: string): GiftData | null {
  if (!encoded) return null;

  let jsonStr: string | null = null;

  // 1. Try LZString decompression
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encoded);
    if (decompressed && (decompressed.startsWith("{") || decompressed.startsWith("["))) {
      jsonStr = decompressed;
    }
  } catch {
    // Ignore LZ-string decompression errors
  }

  // 2. Fallback for legacy Base64 encoded URLs
  if (!jsonStr) {
    try {
      jsonStr = decodeURIComponent(atob(encoded));
    } catch {
      try {
        jsonStr = atob(encoded);
      } catch {
        jsonStr = null;
      }
    }
  }

  if (!jsonStr) return null;

  try {
    const parsed = JSON.parse(jsonStr) as Record<string, any>;
    if (typeof parsed !== "object" || parsed === null) return null;

    // Handle both compact keys (n, p, y, l) and legacy full keys
    const partnerName = parsed.n || parsed.partnerName || DEFAULT_GIFT_DATA.partnerName;
    const youtubeUrl = parsed.y || parsed.youtubeUrl || DEFAULT_GIFT_DATA.youtubeUrl;
    const letterContent = parsed.l || parsed.letterContent || DEFAULT_GIFT_DATA.letterContent;
    
    const rawPhotos = parsed.p || parsed.photos || [];
    const validPhotos = Array.isArray(rawPhotos)
      ? rawPhotos.filter((url) => typeof url === "string" && (url.startsWith("http://") || url.startsWith("https://")))
      : [];

    return {
      partnerName,
      photos: validPhotos,
      youtubeUrl,
      letterContent,
    };
  } catch {
    return null;
  }
}


