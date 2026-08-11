import type { Metadata } from "next";
import { MediaLibraryContainer } from "@/containers/media/media-library-container";

export const metadata: Metadata = { title: "Media Library" };

export default function MediaPage() {
  return <MediaLibraryContainer />;
}
