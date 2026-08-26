"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Copy, Check, Link2, Image as ImageIcon, Music,
  FileText, Sparkles, Plus, Trash2, Upload, Eye, ExternalLink,
  Loader2, RefreshCw, AlertCircle
} from "lucide-react";
import { GiftData, encodeGiftData, extractYouTubeId, DEFAULT_GIFT_DATA } from "@/lib/giftData";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

interface CreateModalProps {
  onClose: () => void;
  /** Called immediately when the user clicks "Apply Changes" — updates the live view */
  onApply: (data: GiftData) => void;
  /** Initial data (current giftData state from page.tsx) */
  initialData?: GiftData;
}

interface PhotoItemState {
  id: string;
  previewUrl: string; // Data URL for instant local preview or hosted URL
  remoteUrl?: string; // Cloudinary secure_url once upload completes
  status: "uploading" | "done" | "error";
  error?: string;
  file?: File;
}

export const CreateModal: React.FC<CreateModalProps> = ({ onClose, onApply, initialData }) => {
  const [form, setForm] = useState<GiftData>({
    ...(initialData ?? DEFAULT_GIFT_DATA),
  });

  // Track photo upload states explicitly
  const [photoItems, setPhotoItems] = useState<PhotoItemState[]>(() => {
    const initialPhotos = initialData?.photos ?? DEFAULT_GIFT_DATA.photos;
    return initialPhotos.map((url, idx) => ({
      id: `initial-${idx}-${Date.now()}`,
      previewUrl: url,
      remoteUrl: url.startsWith("http") ? url : undefined,
      status: url.startsWith("http") ? "done" : "done",
    }));
  });

  const [photoInput, setPhotoInput] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [shortening, setShortening] = useState(false);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const [activeTab, setActiveTab] = useState<"name" | "photos" | "music" | "letter">("name");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync photoItems -> form.photos (only completed/hosted URLs or valid preview URLs)
  useEffect(() => {
    const completedPhotos = photoItems
      .filter((p) => p.status === "done" && (p.remoteUrl || p.previewUrl))
      .map((p) => p.remoteUrl || p.previewUrl);
    setForm((prev) => ({ ...prev, photos: completedPhotos }));
  }, [photoItems]);

  const isUploadingAny = photoItems.some((p) => p.status === "uploading");
  const uploadingCount = photoItems.filter((p) => p.status === "uploading").length;
  const hasUploadErrors = photoItems.some((p) => p.status === "error");

  // ─── Photo: paste URL ─────────────────────────────────────────────────────
  const addPhotoUrl = () => {
    const url = photoInput.trim();
    if (url && !photoItems.some((p) => p.previewUrl === url || p.remoteUrl === url)) {
      const newItem: PhotoItemState = {
        id: `url-${Date.now()}-${Math.random()}`,
        previewUrl: url,
        remoteUrl: url,
        status: "done",
      };
      setPhotoItems((prev) => [...prev, newItem]);
    }
    setPhotoInput("");
  };

  // ─── Cloudinary Upload Task ────────────────────────────────────────────────
  const startCloudinaryUpload = async (item: PhotoItemState) => {
    if (!item.file) return;
    try {
      const secureUrl = await uploadImageToCloudinary(item.file);
      setPhotoItems((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? { ...p, status: "done", remoteUrl: secureUrl, previewUrl: secureUrl, error: undefined }
            : p
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setPhotoItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: "error", error: msg } : p))
      );
    }
  };

  // ─── Photo: file select -> instant preview + Cloudinary upload ──────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const MAX = 5 * 1024 * 1024; // 5 MB per file
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files are supported.");
        return;
      }
      if (file.size > MAX) {
        setUploadError(`"${file.name}" is too large. Max 5 MB per photo.`);
        return;
      }

      const itemId = `upload-${Date.now()}-${Math.random()}`;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const localDataUrl = ev.target?.result as string;
        if (localDataUrl) {
          const newItem: PhotoItemState = {
            id: itemId,
            previewUrl: localDataUrl,
            status: "uploading",
            file,
          };
          setPhotoItems((prev) => [...prev, newItem]);
          // Immediately start Cloudinary POST request
          startCloudinaryUpload(newItem);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const retryUpload = (item: PhotoItemState) => {
    setPhotoItems((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: "uploading", error: undefined } : p))
    );
    startCloudinaryUpload(item);
  };

  const removePhoto = (id: string) => {
    setPhotoItems((prev) => prev.filter((p) => p.id !== id));
  };

  // ─── Apply changes live ────────────────────────────────────────────────────
  const handleApply = () => {
    onApply(form);
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 1000);
  };

  // ─── Generate shareable link ───────────────────────────────────────────────
  const handleGenerateLink = () => {
    if (isUploadingAny) return;
    const shareableForm: GiftData = {
      ...form,
      photos: photoItems
        .filter((p) => p.status === "done" && p.remoteUrl && p.remoteUrl.startsWith("http"))
        .map((p) => p.remoteUrl!),
    };
    const encoded = encodeGiftData(shareableForm);
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const url = encoded ? `${baseUrl}?data=${encoded}` : baseUrl;
    setGeneratedLink(url);
  };

  const handleShortenLink = async () => {
    if (!generatedLink || shortening || generatedLink.includes("tinyurl.com")) return;
    setShortening(true);
    try {
      const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(generatedLink)}`);
      if (res.ok) {
        const shortUrl = await res.text();
        if (shortUrl && shortUrl.startsWith("http")) {
          setGeneratedLink(shortUrl.trim());
        }
      }
    } catch {
      // Fallback to original compressed URL
    } finally {
      setShortening(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.getElementById("share-link-input") as HTMLInputElement | null;
      if (el) {
        el.select();
        document.execCommand("copy");
      }
    }
  };

  // ─── YouTube preview ID ────────────────────────────────────────────────────
  const previewVideoId = extractYouTubeId(form.youtubeUrl);
  const previewEmbedSrc = `https://www.youtube-nocookie.com/embed/${previewVideoId}?autoplay=0&controls=1`;

  // ─── Tabs ──────────────────────────────────────────────────────────────────
  const tabs = [
    { id: "name", label: "Partner", icon: Sparkles },
    { id: "photos", label: "Photos", icon: ImageIcon },
    { id: "music", label: "Music", icon: Music },
    { id: "letter", label: "Letter", icon: FileText },
  ] as const;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl shadow-2xl border border-pink-100 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] px-6 py-5 flex items-center justify-between flex-shrink-0">
            <div>
              <h2 className="text-xl font-extrabold text-white">Customize & Share 🎁</h2>
              <p className="text-white/80 text-xs mt-0.5">
                Personalize your gift — changes apply instantly!
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Tab Navigation ─────────────────────────────────────────────── */}
          <div className="flex border-b border-pink-100 bg-[#FFF5F7] flex-shrink-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "text-[#FF4D6D] border-b-2 border-[#FF4D6D] bg-white"
                      : "text-[#4A3E4E]/60 hover:text-[#FF4D6D]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === "photos" && isUploadingAny && (
                    <Loader2 className="w-3 h-3 text-[#FF4D6D] animate-spin inline ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Tab Content (scrollable) ────────────────────────────────────── */}
          <div className="overflow-y-auto flex-1 px-6 py-5">
            <AnimatePresence mode="wait">

              {/* TAB 1 — Partner Name ───────────────────────────────────────── */}
              {activeTab === "name" && (
                <motion.div
                  key="name"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-extrabold text-[#4A3E4E] mb-2">
                      💝 Partner's Name
                    </label>
                    <p className="text-xs text-[#4A3E4E]/60 mb-3">Used in the Love Letter greeting.</p>
                    <input
                      type="text"
                      value={form.partnerName}
                      onChange={(e) => setForm((prev) => ({ ...prev, partnerName: e.target.value }))}
                      placeholder="My Love"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-[#FF4D6D] focus:outline-none text-[#4A3E4E] font-semibold text-base bg-white transition-colors"
                    />
                  </div>
                  <div className="bg-[#FFF5F7] rounded-2xl p-4 border border-pink-100 text-sm text-[#4A3E4E]/70">
                    <strong className="text-[#FF4D6D]">Preview:</strong> "Happy Valentine's Day,{" "}
                    <span className="italic font-bold text-[#A82846]">{form.partnerName || "My Love"}</span>!"
                  </div>
                </motion.div>
              )}

              {/* TAB 2 — Photos ─────────────────────────────────────────────── */}
              {activeTab === "photos" && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-extrabold text-[#4A3E4E] mb-1">
                      📸 Add Your Photos
                    </label>
                    <p className="text-xs text-[#4A3E4E]/60 mb-3">
                      Upload photos from your device <strong>or</strong> paste a direct image URL.
                    </p>

                    {/* File Upload Button */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-pink-300 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#FF4D6D] hover:bg-pink-50/50 transition-all mb-3"
                    >
                      <Upload className="w-7 h-7 text-[#FF4D6D]" />
                      <span className="text-sm font-extrabold text-[#FF4D6D]">Click to Upload Photos</span>
                      <span className="text-xs text-[#4A3E4E]/50">JPG, PNG, WebP · Max 5 MB each</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </div>

                    {uploadError && (
                      <p className="text-xs text-red-500 font-semibold mb-2">{uploadError}</p>
                    )}

                    {/* URL Paste Row */}
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={photoInput}
                        onChange={(e) => setPhotoInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addPhotoUrl()}
                        placeholder="Or paste image URL…"
                        className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-pink-200 focus:border-[#FF4D6D] focus:outline-none text-[#4A3E4E] text-sm bg-white transition-colors"
                      />
                      <button
                        onClick={addPhotoUrl}
                        className="bg-[#FF4D6D] text-white px-4 py-2.5 rounded-2xl font-bold text-sm hover:bg-[#e03a58] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>

                  {/* Photo List */}
                  {photoItems.length > 0 ? (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {photoItems.map((item, idx) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 bg-[#FFF5F7] rounded-xl p-2.5 border border-pink-100 relative"
                        >
                          <div className="relative w-12 h-10 flex-shrink-0">
                            <img
                              src={item.previewUrl}
                              alt={`Photo ${idx + 1}`}
                              className="w-full h-full object-cover rounded-lg border border-pink-200"
                            />
                            {item.status === "uploading" && (
                              <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <span className="text-xs text-[#4A3E4E]/80 truncate font-medium">
                              {item.file ? item.file.name : item.previewUrl}
                            </span>

                            {item.status === "uploading" && (
                              <span className="text-[10px] font-bold text-[#FF4D6D] flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" /> Uploading to Cloudinary…
                              </span>
                            )}

                            {item.status === "done" && (
                              <span className="text-[10px] font-bold text-[#2EC4B6] flex items-center gap-1">
                                <Check className="w-3 h-3" /> Hosted on Cloudinary
                              </span>
                            )}

                            {item.status === "error" && (
                              <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {item.error || "Upload failed"}
                              </span>
                            )}
                          </div>

                          {item.status === "error" && item.file && (
                            <button
                              onClick={() => retryUpload(item)}
                              title="Retry Upload"
                              className="text-[#2EC4B6] hover:text-[#25ab9e] p-1 transition-colors cursor-pointer flex-shrink-0"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => removePhoto(item.id)}
                            title="Remove photo"
                            className="text-[#FF4D6D] hover:text-[#e03a58] p-1 transition-colors cursor-pointer flex-shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#FFF5F7] rounded-2xl p-6 text-center border border-pink-100 text-[#4A3E4E]/50 text-sm">
                      No photos yet. Upload from your device or paste a URL above.
                    </div>
                  )}

                  {hasUploadErrors && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      Some photo uploads failed. Retry or delete them before generating a link.
                    </p>
                  )}
                </motion.div>
              )}

              {/* TAB 3 — Music ──────────────────────────────────────────────── */}
              {activeTab === "music" && (
                <motion.div
                  key="music"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-extrabold text-[#4A3E4E] mb-1">
                      🎵 YouTube Video URL
                    </label>
                    <p className="text-xs text-[#4A3E4E]/60 mb-3">
                      Paste any YouTube link — full URL, short link, or bare video ID.
                    </p>
                    <input
                      type="text"
                      value={form.youtubeUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, youtubeUrl: e.target.value }))}
                      placeholder="https://youtu.be/VIDEO_ID  or  https://www.youtube.com/watch?v=…"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-[#FF4D6D] focus:outline-none text-[#4A3E4E] text-sm font-semibold bg-white transition-colors"
                    />
                  </div>

                  {form.youtubeUrl && previewVideoId && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#4A3E4E]/70 bg-[#FFF5F7] rounded-xl p-3 border border-pink-100">
                        <span className="text-[#FF4D6D] font-bold">Detected Video ID:</span>
                        <code className="font-mono bg-pink-100 px-2 py-0.5 rounded text-[#A82846]">
                          {previewVideoId}
                        </code>
                        <a
                          href={`https://www.youtube.com/watch?v=${previewVideoId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto text-[#2EC4B6] hover:underline flex items-center gap-1 font-bold"
                        >
                          Open <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Embedded preview */}
                      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-pink-200 shadow-sm bg-black">
                        <iframe
                          key={previewVideoId}
                          className="w-full h-full"
                          src={previewEmbedSrc}
                          title="YouTube preview"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4 — Love Letter ─────────────────────────────────────────── */}
              {activeTab === "letter" && (
                <motion.div
                  key="letter"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-extrabold text-[#4A3E4E] mb-1">
                      💌 Your Love Letter
                    </label>
                    <p className="text-xs text-[#4A3E4E]/60 mb-3">
                      Separate paragraphs with a blank line. Appears on the stationery card.
                    </p>
                    <textarea
                      value={form.letterContent}
                      onChange={(e) => setForm((prev) => ({ ...prev, letterContent: e.target.value }))}
                      rows={9}
                      placeholder="Write your heartfelt message here…"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-[#FF4D6D] focus:outline-none text-[#4A3E4E] text-sm bg-white transition-colors resize-none leading-relaxed font-serif"
                    />
                    <p className="text-right text-xs text-[#4A3E4E]/40 mt-1">
                      {form.letterContent.length} characters
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ── Footer ─────────────────────────────────────────────────────── */}
          <div className="border-t border-pink-100 p-5 space-y-3 bg-[#FFF5F7] flex-shrink-0">

            {/* PRIMARY: Apply changes immediately */}
            <motion.button
              onClick={handleApply}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`w-full font-extrabold py-3.5 rounded-2xl text-base shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                applied
                  ? "bg-[#2EC4B6] text-white"
                  : "bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] text-white"
              }`}
            >
              {applied ? (
                <>
                  <Check className="w-5 h-5" /> Applied! Closing…
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" /> Apply Changes & Preview Now
                </>
              )}
            </motion.button>

            {/* SECONDARY: Generate shareable link */}
            {!generatedLink ? (
              <button
                onClick={handleGenerateLink}
                disabled={isUploadingAny}
                className={`w-full border-2 font-extrabold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all ${
                  isUploadingAny
                    ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "border-[#FF4D6D] text-[#FF4D6D] hover:bg-pink-50 cursor-pointer"
                }`}
              >
                {isUploadingAny ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FF4D6D]" />
                    Uploading photos ({uploadingCount} left)…
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4" /> Generate Shareable Link ✨
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    id="share-link-input"
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-pink-200 text-xs text-[#4A3E4E] font-mono bg-white focus:outline-none"
                  />
                  {!generatedLink.includes("tinyurl.com") && (
                    <motion.button
                      onClick={handleShortenLink}
                      disabled={shortening}
                      whileTap={{ scale: 0.92 }}
                      className="px-3 py-2.5 rounded-2xl border-2 border-pink-200 hover:border-[#FF4D6D] bg-white font-bold text-xs text-[#FF4D6D] flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                      title="Make link even shorter using TinyURL"
                    >
                      {shortening ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Shorten ✂️"}
                    </motion.button>
                  )}
                  <motion.button
                    onClick={handleCopy}
                    whileTap={{ scale: 0.92 }}
                    className={`px-4 py-2.5 rounded-2xl font-extrabold text-sm flex items-center gap-2 cursor-pointer transition-all ${
                      copied ? "bg-[#2EC4B6] text-white" : "bg-[#FF4D6D] text-white hover:bg-[#e03a58]"
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </motion.button>
                </div>
                <p className="text-xs text-center text-[#2EC4B6] font-bold">
                  ✅ Share this link — your partner's experience will be personalized for them!
                </p>
                <button
                  onClick={() => setGeneratedLink("")}
                  className="w-full text-xs text-[#4A3E4E]/50 hover:text-[#FF4D6D] font-semibold underline transition-colors cursor-pointer"
                >
                  Edit and regenerate
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
