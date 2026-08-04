"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2, Copy } from "lucide-react";
import { ImageUploader } from "@/components/common/image-uploader";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  url: string;
  publicId: string;
  name: string;
  size: string;
  uploadedAt: string;
}

const SEED_MEDIA: MediaItem[] = [
  { id: "m1", url: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=60", publicId: "food-1",    name: "food-exhibition.jpg",  size: "1.2 MB", uploadedAt: "Oct 15, 2025" },
  { id: "m2", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=60", publicId: "tech-1", name: "ai-conference.jpg",    size: "980 KB", uploadedAt: "Oct 18, 2025" },
  { id: "m3", url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=60", publicId: "fash-1", name: "fashion-empire.jpg",   size: "1.5 MB", uploadedAt: "Oct 22, 2025" },
  { id: "m4", url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=60", publicId: "camp-1", name: "how-to-camp.jpg",      size: "870 KB", uploadedAt: "Oct 25, 2025" },
  { id: "m5", url: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=60", publicId: "hh-1",   name: "hip-hop-night.jpg",   size: "1.1 MB", uploadedAt: "Oct 28, 2025" },
];

/** Organizer media library — upload new images and manage existing ones. */
export function MediaLibraryContainer() {
  const [items, setItems] = useState<MediaItem[]>(SEED_MEDIA);
  const [copied, setCopied] = useState<string | null>(null);

  function handleUpload(url: string, publicId: string) {
    const newItem: MediaItem = {
      id: `m${Date.now()}`, url, publicId,
      name: publicId.split("/").pop() ?? "image.jpg",
      size: "—", uploadedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setItems((prev) => [newItem, ...prev]);
  }

  function handleCopy(url: string, id: string) {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Assets</p>
        <h1 className="mt-1 font-heading text-2xl font-extrabold text-ink">Media Library</h1>
        <p className="mt-1 text-sm text-ink-muted">Upload and manage images for your events. Powered by Cloudinary.</p>
      </div>

      {/* ── Uploader ── */}
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="mb-3 text-sm font-semibold text-ink">Upload new image</p>
        <ImageUploader
          onUpload={handleUpload}
          folder="grabmyticket/events"
          label=""
          className="min-h-[140px]"
        />
      </div>

      {/* ── Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <article key={item.id} className="group overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="relative h-40">
              <Image src={item.url} alt={item.name} fill sizes="300px" className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" onClick={() => handleCopy(item.url, item.id)}
                  className={cn("flex size-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30", copied === item.id && "bg-positive/60")}
                  aria-label="Copy URL">
                  <Copy className="size-4" />
                </button>
                <button type="button" onClick={() => handleDelete(item.id)}
                  className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-brand/70"
                  aria-label="Delete">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="truncate text-xs font-semibold text-ink">{item.name}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{item.size} · {item.uploadedAt}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
