"use client";

import { useState, useCallback } from "react";
import { uploadToCloudinary, type CloudinaryUploadResult } from "@/lib/cloudinary";

interface UploadState {
  uploading: boolean;
  progress: number;
  result: CloudinaryUploadResult | null;
  error: string | null;
}

/**
 * Hook that wraps `uploadToCloudinary` with loading / progress / error
 * state so form components don't have to manage it themselves.
 *
 * Usage:
 *   const { upload, uploading, progress, result, error } = useCloudinaryUpload();
 *   await upload(file, "grabmyticket/events");
 */
export function useCloudinaryUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    result: null,
    error: null,
  });

  const upload = useCallback(async (file: File, folder?: string) => {
    setState({ uploading: true, progress: 0, result: null, error: null });
    try {
      const result = await uploadToCloudinary(file, folder, (pct) =>
        setState((prev) => ({ ...prev, progress: pct })),
      );
      setState({ uploading: false, progress: 100, result, error: null });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setState({ uploading: false, progress: 0, result: null, error: message });
      return null;
    }
  }, []);

  const reset = useCallback(() =>
    setState({ uploading: false, progress: 0, result: null, error: null }),
  []);

  return { ...state, upload, reset };
}
