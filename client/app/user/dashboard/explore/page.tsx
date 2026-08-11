import type { Metadata } from "next";
import { ExploreContainer } from "@/containers/user-dashboard/explore/explore-container";

export const metadata: Metadata = { title: "Explore" };

export default function UserExplorePage() {
  return <ExploreContainer />;
}
