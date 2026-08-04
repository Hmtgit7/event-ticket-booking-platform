/**
 * Cloudinary upload helper.
 *
 * Set these in client/.env.local:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 *
 * Create an *unsigned* upload preset in Cloudinary Dashboard →
 * Settings → Upload → Upload presets → Add preset → Signing mode: Unsigned.
 */

const CLOUD_NAME   = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME   ?? "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  original_filename: string;
}

/**
 * Uploads a single File to Cloudinary via the unsigned upload API.
 * Returns the full response including the `secure_url` you store in your DB.
 *
 * @param file     - The File or Blob to upload.
 * @param folder   - Optional Cloudinary folder path (e.g. "events/banners").
 * @param onProgress - Optional callback receiving upload % (0–100).
 */
export async function uploadToCloudinary(
  file: File,
  folder = "grabmyticket/events",
  onProgress?: (pct: number) => void,
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in .env.local",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResult);
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload network error")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    xhr.open("POST", url);
    xhr.send(formData);
  });
}

/** Returns a Cloudinary transformation URL for consistent resizing. */
export function cloudinaryUrl(
  publicId: string,
  opts: { w?: number; h?: number; fit?: "fill" | "crop" | "scale" } = {},
): string {
  if (!CLOUD_NAME) return "";
  const { w = 1200, h = 630, fit = "fill" } = opts;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_${fit},w_${w},h_${h}/${publicId}`;
}
