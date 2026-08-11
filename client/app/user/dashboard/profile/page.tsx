import type { Metadata } from "next";
import { ProfileContainer } from "@/containers/user-dashboard/profile/profile-container";

export const metadata: Metadata = { title: "Profile" };

export default function UserProfilePage() {
  return <ProfileContainer />;
}
