import type { Metadata } from "next";
import { SavedContainer } from "@/containers/user-dashboard/saved/saved-container";

export const metadata: Metadata = { title: "Saved Events" };

export default function UserSavedPage() {
  return <SavedContainer />;
}
