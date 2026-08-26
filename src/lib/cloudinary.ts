// src/lib/cloudinary.ts
// Client-side Cloudinary unsigned upload helper

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dqlv3qg4k",
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default",
};

/**
 * Uploads an image File to Cloudinary via unsigned upload API.
 * Returns the hosted HTTPS secure_url string.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || CLOUDINARY_CONFIG.cloudName;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_CONFIG.uploadPreset;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing: cloud name or upload preset is undefined.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `Cloudinary upload failed with status ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  if (!data.secure_url) {
    throw new Error("Cloudinary response missing secure_url");
  }

  return data.secure_url;
}
