"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Copy, Check, Link2, Image as ImageIcon, Music,
  FileText, Sparkles, Plus, Trash2, Upload, Eye, ExternalLink
} from "lucide-react";
import { GiftData, encodeGiftData, extractYouTubeId, DEFAULT_GIFT_DATA } from "@/lib/giftData";

interface CreateModalProps {
  onClose: () => void;
  /** Called immediately when the user clicks "Apply Changes" — updates the live view */
  onApply: (data: GiftData) => void;
  /** Initial data (current giftData state from page.tsx) */
  initialData?: GiftData;
}

export const CreateModal: React.FC<CreateModalProps> = ({ onClose, onApply, initialData }) => {
  const [form, setForm] = useState<GiftData>({
    ...(initialData ?? DEFAULT_GIFT_DATA),
  });
  const [photoInput, setPhotoInput] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const [activeTab, setActiveTab] = useState<"name" | "photos" | "music" | "letter">("name");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Photo: paste URL ─────────────────────────────────────────────────────
  const addPhotoUrl = () => {
    const url = photoInput.trim();
    if (url && !form.photos.includes(url)) {
      setForm(prev => ({ ...prev, photos: [...prev.photos, url] }));
    }
    setPhotoInput("");
  };

  // ─── Photo: file upload → base64 data URL ─────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const MAX = 5 * 1024 * 1024; // 5 MB per file
    files.forEach(file => {
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files are supported.");
        return;
      }
      if (file.size > MAX) {
        setUploadError(`"${file.name}" is too large. Max 5 MB per photo.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        const dataUrl = ev.target?.result as string;
        if (dataUrl) {
          setForm(prev => ({
            ...prev,
            photos: [...prev.photos, dataUrl],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset file input so the same file can be re-added if removed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (idx: number) => {
    setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }));
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
    // For the shareable link we strip base64 photos (too large for a URL)
    // and only keep http/https URLs
    const shareableForm: GiftData = {
      ...form,
      photos: form.photos.filter(p => p.startsWith("http")),
    };
    const encoded = encodeGiftData(shareableForm);
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    setGeneratedLink(url);
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.getElementById("share-link-input") as HTMLInputElement | null;
      if (el) { el.select(); document.execCommand("copy"); }
    }
  };

  // ─── YouTube preview ID ────────────────────────────────────────────────────
  const previewVideoId = extractYouTubeId(form.youtubeUrl);
  const previewEmbedSrc = `https://www.youtube-nocookie.com/embed/${previewVideoId}?autoplay=0&controls=1`;

  // ─── Tabs ──────────────────────────────────────────────────────────────────
  const tabs = [
    { id: "name",   label: "Partner", icon: Sparkles },
    { id: "photos", label: "Photos",  icon: ImageIcon },
    { id: "music",  label: "Music",   icon: Music },
    { id: "letter", label: "Letter",  icon: FileText },
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
          onClick={e => e.stopPropagation()}
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
            {tabs.map(tab => {
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
                </button>
              );
            })}
          </div>

          {/* ── Tab Content (scrollable) ────────────────────────────────────── */}
          <div className="overflow-y-auto flex-1 px-6 py-5">
            <AnimatePresence mode="wait">

              {/* TAB 1 — Partner Name ───────────────────────────────────────── */}
              {activeTab === "name" && (
                <motion.div key="name" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-extrabold text-[#4A3E4E] mb-2">💝 Partner's Name</label>
                    <p className="text-xs text-[#4A3E4E]/60 mb-3">Used in the Love Letter greeting.</p>
                    <input
                      type="text"
                      value={form.partnerName}
                      onChange={e => setForm(prev => ({ ...prev, partnerName: e.target.value }))}
                      placeholder="My Love"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-[#FF4D6D] focus:outline-none text-[#4A3E4E] font-semibold text-base bg-white transition-colors"
                    />
                  </div>
                  <div className="bg-[#FFF5F7] rounded-2xl p-4 border border-pink-100 text-sm text-[#4A3E4E]/70">
                    <strong className="text-[#FF4D6D]">Preview:</strong>{" "}
                    "Happy Valentine's Day,{" "}
                    <span className="italic font-bold text-[#A82846]">{form.partnerName || "My Love"}</span>!"
                  </div>
                </motion.div>
              )}

              {/* TAB 2 — Photos ─────────────────────────────────────────────── */}
              {activeTab === "photos" && (
                <motion.div key="photos" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-extrabold text-[#4A3E4E] mb-1">📸 Add Your Photos</label>
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
                        onChange={e => setPhotoInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addPhotoUrl()}
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
                  {form.photos.length > 0 ? (
                    <div className="space-y-2 max-h-52 overflow-y-auto">
                      {form.photos.map((url, idx) => {
                        const isBase64 = url.startsWith("data:");
                        return (
                          <div key={idx} className="flex items-center gap-3 bg-[#FFF5F7] rounded-xl p-2.5 border border-pink-100">
                            <img
                              src={url}
                              alt={`Photo ${idx + 1}`}
                              className="w-12 h-10 object-cover rounded-lg border border-pink-200 flex-shrink-0"
                            />
                            <span className="flex-1 text-xs text-[#4A3E4E]/70 truncate font-medium">
                              {isBase64 ? `📷 Uploaded photo ${idx + 1}` : url}
                            </span>
                            {isBase64 && (
                              <span className="text-[8px] font-black text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200 flex-shrink-0">
                                LOCAL
                              </span>
                            )}
                            <button onClick={() => removePhoto(idx)} className="text-[#FF4D6D] hover:text-[#e03a58] p-1 transition-colors cursor-pointer flex-shrink-0">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="bg-[#FFF5F7] rounded-2xl p-6 text-center border border-pink-100 text-[#4A3E4E]/50 text-sm">
                      No photos yet. Upload from your device or paste a URL above.
                    </div>
                  )}

                  {form.photos.some(p => p.startsWith("data:")) && (
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl p-3">
                      ⚠️ <strong>LOCAL</strong> photos only appear in your current session. To share them, host the images online and paste the URLs instead.
                    </p>
                  )}
                </motion.div>
              )}

              {/* TAB 3 — Music ──────────────────────────────────────────────── */}
              {activeTab === "music" && (
                <motion.div key="music" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-extrabold text-[#4A3E4E] mb-1">🎵 YouTube Video URL</label>
                    <p className="text-xs text-[#4A3E4E]/60 mb-3">
                      Paste any YouTube link — full URL, short link, or bare video ID.
                    </p>
                    <input
                      type="text"
                      value={form.youtubeUrl}
                      onChange={e => setForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                      placeholder="https://youtu.be/VIDEO_ID  or  https://www.youtube.com/watch?v=…"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-[#FF4D6D] focus:outline-none text-[#4A3E4E] text-sm font-semibold bg-white transition-colors"
                    />
                  </div>

                  {form.youtubeUrl && previewVideoId && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#4A3E4E]/70 bg-[#FFF5F7] rounded-xl p-3 border border-pink-100">
                        <span className="text-[#FF4D6D] font-bold">Detected Video ID:</span>
                        <code className="font-mono bg-pink-100 px-2 py-0.5 rounded text-[#A82846]">{previewVideoId}</code>
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
                <motion.div key="letter" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-extrabold text-[#4A3E4E] mb-1">💌 Your Love Letter</label>
                    <p className="text-xs text-[#4A3E4E]/60 mb-3">
                      Separate paragraphs with a blank line. Appears on the stationery card.
                    </p>
                    <textarea
                      value={form.letterContent}
                      onChange={e => setForm(prev => ({ ...prev, letterContent: e.target.value }))}
                      rows={9}
                      placeholder="Write your heartfelt message here…"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-pink-200 focus:border-[#FF4D6D] focus:outline-none text-[#4A3E4E] text-sm bg-white transition-colors resize-none leading-relaxed font-serif"
                    />
                    <p className="text-right text-xs text-[#4A3E4E]/40 mt-1">{form.letterContent.length} characters</p>
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
                <><Check className="w-5 h-5" /> Applied! Closing…</>
              ) : (
                <><Eye className="w-5 h-5" /> Apply Changes & Preview Now</>
              )}
            </motion.button>

            {/* SECONDARY: Generate shareable link */}
            {!generatedLink ? (
              <button
                onClick={handleGenerateLink}
                className="w-full border-2 border-[#FF4D6D] text-[#FF4D6D] hover:bg-pink-50 font-extrabold py-3 rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Link2 className="w-4 h-4" /> Generate Shareable Link ✨
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
                {form.photos.some(p => p.startsWith("data:")) && (
                  <p className="text-xs text-amber-600 text-center font-semibold">
                    ⚠️ Uploaded (LOCAL) photos are excluded from the link. Use image URLs for sharing.
                  </p>
                )}
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
