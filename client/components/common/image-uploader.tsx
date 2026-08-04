"use client";

import Image from "next/image";
import { useRef } from "react";
import { CloudUpload, X, ImageIcon } from "lucide-react";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  /** Called with the secure Cloudinary URL once the upload completes. */
  onUpload: (url: string, publicId: string) => void;
  /** Currently set image URL (for edit mode). */
  value?: string;
  /** Clear the current value. */
  onClear?: () => void;
  folder?: string;
  className?: string;
  label?: string;
  hint?: string;
}

/**
 * Drag-and-drop / click-to-browse image uploader backed by Cloudinary.
 * Shows a progress bar while uploading and a preview once done.
 */
export function ImageUploader({
  onUpload,
  value,
  onClear,
  folder = "grabmyticket/events",
  className,
  label = "Event banner",
  hint = "PNG, JPG, WebP — max 10 MB. Recommended 1200 × 630 px.",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, progress, error } = useCloudinaryUpload();

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const result = await upload(file, folder);
    if (result) onUpload(result.secure_url, result.public_id);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  if (value) {
    return (
      <div className={cn("relative overflow-hidden rounded-2xl border border-line", className)}>
        <Image src={value} alt="Event banner preview" fill className="object-cover" sizes="800px" />
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
            aria-label="Remove image"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <p className="text-sm font-medium text-ink">{label}</p>}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line bg-background p-6 text-center transition hover:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      >
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleChange} />
        <div className="flex size-12 items-center justify-center rounded-xl bg-surface">
          {uploading ? <CloudUpload className="size-6 text-brand animate-pulse" /> : <ImageIcon className="size-6 text-ink-muted" />}
        </div>
        {uploading ? (
          <div className="w-full max-w-xs">
            <p className="text-sm font-medium text-ink">Uploading… {progress}%</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
              <div className="h-2 rounded-full bg-brand transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-ink">Drop image here or click to browse</p>
            <p className="text-xs text-ink-muted">{hint}</p>
          </>
        )}
      </div>
      {error && <p className="text-xs text-brand">{error}</p>}
    </div>
  );
}
